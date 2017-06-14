import React, { Component } from "react";
import { connect } from "react-redux";
import { PageHeader, Panel, Well } from "react-bootstrap";
import { Event } from "react-socket-io";

import NetworkSettingsForm from "./NetworkSettingsForm";
import { updateNetworkConfig } from "../actions";

class SettingsPanel extends Component {
  state = {};

  submit = ({ bridged, ssid, wpa, wpa_passphrase }) =>
    this.props.updateNetworkConfig({
      wifi: {
        ssid,
        wpa,
        wpa_passphrase
      },
      bridged
    });

  onMessage = message => {
    const { status: { msg, running } } = message;

    this.setState({
      running,
      statusMessage: msg
    });
  };

  componentWillUpdate(nextProps, nextState) {
    const { network: { changing } } = nextProps;
    const { running } = this.state;

    if (running && !changing) {
      // reset running since we probably dropped a message
      this.setState({
        running: false
      });
    }
  }

  render() {
    const {
      network: { bridged, wifi: { ssid, wpa, wpa_passphrase } }
    } = this.props;
    const { running, statusMessage } = this.state;

    const initialValues = {
      bridged,
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
        <Panel header={<h4>Wi-Fi</h4>}>
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
  network: state.network
});

export default connect(mapStateToProps, { updateNetworkConfig })(SettingsPanel);
