import React, { Component } from "react";
import { connect } from "react-redux";
import { Button as BSButton, PageHeader, Panel } from "react-bootstrap";

import LogModal from "./LogModal";
import NetworkSettingsForm from "./NetworkSettingsForm";
import { updateNetworkConfig } from "../actions";

class SettingsPanel extends Component {
  state = {
    showLogs: false
  };

  showLogs = () =>
    this.setState({
      showLogs: true
    });

  hideLogs = () =>
    this.setState({
      showLogs: false
    });

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
    const { showLogs } = this.state;

    const initialValues = {
      bridged: false,
      ssid,
      wpa,
      wpa_passphrase
    };

    return (
      <div className="posm-panel">
        <PageHeader>
          Network Settings
          <BSButton
            className="pull-right"
            bsSize="small"
            bsStyle="warning"
            onClick={this.showLogs}
          >
            Show Logs
          </BSButton>
        </PageHeader>
        <LogModal
          onHide={this.hideLogs}
          name="network-config"
          show={showLogs}
        />
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
