import React, { Component } from "react";
import { connect } from "react-redux";
import { PageHeader, Panel } from "react-bootstrap";

import NetworkSettingsForm from "./NetworkSettingsForm";

class SettingsPanel extends Component {
  static propTypes = {};

  submit = values => {
    console.log("Form values:", values);
  };

  render() {
    const { network: { wifi: { ssid, wpa, wpa_passphrase } } } = this.props;

    const initialValues = {
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
