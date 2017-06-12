import { FocusStyleManager } from "@blueprintjs/core";
import createHistory from "history/createBrowserHistory";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { Socket } from "react-socket-io";

import { initializeState, loadPOSMState } from "./actions";
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

const history = createHistory();

const SOCKET_OPTIONS = {
  path: "/posm-admin/socket.io",
  transports: ["websocket"]
};

class App extends Component {
  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(initializeState());
  }

  componentWillUpdate(nextProps, nextState) {
    const { dispatch, posm: prevPosm } = this.props;
    const { posm, refreshInterval } = nextProps;

    if (prevPosm == null && posm != null) {
      this.stateUpdater = setInterval(() => {
        dispatch(loadPOSMState(posm));
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
          <Route path="/aois" component={AOIPanel} />
          <Route path="/deployments" component={DeploymentPanel} />
          <Route path="/opendronemap" component={OpenDroneMapPanel} />
          <Route path="/imagery" component={ImageryPanel} />
          <Route path="/downloads" component={DownloadsPanel} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/settings" component={SettingsPanel} />
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

export default connect(mapStateToProps)(App);
