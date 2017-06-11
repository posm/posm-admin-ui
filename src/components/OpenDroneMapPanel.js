import { NonIdealState } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  Modal,
  PageHeader
} from "react-bootstrap";
import { connect } from "react-redux";

import ProjectPane from "../components/ProjectPane";

class OpenDroneMapPanel extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    imageryEndpoint: PropTypes.string.isRequired
  };

  state = {
    projectName: "",
    projects: {},
    showModal: false
  };

  componentDidMount() {
    this.getProjects();
  }

  componentWillUpdate(nextProps, nextState) {
    const { endpoint } = this.props;

    if (endpoint !== nextProps.endpoint) {
      this.getProjects();
    }
  }

  getProjects = () => {
    const { endpoint } = this.props;

    if (endpoint == null) {
      return;
    }

    this.setState({
      loading: true
    });

    return fetch(`${endpoint}/projects`)
      .then(rsp => rsp.json())
      .then(projects =>
        this.setState({
          loading: false,
          projects
        })
      )
      .catch(err => console.warn(err.stack));
  };

  getRefreshSpinner() {
    const { loading } = this.state;

    return (
      <Button
        bsStyle="link"
        bsSize="large"
        onClick={loading ? null : this.getProjects}
      >
        <i className={loading ? "fa fa-refresh fa-spin" : "fa fa-refresh"} />
      </Button>
    );
  }

  close = () => {
    this.setState({
      showModal: false
    });
  };

  open = () => {
    this.setState({
      showModal: true
    });
  };

  updateProjectName = projectName => {
    this.setState({
      projectName
    });

    const { endpoint } = this.props;

    if (projectName !== this.state.projectName) {
      // update metadata
      fetch(`${endpoint}/projects`, {
        body: JSON.stringify({
          name: projectName
        }),
        method: "PUT"
      })
        .then(rsp => this.getProjects())
        .catch(err => console.warn(err.stack));
    }
  };

  render() {
    const { endpoint, imageryEndpoint } = this.props;
    const { projects } = this.state;

    const projectPanes = Object.keys(projects)
      .sort(
        (a, b) => (projects[a].user.name || a) > (projects[b].user.name || b)
      )
      .map(name =>
        <ProjectPane
          key={name}
          name={name}
          project={projects[name]}
          endpoint={`${endpoint}/projects/${name}`}
          imageryEndpoint={imageryEndpoint}
        />
      );

    const { projectName } = this.state;

    return (
      <div className="posm-panel">
        <PageHeader>
          OpenDroneMap {this.getRefreshSpinner()}
          <Button
            className="pull-right"
            bsSize="small"
            bsStyle="primary"
            onClick={this.open}
          >
            New Project
          </Button>
        </PageHeader>

        <Modal
          show={this.state.showModal}
          onHide={this.close}
          onExit={this.getProjects}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.saveProject}>
              <FormGroup>
                <FormControl
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  onChange={this.updateProjectName}
                  autoFocus="true"
                />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
            <Button bsStyle="primary" onClick={this.saveProject}>Create</Button>
          </Modal.Footer>
        </Modal>

        {projectPanes.length === 0
          ? <NonIdealState
              visual="airplane"
              title="No Projects"
              action={
                <Button bsSize="small" bsStyle="primary" onClick={this.open}>
                  Create a New Project
                </Button>
              }
            />
          : projectPanes}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  imageryEndpoint: state.config.imageryEndpoint,
  endpoint: state.config.odmEndpoint
});

export default connect(mapStateToProps)(OpenDroneMapPanel);
