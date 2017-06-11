import { NonIdealState } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  Modal,
  PageHeader,
  Panel
} from "react-bootstrap";

import ProjectPane from "../components/ProjectPane";

const config = {
  imageryEndpoint: "http://posm.local",
  odmEndpoint: "http://posm.local"
};

export default class Index extends React.Component {
  static defaultProps = {
    endpoint: config.odmEndpoint,
    imageryEndpoint: config.imageryEndpoint
  };

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

  getProjects = () => {
    const { endpoint } = this.props;

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

    if (loading) {
      return <i className="fa fa-refresh fa-spin" />;
    }

    return <a onClick={this.getProjects}><i className="fa fa-refresh" /></a>;
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

  saveProject = evt => {
    evt.preventDefault();

    const { endpoint } = this.props;
    const { projectName } = this.state;

    if (projectName !== "") {
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

    // reset the new project name for the next upload
    this.setState({
      projectName: ""
    });

    this.close();
  };

  updateProjectName = evt => {
    this.setState({
      projectName: evt.target.value
    });
  };

  render() {
    const { endpoint, imageryEndpoint } = this.props;

    // TODO sort alphabetically (not by UUID)
    const projects = Object.keys(this.state.projects).map(name =>
      <ProjectPane
        key={name}
        name={name}
        project={this.state.projects[name]}
        endpoint={`${endpoint}/projects/${name}`}
        imageryEndpoint={imageryEndpoint}
      />
    );

    const { projectName } = this.state;

    return (
      <div className="posm-panel">
        <PageHeader>
          OpenDroneMap <small>Projects {this.getRefreshSpinner()}</small>
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
            <Form horizontal onSubmit={this.saveProject}>
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

        <Panel>
          <NonIdealState
            visual="airplane"
            title="No Projects"
            action={
              <Button bsSize="small" bsStyle="primary" onClick={this.open}>
                Create a New Project
              </Button>
            }
          />
          {projects}
        </Panel>
      </div>
    );
  }
}
