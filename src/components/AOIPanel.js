import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button as BSButton, PageHeader, Panel, Well } from "react-bootstrap";
import { Event } from "react-socket-io";
import { Field, reduxForm } from "redux-form";

import { activateAOI } from "../actions";
import LogModal from "./LogModal";
import { renderTextInput } from "../lib";

const renderRadio = ({ className, disabled, input, label }) =>
  <Radio className={className} label={label} disabled={disabled} {...input} />;

class AOIPanel extends Component {
  state = {};

  showLogs = () =>
    this.setState({
      showLogs: true
    });

  hideLogs = () =>
    this.setState({
      showLogs: false
    });

  onMessage = message => {
    const { status: { complete, initialized, msg } } = message;

    this.setState({
      running: initialized && !complete,
      statusMessage: msg
    });
  };

  componentWillUpdate(nextProps, nextState) {
    const { complete } = nextProps;
    const { running: wasRunning } = this.state;

    if (wasRunning && complete) {
      // reset running since we probably dropped a message
      this.setState({
        running: false
      });
    }
  }

  render() {
    const {
      aois: { available },
      change,
      form,
      handleSubmit,
      submitting
    } = this.props;
    const { running, showLogs, statusMessage } = this.state;

    return (
      <div className="posm-panel">
        <Event event="aoi-deploy" handler={this.onMessage} />
        <PageHeader>
          Areas of Interest
          <BSButton
            className="pull-right"
            bsSize="small"
            bsStyle="warning"
            onClick={this.showLogs}
          >
            Show Logs
          </BSButton>
        </PageHeader>
        <LogModal show={showLogs} onHide={this.hideLogs} event="aoi-deploy" />
        <Panel>
          {running && <Well bsSize="small">{statusMessage}</Well>}
          <form onSubmit={handleSubmit}>
            <div className="pt-form-group pt-control-group">
              <RadioGroup label="Active AOI">
                {available.map(({ label, name }, idx) =>
                  <Field
                    key={idx}
                    name="aoi"
                    component={renderRadio}
                    type="radio"
                    label={label}
                    value={name}
                  />
                )}
                <Field
                  name="aoi"
                  component={renderRadio}
                  type="radio"
                  label="Other:"
                  value="other"
                />
                <Field
                  name="url"
                  component={renderTextInput}
                  placeholder="POSM bundle URL"
                  onFocus={() => change("aoi", "other")}
                />
              </RadioGroup>
            </div>
            <Button
              text="Activate"
              type="submit"
              disabled={submitting || running}
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
  aois: state.aois,
  complete: state.tasks.deployments.complete,
  initialValues: {
    aoi: state.aois.active
  },
  posm: state.config.posm
});

export default connect(mapStateToProps)(
  reduxForm({
    enableReinitialize: true,
    form: "activateAOI",
    onSubmit: (values, dispatch, { posm }) =>
      dispatch(activateAOI(posm, values))
  })(AOIPanel)
);
