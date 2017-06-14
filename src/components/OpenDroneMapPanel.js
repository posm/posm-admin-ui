import { NonIdealState } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import { Button, Form, FormGroup, Modal, PageHeader } from "react-bootstrap";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import ProjectPane from "../components/ProjectPane";
import { createODMProject, getODMProjects } from "../actions";
import { renderTextInput } from "../lib";
import { getODMEndpoint } from "../selectors";

class OpenDroneMapPanel extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    imageryEndpoint: PropTypes.string.isRequired
  };

  state = {
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
    const { getODMProjects } = this.props;

    getODMProjects();
  };

  getRefreshSpinner() {
    const { loading } = this.props;

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

  close = () =>
    this.setState({
      showModal: false
    });

  open = () =>
    this.setState({
      showModal: true
    });

  onSubmit = ({ projectName }, dispatch, { createODMProject }) => {
    createODMProject(projectName);

    this.close();
  };

  render() {
    const {
      endpoint,
      handleSubmit: _handleSubmit,
      imageryEndpoint,
      pristine,
      projects,
      submitting
    } = this.props;

    const handleSubmit = _handleSubmit(this.onSubmit);

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
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <Field
                  name="projectName"
                  component={renderTextInput}
                  placeholder="Project Name"
                  style={{ width: "100%" }}
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
              <Button
                bsStyle="primary"
                type="submit"
                disabled={pristine || submitting}
              >
                Create
              </Button>
            </Modal.Footer>
          </Form>
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
  endpoint: getODMEndpoint(state),
  imageryEndpoint: state.config.imageryEndpoint,
  loading: state.odm.loading,
  projects: state.odm.projects
});

export default connect(mapStateToProps, { createODMProject, getODMProjects })(
  reduxForm({
    form: "createODMProject"
  })(OpenDroneMapPanel)
);
