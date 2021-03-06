import { Button, H3, Intent } from "@blueprintjs/core";
import React, { Component } from "react";
import { Button as BSButton, PageHeader, Panel, Well } from "react-bootstrap";
import { connect } from "react-redux";
import { Event } from "react-socket-io";
import { Field, reduxForm } from "redux-form";

import { createDeployment } from "../actions";
import LogModal from "./LogModal";
import { renderTextInput } from "../lib";
import { getPOSMEndpoint } from "../selectors";

class DeploymentPanel extends Component {
  state = {};

  showLogs = () =>
    this.setState({
      showLogs: true
    });

  hideLogs = () =>
    this.setState({
      showLogs: false
    });

  onMessage = message => {
    const {
      status: { complete, initialized, msg }
    } = message;

    this.setState({
      running: initialized && !complete,
      statusMessage: msg
    });
  };

  componentWillUpdate(nextProps, nextState) {
    const { complete } = nextProps;
    const { running: wasRunning } = this.state;

    if (wasRunning && complete) {
      // reset running since we probably dropped a message
      this.setState({
        running: false
      });
    }
  }

  render() {
    const { deployments, handleSubmit, posm, submitting } = this.props;
    const { running, showLogs, statusMessage } = this.state;

    return (
      <div className="posm-panel">
        <Event event="atlas-deploy" handler={this.onMessage} />
        <PageHeader>
          OpenMapKit Deployments
          <BSButton
            className="pull-right"
            bsSize="small"
            bsStyle="warning"
            onClick={this.showLogs}
          >
            Show Logs
          </BSButton>
        </PageHeader>
        <LogModal onHide={this.hideLogs} event="atlas-deploy" show={showLogs} />
        <Panel>
          <Panel.Body>
            <p>
              Deployments are bundles of OSM XML data and MBTiles archives
              intended to facilitate enumeration and validation of features.
              These can be downloaded using the{" "}
              <span className="bp3-icon-standard bp3-icon-cog" /> menu within
              OpenMapKit Android when connected to the POSM WiFi network.
            </p>
            <hr />
            <H3>Available Deployments</H3>
            {deployments.length > 0 ? (
              <ul>
                {deployments.map(({ description, name, title }, i) => (
                  <li key={i}>
                    <a
                      href={`${posm}/fp/atlases/${name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {title}{" "}
                      {description && (
                        <span>
                          {" "}
                          - <em>{description}</em>
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>None loaded.</p>
            )}
            <hr />
            <H3>Create a New Deployment</H3>
            {running && <Well bsSize="small">{statusMessage}</Well>}
            <p>
              To create a new OMK Deployment, either create an atlas using the{" "}
              <a href={`${posm}/fp/`} target="_blank" rel="noopener noreferrer">
                local Field Papers instance
              </a>{" "}
              or paste in the publicly-accessibly URL of a Field Papers atlas
              (from <a href="http://fieldpapers.org/">fieldpapers.org</a> or
              elsewhere).
            </p>
            <form onSubmit={handleSubmit}>
              <div className="bp3-form-group bp3-control-group">
                <Field
                  name="url"
                  component={renderTextInput}
                  label="Field Papers Atlas GeoJSON URL"
                  placeholder="http://fieldpapers.org/atlases/4ncr1bzn.geojson"
                  className="url"
                />
              </div>
              <Button
                text="Create"
                type="submit"
                disabled={submitting || running}
                intent={Intent.PRIMARY}
                rightIcon="arrow-right"
              />
            </form>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  complete: state.tasks.deployments.complete,
  deployments: state.deployments,
  posm: getPOSMEndpoint(state)
});

export default connect(
  mapStateToProps,
  { createDeployment }
)(
  reduxForm({
    form: "createDeployment",
    onSubmit: ({ url }, dispatch, { createDeployment }) => createDeployment(url)
  })(DeploymentPanel)
);
