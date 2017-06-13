import React, { Component } from "react";
import { connect } from "react-redux";
import { PageHeader, Panel, Well } from "react-bootstrap";
import { Event } from "react-socket-io";

import NetworkSettingsForm from "./NetworkSettingsForm";
import { updateNetworkConfig } from "../actions";

class SettingsPanel extends Component {
  state = {};

  submit = ({ bridged, ssid, wpa, wpa_passphrase }, dispatch) =>
    dispatch(
      updateNetworkConfig(this.props.posm, {
        wifi: {
          ssid,
          wpa,
          wpa_passphrase
        },
        bridged
      })
    );

  onMessage = message => {
    const { status: { msg, running } } = message;

    this.setState({
      running,
      statusMessage: msg
    });
  };

  render() {
    const { network: { wifi: { ssid, wpa, wpa_passphrase } } } = this.props;
    const { running, statusMessage } = this.state;

    const initialValues = {
      bridged: false,
      ssid,
      wpa,
      wpa_passphrase
    };

    return (
      <div className="posm-panel">
        <Event event="network-config" handler={this.onMessage} />
        <PageHeader>
          Network Settings
        </PageHeader>
        <Panel header="Wi-Fi">
          {running && <Well bsSize="small">{statusMessage}</Well>}
          <NetworkSettingsForm
            initialValues={initialValues}
            enableReinitialize
            onSubmit={this.submit}
            running={running}
          />
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  network: state.network,
  posm: state.config.posm
});

export default connect(mapStateToProps)(SettingsPanel);
