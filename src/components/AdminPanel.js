import { Button, Code, Intent } from "@blueprintjs/core";
import React, { Component } from "react";
import { Button as BSButton, PageHeader, Panel, Well } from "react-bootstrap";
import { connect } from "react-redux";
import { Event } from "react-socket-io";
import { reduxForm } from "redux-form";

import { backup } from "../actions";
import LogModal from "./LogModal";
import { getHostname } from "../selectors";

class AdminPanel extends Component {
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
    const { handleSubmit, hostname, submitting } = this.props;
    const { running, showLogs, statusMessage } = this.state;

    return (
      <div className="posm-panel">
        <Event event="backup-data" handler={this.onMessage} />
        <PageHeader>
          Backups
          <BSButton
            className="pull-right"
            bsSize="small"
            bsStyle="warning"
            onClick={this.showLogs}
          >
            Show Logs
          </BSButton>
        </PageHeader>
        <LogModal onHide={this.hideLogs} event="backup-data" show={showLogs} />
        <Panel>
          <Panel.Body>
            {running && <Well bsSize="small">{statusMessage}</Well>}
            <p>
              This will back up the following datasets to{" "}
              <Code>/opt/data/backups</Code> on the POSM device (available as{" "}
              <a href={`smb://${hostname}/backups`}>
                <Code>
                  smb://
                  {hostname}
                  /backups
                </Code>
              </a>{" "}
              (Windows:{" "}
              <Code>
                \\
                {hostname.toUpperCase()}
                \backups
              </Code>
              )):
            </p>
            <ul>
              <li>ODK/OMK forms</li>
              <li>ODK/OMK submissions</li>
              <li>OMK deployments</li>
              <li>OSM APIDB</li>
              <li>Field Papers database</li>
              <li>Field Papers atlas PDFs</li>
              <li>Field Papers snapshots</li>
              <li>POSM AOIs</li>
            </ul>
            <form onSubmit={handleSubmit}>
              <Button
                text="Backup Data"
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
  hostname: getHostname(state)
});

export default connect(
  mapStateToProps,
  { backup }
)(
  reduxForm({
    form: "backup",
    onSubmit: (values, dispatch, { backup }) => backup(values)
  })(AdminPanel)
);
