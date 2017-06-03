import { FocusStyleManager } from "@blueprintjs/core";
import React, { Component } from "react";

import AdminPanel from "./components/AdminPanel";
import AOIPanel from "./components/AOIPanel";
import DownloadsPanel from "./components/DownloadsPanel";
import HomePanel from "./components/HomePanel";
import ImageryPanel from "./components/ImageryPanel";
import OpenDroneMapPanel from "./components/OpenDroneMapPanel";
import SettingsPanel from "./components/SettingsPanel";
import Sidebar from "./components/Sidebar";

FocusStyleManager.onlyShowFocusOnTabs();

class App extends Component {
  render() {
    return (
      <div>
        {/* TODO extract navbar */}
        <nav className="pt-navbar pt-fixed-top pt-dark">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">POSM</div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <a
              href="/omk/"
              target="_blank"
              rel="noopener noreferrer"
              className="pt-button pt-minimal pt-icon-mobile-phone"
            >
              OMK
            </a>
            <a
              href="/fp/"
              target="_blank"
              rel="noopener noreferrer"
              className="pt-button pt-minimal pt-icon-clipboard"
            >
              FP
            </a>
            {/* TODO don't hard-code this */}
            <a
              href="http://osm.posm.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="pt-button pt-minimal pt-icon-send-to-map"
            >
              OSM
            </a>
            <span className="pt-navbar-divider" />
            <button className="pt-button pt-minimal pt-icon-cog" />
          </div>
        </nav>
        <Sidebar>
          <HomePanel />
          <AOIPanel />
          <OpenDroneMapPanel />
          <ImageryPanel />
          <DownloadsPanel />
          <AdminPanel />
          <SettingsPanel />
        </Sidebar>
      </div>
    );
  }
}

export default App;
