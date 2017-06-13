import { Button, Intent } from "@blueprintjs/core";
import React, { Component } from "react";
import { Button as BSButton, PageHeader, Panel, Well } from "react-bootstrap";
import { connect } from "react-redux";
import { Event } from "react-socket-io";
import { reduxForm } from "redux-form";

import { backup } from "../actions";
import LogModal from "./LogModal";

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
    const { status: { complete, initialized, msg } } = message;

    this.setState({
      running: initialized && !complete,
      statusMessage: msg
    });
  };

  render() {
    const { handleSubmit, submitting } = this.props;
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
          {running && <Well bsSize="small">{statusMessage}</Well>}
          <p>
            This will back up the following datasets to
            {" "}<code>/opt/data/backups</code> on the POSM device (available as
            {" "}
            <a href="smb://posm/backups"><code>smb://posm/backups</code></a>):
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
              rightIconName="arrow-right"
            />
          </form>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posm: state.config.posm
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "backup",
    onSubmit: (values, dispatch, { posm }) => dispatch(backup(posm, values))
  })(AdminPanel)
);
