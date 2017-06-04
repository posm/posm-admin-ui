import { Button, Intent, Switch } from "@blueprintjs/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { PageHeader, Panel } from "react-bootstrap";

class SettingsPanel extends Component {
  static propTypes = {};

  render() {
    const { wifi: { ssid, wpa_passphrase, wpa } } = this.props.network;

    console.log("network:", this.props.network);

    return (
      <div className="posm-panel">
        <PageHeader>Network Settings</PageHeader>
        <Panel header="Wi-Fi">
          <form>
            <div className="pt-form-group pt-control-group">
              <Switch label="Bridged" />
              <Switch
                className="pt-icon-standard pt-icon-lock"
                checked={wpa}
                label=" WPA-Personal"
              />
              <label className="pt-label">
                SSID <span className="pt-text-muted">(required)</span>
                <input
                  className="pt-input"
                  type="text"
                  placeholder="SSID"
                  value={ssid}
                  dir="auto"
                />
              </label>
              <label className="pt-label">
                WPA passphrase
                {" "}<span className="pt-text-muted">(8-63 characters)</span>
                <input
                  className="pt-input"
                  type="text"
                  placeholder="Passphrase"
                  value={wpa_passphrase}
                  dir="auto"
                />
              </label>
            </div>
            <Button
              text="Apply"
              intent={Intent.PRIMARY}
              rightIconName="arrow-right"
            />
          </form>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  network: state.network
});

export default connect(mapStateToProps)(SettingsPanel);
