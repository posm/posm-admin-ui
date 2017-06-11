import { EditableText, Tab2, Tabs2 } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import { Button, ButtonGroup, Modal, Panel } from "react-bootstrap";

import { highlight } from "../lib";
import ProjectOutputPanel from "./ProjectOutputPanel";
import ProjectSourcesPanel from "./ProjectSourcesPanel";

export default class ProjectPane extends React.Component {
  static defaultProps = {
    refreshInterval: 10000
  };

  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    imageryEndpoint: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    refreshInterval: PropTypes.number
  };

  state = {
    ingesting: false,
    pending: [],
    project: this.props.project,
    projectName: this.props.project.user.name || this.props.name,
    showModal: false,
    shown: false,
    showSpinner: false,
    tiling: false
  };

  componentDidMount() {
    this.monitor();
  }

  componentWillUpdate(nextProps, nextState) {
    const nextStatus = nextState.project.status;
    const { status } = this.state.project;

    if (
      ["SUCCESS", "FAILURE", "REVOKED"].indexOf(nextStatus.state) >= 0 &&
      nextStatus.state !== status.state
    ) {
      this.setState({
        showSpinner: false
      });
    }

    // clear pending states; we're all caught up
    if (nextState.project !== this.state.project) {
      this.setState({
        pending: [],
        projectName: nextState.project.user.name || this.props.name
      });
    }
  }

  componentWillUnmount() {
    this.stopMonitoring();
  }

  getDeleteButton() {
    const { pending } = this.state;

    if (pending.indexOf("deleting") >= 0) {
      return (
        <Button bsStyle="danger">
          Deleting <i className="fa fa-circle-o-notch fa-spin" />
        </Button>
      );
    }

    return (
      <Button bsStyle="danger" onClick={this.delete}>
        Delete
      </Button>
    );
  }

  getIngestButton() {
    const { ingesting, pending, project } = this.state;
    const { user } = project;

    if (ingesting || pending.indexOf("ingesting") >= 0) {
      return (
        <Button bsStype="warning">
          Ingesting <i className="fa fa-circle-o-notch fa-spin" />
        </Button>
      );
    }

    if (user.imagery == null && pending.indexOf("mbtiles") < 0) {
      return (
        <Button bsStyle="info" onClick={this.ingestSource}>
          Ingest
        </Button>
      );
    }

    return null;
  }

  getMBTilesButton() {
    const { user } = this.state.project;
    const { pending, tiling } = this.state;

    if (tiling || pending.indexOf("mbtiles") >= 0) {
      return (
        <Button bsStyle="warning">
          Making MBTiles <i className="fa fa-circle-o-notch fa-spin" />
        </Button>
      );
    }

    if (user.mbtiles == null) {
      if (pending.indexOf("ingesting") >= 0) {
        return (
          <Button bsStyle="info">
            Make MBTiles
          </Button>
        );
      }

      return (
        <Button bsStyle="info" onClick={this.makeMBTiles}>
          Make MBTiles
        </Button>
      );
    }

    return (
      <Button href={user.mbtiles} bsStyle="success">
        Download MBTiles
      </Button>
    );
  }

  getButtons() {
    const { endpoint } = this.props;
    const { pending, project } = this.state;
    const { status } = project;

    if (this.isRunning()) {
      if (pending.indexOf("cancelling") >= 0) {
        return (
          <Button bsStyle="warning">
            Cancelling <i className="fa fa-circle-o-notch fa-spin" />
          </Button>
        );
      }

      return (
        <Button bsStyle="warning" onClick={this.cancel}>
          Cancel
        </Button>
      );
    }

    switch (status.state) {
      case "SUCCESS": {
        return (
          <ButtonGroup bsSize="small">
            <Button
              bsStyle="success"
              href={`${endpoint}/artifacts/odm_orthophoto.tif`}
            >
              Download GeoTIFF
            </Button>
            {this.getIngestButton()}
            {this.getMBTilesButton()}
          </ButtonGroup>
        );
      }

      case "FAILURE":
      case "REVOKED": {
        if (pending.indexOf("processing") >= 0 && !this.isRunning()) {
          return (
            <Button bsStyle="info">
              Re-processing <i className="fa fa-circle-o-notch fa-spin" />
            </Button>
          );
        }

        return (
          <Button bsStyle="info" onClick={this.reprocess}>
            Re-process
          </Button>
        );
      }

      default: {
        if (pending.indexOf("processing") >= 0 && !this.isRunning()) {
          return (
            <Button bsStyle="info">
              Processing <i className="fa fa-circle-o-notch fa-spin" />
            </Button>
          );
        }

        return (
          <Button bsStyle="info" onClick={this.process}>
            Process
          </Button>
        );
      }
    }
  }

  getFailure() {
    const { status } = this.state.project;

    if (status.state !== "FAILURE") {
      return null;
    }

    return (
      <Button onClick={this.showModal} bsStyle="link">
        <i className="fa fa-exclamation-triangle red" />
      </Button>
    );
  }

  getSpinner() {
    if (this.shouldShowSpinner()) {
      return (
        <Button onClick={this.showModal} bsStyle="link">
          <i className="fa fa-circle-o-notch fa-spin blue" />
        </Button>
      );
    }

    return null;
  }

  getProject = (callback = () => {}) => {
    const { endpoint } = this.props;

    fetch(endpoint)
      .then(rsp => {
        if (!rsp.ok) {
          console.log("bad response");
        }

        return rsp.json();
      })
      .then(project => {
        this.setState({
          project
        });

        callback(project);
      })
      .catch(err => {
        console.warn(err.stack);
      });
  };

  shouldShowSpinner() {
    return this.state.showSpinner;
  }

  cancel = () => {
    const { endpoint } = this.props;
    const { pending } = this.state;

    if (pending.indexOf("cancelling") >= 0) {
      throw new Error("Already cancelling.");
    }

    pending.push("cancelling");

    this.setState({
      pending,
      showSpinner: true
    });

    fetch(`${endpoint}/process`, {
      method: "DELETE"
    })
      .then(rsp => {
        if (rsp.status >= 400) {
          // TODO display the underlying error message
          throw new Error("Failed.");
        }
      })
      .catch(err => {
        console.warn(err.stack);
      });
  };

  toggle = () => {
    this.setState({
      shown: !this.state.shown
    });
  };

  updateProjectName = projectName => {
    this.setState({
      projectName
    });

    this.updateMetadata({
      name: projectName
    });
  };

  showModal = () =>
    this.setState({
      showModal: true
    });

  hideModal = () =>
    this.setState({
      showModal: false
    });

  delete = () => {
    const { endpoint } = this.props;
    let { pending } = this.state;

    if (pending.indexOf("deleting") >= 0) {
      throw new Error("Already deleting.");
    }

    pending.push("deleting");
    this.setState({
      pending,
      showSpinner: true
    });

    fetch(`${endpoint}`, {
      method: "DELETE"
    })
      .then(rsp => {
        console.log("rsp:", rsp);

        if (rsp.status >= 400) {
          // TODO display the underlying error message
          throw new Error("Failed.");
        }

        pending = this.state.pending;
        pending.splice(pending.indexOf("deleting"), 1);

        this.setState({
          pending,
          showSpinner: false
        });
      })
      .catch(err => {
        console.warn(err.stack);
      });
  };

  checkIngestionStatus(sourceUrl, failureCallback, successCallback) {
    fetch(`${sourceUrl}/ingest/status`)
      .then(rsp => rsp.json())
      .then(status => {
        console.log("Ingestion status:", status);
        switch (status.state) {
          case "FAILURE":
          case "REVOKED": {
            this.setState({
              ingesting: false
            });

            failureCallback(status);

            break;
          }

          case "SUCCESS": {
            this.setState({
              ingesting: false
            });

            successCallback(status);

            break;
          }

          default:
        }
      })
      .catch(err => console.warn(err.stack));
  }

  updateMetadata(body) {
    const { endpoint } = this.props;

    console.log("Updating metadata with", body);

    // update metadata
    fetch(endpoint, {
      body: JSON.stringify(body),
      method: "PATCH"
    })
      .then(rsp => this.getProject())
      .catch(err => console.warn(err.stack));
  }

  ingestSource = () => {
    console.log("Ingesting source...");

    const { refreshInterval } = this.props;
    const { pending } = this.state;

    if (pending.indexOf("ingesting") >= 0) {
      throw new Error("Ingestion already in process.");
    }

    pending.push("ingesting");

    // start spinner
    this.setState({
      pending
    });

    // trigger ingestion
    this.ingest(sourceUrl => {
      this.setState({
        ingesting: true
      });

      // update metadata
      this.updateMetadata({
        imagery: sourceUrl
      });

      // TODO move interval into ingest()
      const imageryChecker = setInterval(() => {
        this.checkIngestionStatus(
          sourceUrl,
          status => {
            console.warn("Ingestion failed:", status);
            clearInterval(imageryChecker);
          },
          status => {
            console.log("Ingestion complete:", status);
            clearInterval(imageryChecker);
          }
        );
      }, refreshInterval);
    });
  };

  monitor() {
    const { refreshInterval } = this.props;

    this.checker = setInterval(() => {
      this.getProject(project => {
        const { pending } = this.state;

        if (
          pending.indexOf("cancelling") >= 0 &&
          project.status.state === "REVOKED"
        ) {
          pending.splice(pending.indexOf("cancelling"), 1);

          this.setState({
            pending
          });
        }
      });
    }, refreshInterval);
  }

  stopMonitoring() {
    clearInterval(this.checker);
  }

  ingest(callback) {
    const { endpoint, imageryEndpoint } = this.props;
    const { project, projectName } = this.state;

    fetch(
      `${imageryEndpoint}/imagery/ingest?url=${encodeURIComponent(
        `${endpoint}/artifacts/odm_orthophoto.tif`
      )}`,
      {
        method: "POST"
      }
    )
      .then(rsp => rsp.json())
      .then(rsp => {
        callback(rsp.source);

        if (project.name !== projectName) {
          // update imagery metadata
          fetch(rsp.source, {
            body: JSON.stringify({
              name: projectName
            }),
            method: "PATCH"
          }).catch(err => console.warn(err.stack));
        }
      })
      .catch(err => console.warn(err.stack));
  }

  requestMBTiles(endpoint, failureCallback) {
    const { refreshInterval } = this.props;

    this.setState({
      tiling: true
    });

    fetch(`${endpoint}/mbtiles`, {
      method: "POST"
    })
      .then(rsp => {
        const mbtilesChecker = setInterval(() => {
          fetch(`${endpoint}/mbtiles/status`)
            .then(rsp => rsp.json())
            .then(status => {
              switch (status.state) {
                case "FAILURE":
                case "REVOKED": {
                  this.setState({
                    tiling: false
                  });

                  clearInterval(mbtilesChecker);

                  failureCallback(status);

                  break;
                }

                case "SUCCESS": {
                  this.setState({
                    tiling: false
                  });

                  clearInterval(mbtilesChecker);

                  break;
                }

                default:
              }
            })
            .catch(err => console.warn(err.stack));
        }, refreshInterval);
      })
      .catch(err => console.warn(err.stack));
  }

  makeMBTiles = () => {
    console.log("Requesting MBTiles generation...");

    const { refreshInterval } = this.props;
    const { pending } = this.state;
    const { user } = this.state.project;

    if (pending.indexOf("mbtiles") >= 0) {
      throw new Error("MBTiles generation already in process.");
    }

    if (user.imagery) {
      // imagery already ingested
      pending.push("mbtiles");

      // start spinner
      this.setState({
        pending
      });

      // TODO do this after we know that the archive was successfully made
      this.updateMetadata({
        mbtiles: `${user.imagery}/mbtiles`
      });

      return this.requestMBTiles(user.imagery, status => {
        console.warn("MBTiles generation failed:", status);
      });
    }

    pending.push("ingesting");
    pending.push("mbtiles");

    // start spinner
    this.setState({
      pending
    });

    // trigger ingestion
    return this.ingest(sourceUrl => {
      const imageryChecker = setInterval(() => {
        this.checkIngestionStatus(
          sourceUrl,
          status => {
            console.warn("Ingestion failed:", status);
            clearInterval(imageryChecker);
          },
          status => {
            this.updateMetadata({
              imagery: sourceUrl,
              // TODO update mbtiles after we know that the archive was successfully made
              mbtiles: `${sourceUrl}/mbtiles`
            });

            clearInterval(imageryChecker);

            this.requestMBTiles(sourceUrl, status => {
              console.warn("MBTiles generation failed:", status);
            });
          }
        );
      }, refreshInterval);
    });
  };

  process = (force = false) => {
    const { pending } = this.state;

    if (pending.indexOf("processing") >= 0) {
      throw new Error("Already processing.");
    }

    pending.push("processing");

    this.setState({
      pending,
      showSpinner: true
    });

    const { endpoint } = this.props;
    let qs = "";

    if (force) {
      qs += "force=true";
    }

    fetch(`${endpoint}/process?${qs}`, {
      method: "POST"
    })
      .then(rsp => {
        console.log("rsp:", rsp);
        if (rsp.status >= 400) {
          // TODO display the underlying error message
          throw new Error("Failed.");
        }
      })
      .catch(err => {
        console.warn(err.stack);
      });
  };

  reprocess = () => {
    this.process(true);
  };

  isRunning() {
    const { status } = this.state.project;

    return ["PENDING", "RUNNING"].indexOf(status.state) >= 0;
  }

  render() {
    const { project, projectName, showModal, shown } = this.state;
    const { artifacts, images, status } = project;

    const buttons = this.getButtons();
    // const deleteButton = this.getDeleteButton();
    const failure = this.getFailure();
    const spinner = this.getSpinner();

    return (
      <Panel
        className="possibly-empty"
        header={
          <div>
            <a tabIndex="-1" onClick={this.toggle} className="toggle">
              <span
                className={
                  shown
                    ? "pt-icon-standard pt-icon-minus"
                    : "pt-icon-standard pt-icon-plus"
                }
              />
            </a>
            <EditableText
              defaultValue={projectName}
              onConfirm={this.updateProjectName}
              selectAllOnFocus
              className="baseline"
            />
            {failure} {spinner}
            <div className="pull-right">
              <ButtonGroup bsSize="small">
                {buttons}
                {/* TODO wire this up (needs API implementation) deleteButton */}
              </ButtonGroup>
            </div>
          </div>
        }
      >
        <Modal show={showModal} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{projectName} Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre
              dangerouslySetInnerHTML={{
                __html: highlight(
                  JSON.stringify(
                    {
                      project
                    },
                    null,
                    2
                  ),
                  "json"
                )
              }}
            />
          </Modal.Body>
        </Modal>

        {shown &&
          <Tabs2
            id={projectName}
            // onChange={this.handleNavbarTabChange}
            defaultSelectedTabId={status.state != null ? "Output" : "Sources"}
          >
            <Tab2
              id="Sources"
              title="Sources"
              panel={
                <ProjectSourcesPanel
                  {...this.props}
                  getProject={this.getProject}
                  project={project}
                  sources={images}
                />
              }
            />
            <Tab2
              id="Output"
              title="Output"
              panel={
                <ProjectOutputPanel
                  {...this.props}
                  artifacts={artifacts}
                  project={project}
                />
              }
            />
          </Tabs2>}
      </Panel>
    );
  }
}
