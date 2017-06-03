import { FocusStyleManager } from "@blueprintjs/core";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AdminPanel from "./components/AdminPanel";
import AOIPanel from "./components/AOIPanel";
import DeploymentPanel from "./components/DeploymentPanel";
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
      <Router>
        <div>
          <Navbar />
          <Sidebar />
          <Route exact path="/" component={HomePanel} />
          <Route path="/aois" component={AOIPanel} />
          <Route path="/deployments" component={DeploymentPanel} />
          <Route path="/opendronemap" component={OpenDroneMapPanel} />
          <Route path="/imagery" component={ImageryPanel} />
          <Route path="/downloads" component={DownloadsPanel} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/settings" component={SettingsPanel} />
        </div>
      </Router>
    );
  }
}

export default App;
