import { Button, Intent, Position, Switch, Tooltip } from "@blueprintjs/core";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

const decorate = (content, intent, child) =>
  <Tooltip
    content={content}
    intent={intent}
    position={Position.RIGHT}
    inline
    defaultIsOpen
    isOpen
  >
    {child}
  </Tooltip>;

const renderTextInput = ({
  input,
  label,
  meta: { touched, error, warning },
  placeholder,
  required
}) => {
  const widget = (
    <label className="pt-label">
      {label}
      {" "}{required && <span className="pt-text-muted">(required)</span>}
      <input
        className="pt-input"
        type="text"
        dir="auto"
        placeholder={placeholder}
        {...input}
      />
    </label>
  );

  if (touched) {
    if (error) {
      return decorate(error, Intent.DANGER, widget);
    }

    if (warning) {
      return decorate(warning, Intent.WARNING, widget);
    }
  }

  return widget;
};

const renderSwitch = ({ className, disabled, input, label }) =>
  <Switch className={className} label={label} disabled={disabled} {...input} />;

class NetworkSettingsForm extends Component {
  static propTypes = {};

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="pt-form-group pt-control-group">
          {/* TODO not possible to expose in posm-admin yet */}
          <Field
            name="bridged"
            component={renderSwitch}
            type="checkbox"
            disabled
            label="Bridged"
          />
          <Field
            name="wpa"
            component={renderSwitch}
            type="checkbox"
            className="pt-icon-standard pt-icon-lock"
            label=" WPA-Personal"
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
          disabled={submitting}
          intent={Intent.PRIMARY}
          rightIconName="arrow-right"
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

    if (wpa && (wpa_passphrase.length < 8 || wpa_passphrase.length > 63)) {
      errors.wpa_passphrase = "Must be between 8 and 63 characters.";
    }

    return errors;
  }
})(NetworkSettingsForm);
