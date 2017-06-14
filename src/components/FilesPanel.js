import path from "path";

import React from "react";
import { PageHeader, Panel } from "react-bootstrap";
import { connect } from "react-redux";

import AOIFiles from "./AOIFiles";
import { getAOIFiles } from "../selectors";

const styles = {
  outerUL: {
    columnCount: 3,
    listStyle: "none",
    paddingLeft: 10
  },
  ul: {
    listStyle: "none",
    paddingLeft: 10
  }
};

const DownloadsPanel = ({ aoiFiles, posm, publicFiles }) =>
  <div className="posm-panel">
    <PageHeader>Files</PageHeader>
    <Panel header="Public">
      <p>
        To add to this list, copy files to
        {" "}<a href="smb://posm/public"><code>smb://posm/public</code></a>
        {" "}(Windows: <code>\\POSM\public</code>).
      </p>
      {publicFiles.length > 0 &&
        <ul style={styles.outerUL}>
          {publicFiles.map((file, idx) =>
            <li key={idx}>
              <a href={`${posm}/public${file}`}>
                <code>{path.basename(file)}</code>
              </a>
            </li>
          )}
        </ul>}
    </Panel>
    <AOIFiles files={aoiFiles} posm={posm} style={styles.ul} />
  </div>;

const mapStateToProps = state => ({
  aoiFiles: getAOIFiles(state),
  posm: state.config.posm,
  publicFiles: state.publicFiles
});

export default connect(mapStateToProps)(DownloadsPanel);
