import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { PageHeader, Panel } from "react-bootstrap";

const AdminPanel = () =>
  <div className="posm-panel">
    <PageHeader>Backups</PageHeader>
    <Panel>
      <p>
        This will back up the following datasets to
        {" "}<code>/opt/data/backups</code> on the POSM device (available as
        {" "}<a href="smb://posm/backups"><code>smb://posm/backups</code></a>):
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
      </p>
      <form>
        <Button
          text="Backup Data"
          intent={Intent.PRIMARY}
          rightIconName="arrow-right"
        />
      </form>
    </Panel>
  </div>;

AdminPanel.propTypes = {};

export default AdminPanel;
