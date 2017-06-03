import { FocusStyleManager } from "@blueprintjs/core";
import React, { Component } from "react";

import AdminPanel from "./components/AdminPanel";
import AOIPanel from "./components/AOIPanel";
import DownloadsPanel from "./components/DownloadsPanel";
import HomePanel from "./components/HomePanel";
import ImageryPanel from "./components/ImageryPanel";
import Navbar from "./components/Navbar";
import OpenDroneMapPanel from "./components/OpenDroneMapPanel";
import SettingsPanel from "./components/SettingsPanel";
import Sidebar from "./components/Sidebar";

FocusStyleManager.onlyShowFocusOnTabs();

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
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
