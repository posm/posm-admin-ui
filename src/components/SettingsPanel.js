import React, { Component } from "react";
import { connect } from "react-redux";
import { PageHeader, Panel } from "react-bootstrap";

import NetworkSettingsForm from "./NetworkSettingsForm";

class SettingsPanel extends Component {
  static propTypes = {};

  submit = values => {
    const { bridged, ssid, wpa, wpa_passphrase } = values;

    // TODO don't hard-code this
    return fetch("http://posm.local/posm-admin/network-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wifi: {
          ssid,
          wpa,
          wpa_passphrase
        },
        bridged
      })
    });
  };

  render() {
    const { network: { wifi: { ssid, wpa, wpa_passphrase } } } = this.props;

    const initialValues = {
      bridged: false,
      ssid,
      wpa,
      wpa_passphrase
    };

    return (
      <div className="posm-panel">
        <PageHeader>Network Settings</PageHeader>
        <Panel header="Wi-Fi">
          <NetworkSettingsForm
            initialValues={initialValues}
            enableReinitialize
            onSubmit={this.submit}
          />
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  network: state.network
});

export default connect(mapStateToProps)(SettingsPanel);
