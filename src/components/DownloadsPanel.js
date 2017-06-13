import { basename } from "path";

import React from "react";
import { PageHeader, Panel } from "react-bootstrap";
import { connect } from "react-redux";

const availableDownloads = [
  {
    url: "downloads/ODKCollect_v1.4.1.apk",
    name: "OpenDataKit (ODK Collect for Android)"
  },
  {
    url: "downloads/OpenMapKit_v1.2.apk",
    name: "OpenMapKit (Android)"
  },
  {
    url: "downloads/jre_8u11-windows-i586.exe",
    name: "Java JRE (32-bit Windows)"
  },
  {
    url: "downloads/jre_8u11-windows-x64.exe",
    name: "Java JRE (64-bit Windows)"
  },
  {
    url: "downloads/jre_8u11-macosx-x64.dmg",
    name: "Java JRE (macOS)"
  },
  {
    url: "downloads/josm.jar",
    name: "JOSM"
  },
  {
    url: "downloads/QGIS-OSGeo4W-2.18.0-1-Setup-x86.exe",
    name: "QGIS (32-bit Windows)"
  },
  {
    url: "downloads/QGIS-OSGeo4W-2.18.0-1-Setup-x86_64.exe",
    name: "QGIS (64-bit Windows)"
  },
  {
    url: "downloads/QGIS-2.18.0-1.dmg",
    name: "QGIS (macOS)"
  }
];

const styles = {
  ul: {
    columnCount: 3,
    listStyle: "none"
  }
};

const DownloadsPanel = ({ posm, publicFiles }) =>
  <div className="posm-panel">
    <PageHeader>Downloads</PageHeader>
    <Panel header="System">
      <ul style={styles.ul}>
        {availableDownloads.map((x, idx) =>
          <li key={idx}><a href={x.url}>{x.name}</a></li>
        )}
      </ul>
    </Panel>
    {publicFiles.length > 0 &&
      <Panel header="Misc.">
        <p>
          To add to this list, copy files to
          {" "}<a href="smb://posm/public"><code>smb://posm/public</code></a>
          {" "}(Windows: <code>\\POSM\public</code>).
        </p>
        <ul style={styles.ul}>
          {publicFiles.map((path, idx) =>
            <li key={idx}>
              <a href={`${posm}/public${path}`}>{basename(path)}</a>
            </li>
          )}
        </ul>
      </Panel>}
  </div>;

const mapStateToProps = state => ({
  posm: state.config.posm,
  publicFiles: state.publicFiles
});

export default connect(mapStateToProps)(DownloadsPanel);
