import { Button, Intent } from "@blueprintjs/core";
import React, { Component } from "react";
import { Button as BSButton, PageHeader, Panel } from "react-bootstrap";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";

import { backup } from "../actions";
import LogModal from "./LogModal";

class AdminPanel extends Component {
  state = {
    showLogs: false
  };

  showLogs = () =>
    this.setState({
      showLogs: true
    });

  hideLogs = () =>
    this.setState({
      showLogs: false
    });

  render() {
    const { handleSubmit, submitting } = this.props;
    const { showLogs } = this.state;

    return (
      <div className="posm-panel">
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
              disabled={submitting}
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
