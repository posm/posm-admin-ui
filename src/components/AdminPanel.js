import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { PageHeader, Panel } from "react-bootstrap";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";

import { backup } from "../actions";

const AdminPanel = ({ handleSubmit, submitting }) =>
  <div className="posm-panel">
    <PageHeader>Backups</PageHeader>
    <Panel>
      <p>
        This will back up the following datasets to
        {" "}<code>/opt/data/backups</code> on the POSM device (available as
        {" "}<a href="smb://posm/backups"><code>smb://posm/backups</code></a>):
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
  </div>;

const mapStateToProps = state => ({
  posm: state.config.posm
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "backup",
    onSubmit: (values, dispatch, { posm }) => dispatch(backup(posm, values))
  })(AdminPanel)
);
