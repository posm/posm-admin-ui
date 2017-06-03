import { Button, Intent, Switch } from "@blueprintjs/core";
import React from "react";
import { PageHeader, Panel } from "react-bootstrap";

const SettingsPanel = () =>
  <div className="posm-panel">
    <PageHeader>Network Settings</PageHeader>
    <Panel header="Wi-Fi">
      <form>
        <div className="pt-form-group pt-control-group">
          <Switch label="Bridged" />
          <Switch
            className="pt-icon-standard pt-icon-lock"
            checked
            label=" WPA-Personal"
          />
          <label className="pt-label">
            SSID
            <span class="pt-text-muted">(required)</span>
            <input
              className="pt-input"
              text="text"
              placeholder="SSID"
              value="POSM"
              dir="auto"
            />
          </label>
          <label className="pt-label">
            WPA passphrase
            <span class="pt-text-muted">(8-63 characters)</span>
            <input
              className="pt-input"
              text="text"
              placeholder="Passphrase"
              value="awesomeposm"
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
  </div>;

SettingsPanel.propTypes = {};

export default SettingsPanel;
