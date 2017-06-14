import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button as BSButton, PageHeader, Panel, Well } from "react-bootstrap";
import { Event } from "react-socket-io";
import { Field, reduxForm } from "redux-form";

import AOIFiles from "./AOIFiles";
import LogModal from "./LogModal";
import { activateAOI } from "../actions";
import { getAOIFiles } from "../selectors";
import { renderTextInput } from "../lib";

const styles = {
  ul: {
    listStyle: "none",
    paddingLeft: 10
  },
  textInput: {
    width: 300
  }
};

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
      aoiFiles,
      aois: { available },
      change,
      form,
      handleSubmit,
      posm,
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
                {available.map(({ description, name, title }, idx) =>
                  <Field
                    key={idx}
                    name="aoi"
                    component={renderRadio}
                    type="radio"
                    label={
                      <span>
                        {title}
                        {description && <span> - <em>{description}</em></span>}
                      </span>
                    }
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
                  style={styles.textInput}
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
        <AOIFiles files={aoiFiles} posm={posm} style={styles.ul} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  aoiFiles: getAOIFiles(state),
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
