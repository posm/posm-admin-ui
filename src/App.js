import { FocusStyleManager } from "@blueprintjs/core";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Socket } from "react-socket-io";

import { initializeState, loadPOSMState } from "./actions";
import AdminPanel from "./components/AdminPanel";
import AOIPanel from "./components/AOIPanel";
import DeploymentPanel from "./components/DeploymentPanel";
import FilesPanel from "./components/FilesPanel";
import HomePanel from "./components/HomePanel";
import ImageryPanel from "./components/ImageryPanel";
import Navbar from "./components/Navbar";
import OpenDroneMapPanel from "./components/OpenDroneMapPanel";
import SettingsPanel from "./components/SettingsPanel";
import Sidebar from "./components/Sidebar";

FocusStyleManager.onlyShowFocusOnTabs();

const history = createBrowserHistory();

const SOCKET_OPTIONS = {
  path: "/posm-admin/socket.io",
  transports: ["websocket"]
};

class App extends Component {
  componentWillMount() {
    const { initializeState } = this.props;

    initializeState();
  }

  componentWillUpdate(nextProps, nextState) {
    const { loadPOSMState, posm: prevPosm } = this.props;
    const { posm, refreshInterval } = nextProps;

    if (prevPosm == null && posm != null) {
      this.stateUpdater = setInterval(() => {
        loadPOSMState();
      }, refreshInterval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.stateUpdater);
  }

  render() {
    const { posm } = this.props;
    const app = (
      <ConnectedRouter history={history}>
        <div>
          <Navbar />
          <Sidebar />
          <Route exact path="/" component={HomePanel} />
          <Route path="/posm/aois" component={AOIPanel} />
          <Route path="/posm/deployments" component={DeploymentPanel} />
          <Route path="/posm/opendronemap" component={OpenDroneMapPanel} />
          <Route path="/posm/imagery" component={ImageryPanel} />
          <Route path="/posm/files" component={FilesPanel} />
          <Route path="/posm/admin" component={AdminPanel} />
          <Route path="/posm/settings" component={SettingsPanel} />
        </div>
      </ConnectedRouter>
    );

    if (posm != null) {
      return (
        <Socket uri={posm} options={SOCKET_OPTIONS}>
          {app}
        </Socket>
      );
    }

    return app;
  }
}

const mapStateToProps = state => ({
  posm: state.config.posm,
  refreshInterval: state.config.refreshInterval
});

export default connect(
  mapStateToProps,
  { initializeState, loadPOSMState }
)(App);
