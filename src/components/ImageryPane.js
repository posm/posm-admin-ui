import { EditableText } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  ButtonGroup,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Modal,
  Panel,
  Row
} from "react-bootstrap";

import Map from "./Map";
import { highlight } from "../lib";

export default class ImageryPane extends React.Component {
  static defaultProps = {
    refreshInterval: 10000
  };

  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    refreshInterval: PropTypes.number,
    source: PropTypes.object.isRequired
  };

  state = {
    pending: [],
    showModal: false,
    shown: false,
    showSpinner:
      ["PENDING", "RUNNING"].indexOf(
        this.props.source.meta.status.ingest.state
      ) >= 0,
    source: this.props.source,
    sourceName: this.props.source.meta.user.name || this.props.name
  };

  componentDidMount() {
    this.monitor();
  }

  componentWillUpdate(nextProps, nextState) {
    const nextIngestionStatus = nextState.source.meta.status.ingest;
    const ingestionStatus = this.state.source.meta.status.ingest;
    const nextTilingStatus = nextState.source.meta.status.mbtiles;
    const tilingStatus = this.state.source.meta.status.mbtiles;

    if (
      ["SUCCESS", "FAILURE"].indexOf(nextIngestionStatus.state) >= 0 &&
      nextIngestionStatus.state !== ingestionStatus.state
    ) {
      this.setState({
        showSpinner: false
      });
    }

    if (
      ["SUCCESS", "FAILURE"].indexOf(nextTilingStatus.state) >= 0 &&
      nextTilingStatus.state !== tilingStatus.state
    ) {
      this.setState({
        showSpinner: false
      });
    }

    // clear pending states; we're all caught up
    if (nextState.source !== this.state.source) {
      this.setState({
        pending: []
      });
    }
  }

  componentWillUnmount() {
    this.stopMonitoring();
  }

  getButtons() {
    const { endpoint } = this.props;
    const { pending, source } = this.state;
    const { status } = source.meta;

    if (this.isIngesting()) {
      return (
        <Button bsStyle="info">
          Ingesting <i className="fa fa-circle-o-notch fa-spin" />
        </Button>
      );
    }

    if (this.isTiling()) {
      if (pending.indexOf("cancelling") >= 0) {
        return (
          <Button bsStyle="warning">
            Cancelling <i className="fa fa-circle-o-notch fa-spin" />
          </Button>
        );
      }

      return (
        <Button
          bsStyle="warning"
          className="btn btn-warning btn-sm"
          onClick={this.cancel}
        >
          Cancel
        </Button>
      );
    }

    switch (status.ingest.state) {
      case "SUCCESS": {
        if (pending.indexOf("processing") >= 0) {
          return (
            <Button bsStyle="primary">
              Processing <i className="fa fa-circle-o-notch fa-spin" />
            </Button>
          );
        }

        if (status.mbtiles.state !== "SUCCESS") {
          return (
            <Button bsStyle="success" onClick={this.makeMBTiles}>
              Make MBTiles
            </Button>
          );
        }

        return (
          <Button href={`${endpoint}/mbtiles`} bsStyle="success">
            Download MBTiles
          </Button>
        );
      }

      default: {
        return (
          <Button bsStyle="danger">
            Failed
          </Button>
        );
      }
    }
  }

  showModal = () =>
    this.setState({
      showModal: true
    });

  hideModal = () =>
    this.setState({
      showModal: false
    });

  getFailure() {
    const { status } = this.state.source.meta;

    if (
      status.ingest.state !== "FAILURE" &&
      status.mbtiles.state !== "FAILURE"
    ) {
      return null;
    }

    return (
      <Button onClick={this.showModal} bsStyle="link">
        <i className="fa fa-exclamation-triangle red" />
      </Button>
    );
  }

  getMap() {
    if (!this.state.shown || !this.isReady()) {
      return null;
    }
    // TODO make GDAL XML available for download

    const { endpoint, name } = this.props;
    const { source } = this.state;
    const { maxzoom, minzoom } = source;

    const bounds = [
      source.bounds.slice(0, 2).reverse(),
      source.bounds.slice(2, 4).reverse()
    ];
    const url = source.tiles[0];
    const josm = `tms[22]:${url.replace(/{z}/, "{zoom}")}`;

    return (
      <div className="x_content">
        <Row>
          <Form horizontal>
            <FormGroup controlId={`${name}-url`}>
              <Col componentClass={ControlLabel} sm={2}>
                URL:
              </Col>
              <Col sm={10}>
                <FormControl type="text" value={url} readOnly />
              </Col>
            </FormGroup>
            <FormGroup controlId={`${name}-tilejson`}>
              <Col componentClass={ControlLabel} sm={2}>
                TileJSON:
              </Col>
              <Col sm={10}>
                <FormControl type="text" value={endpoint} readOnly />
              </Col>
            </FormGroup>
            <FormGroup controlId={`${name}-josm`}>
              <Col componentClass={ControlLabel} sm={2}>
                JOSM Imagery URL:
              </Col>
              <Col sm={10}>
                <FormControl type="text" value={josm} readOnly />
              </Col>
            </FormGroup>
          </Form>
        </Row>
        <Row>
          <Map bounds={bounds} maxzoom={maxzoom} minzoom={minzoom} url={url} />
        </Row>
      </div>
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

  getSource() {
    const { endpoint } = this.props;

    fetch(endpoint)
      .then(rsp => {
        if (!rsp.ok) {
          console.log("bad response");
        }

        return rsp.json();
      })
      .then(source => {
        this.setState({
          source
        });
      })
      .catch(err => {
        console.warn(err.stack);
      });
  }

  shouldShowSpinner() {
    return this.state.showSpinner;
  }

  cancel = () => {
    let { pending } = this.state;

    if (pending.indexOf("cancelling") >= 0) {
      throw new Error("Already cancelling.");
    }

    pending.push("cancelling");

    this.setState({
      pending
    });

    const { endpoint } = this.props;

    fetch(`${endpoint}/mbtiles`, {
      method: "DELETE"
    })
      .then(rsp => {
        console.log("rsp:", rsp);

        pending = this.state.pending;
        pending.splice(pending.indexOf("cancelling"), 1);

        this.setState({
          pending
        });

        if (rsp.status >= 400) {
          // TODO display the underlying error message
          throw new Error("Failed.");
        }
      })
      .catch(err => {
        console.warn(err.stack);
      });
  };

  monitor() {
    const { refreshInterval } = this.props;

    this.statusChecker = setInterval(() => this.getSource(), refreshInterval);
  }

  stopMonitoring() {
    clearInterval(this.statusChecker);
  }

  makeMBTiles = () => {
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

    fetch(`${endpoint}/mbtiles`, {
      method: "POST"
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

  isReady() {
    const { ingest } = this.state.source.meta.status;

    return ingest.state === "SUCCESS";
  }

  isIngesting() {
    const { ingest } = this.state.source.meta.status;

    return ["PENDING", "RUNNING"].indexOf(ingest.state) >= 0;
  }

  isTiling() {
    const { mbtiles } = this.state.source.meta.status;

    return ["PENDING", "RUNNING"].indexOf(mbtiles.state) >= 0;
  }

  isRunning() {
    return this.isIngesting() || this.isTiling();
  }

  toggle = () => {
    this.setState({
      shown: !this.state.shown
    });
  };

  updateMetadata(body) {
    const { endpoint } = this.props;

    // update metadata
    fetch(endpoint, {
      body: JSON.stringify(body),
      method: "PATCH"
    })
      .then(rsp => this.getSource())
      .catch(err => console.warn(err.stack));
  }

  updateSourceName = sourceName => {
    this.setState({
      sourceName
    });

    this.updateMetadata({
      name: sourceName
    });
  };

  render() {
    const { showModal, shown, source, sourceName } = this.state;

    // TODO delete button
    const buttons = this.getButtons();
    const failure = this.getFailure();
    const spinner = this.getSpinner();
    const map = this.getMap();

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
              defaultValue={sourceName}
              onConfirm={this.updateSourceName}
              selectAllOnFocus
              className="baseline"
            />
            {spinner}
            <div className="pull-right">
              <ButtonGroup bsSize="small">
                {buttons}
              </ButtonGroup>
              {failure}
            </div>
          </div>
        }
      >
        <Modal show={showModal} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{sourceName} Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre
              dangerouslySetInnerHTML={{
                __html: highlight(
                  JSON.stringify(
                    {
                      source
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

        {map}
      </Panel>
    );
  }
}
