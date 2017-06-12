import React, { Component } from "react";
import { connect } from "react-redux";
import { PageHeader, Panel } from "react-bootstrap";

import NetworkSettingsForm from "./NetworkSettingsForm";
import { updateNetworkConfig } from "../actions";

class SettingsPanel extends Component {
  static propTypes = {};

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
  network: state.network,
  posm: state.config.posm
});

export default connect(mapStateToProps)(SettingsPanel);
