import { Button, Intent, Position, Switch, Tooltip } from "@blueprintjs/core";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

import { renderTextInput } from "../lib";

const renderSwitch = ({ className, disabled, input, label }) => (
  <Switch className={className} label={label} disabled={disabled} {...input} />
);

class NetworkSettingsForm extends Component {
  static propTypes = {};

  render() {
    const { handleSubmit, running, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="bp3-form-group bp3-control-group">
          <Field
            name="bridged"
            component={renderSwitch}
            type="checkbox"
            label={
              <Tooltip
                content="
                  allow users to access the internet when connected to POSM
                  (requires that POSM has an ethernet connection)"
                position={Position.RIGHT}
                className="bp3-tooltip-indicator"
              >
                Bridged
              </Tooltip>
            }
          />
          <Field
            name="wpa"
            component={renderSwitch}
            type="checkbox"
            className="bp3-icon-standard bp3-icon-lock"
            label={
              <span>
                &nbsp;<Tooltip
                  content="requires a password to connect to POSM Wi-Fi. Disable this if computers have trouble connecting."
                  position={Position.RIGHT}
                  className="bp3-tooltip-indicator"
                >
                  WPA-Personal
                </Tooltip>
              </span>
            }
          />
          <Field
            name="ssid"
            component={renderTextInput}
            label="SSID"
            required
            placeholder="SSID"
          />
          <Field
            name="wpa_passphrase"
            component={renderTextInput}
            label="WPA Passphrase"
            placeholder="Passphrase"
          />
        </div>
        <Button
          text="Apply"
          type="submit"
          disabled={submitting || running}
          intent={Intent.PRIMARY}
          rightIcon="arrow-right"
        />
      </form>
    );
  }
}

export default reduxForm({
  form: "networkSettings",
  validate: values => {
    const { wpa, wpa_passphrase } = values;
    const errors = {};

    if (
      wpa &&
      (wpa_passphrase == null ||
        wpa_passphrase.length < 8 ||
        wpa_passphrase.length > 63)
    ) {
      errors.wpa_passphrase = "Must be between 8 and 63 characters.";
    }

    return errors;
  }
})(NetworkSettingsForm);
