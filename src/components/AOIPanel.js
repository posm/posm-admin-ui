import { Button, Code, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Button as BSButton, PageHeader, Panel, Well } from "react-bootstrap";
import { Event } from "react-socket-io";
import { Field, reduxForm } from "redux-form";

import AOIFiles from "./AOIFiles";
import LogModal from "./LogModal";
import { activateAOI } from "../actions";
import { getAOIFiles, getPOSMEndpoint } from "../selectors";
import { renderTextInput } from "../lib";

const styles = {
  ul: {
    listStyle: "none",
    paddingLeft: 10
  },
  textInput: {
    width: 400
  }
};

const tarball = value =>
  value && !/-bundle\.tar\.gz$/.test(value) ? (
    <span>
      Must be the URL of a POSM Bundle (ending in <Code>-bundle.tar.gz</Code>)
    </span>
  ) : null;

const renderRadio = ({ className, disabled, input, label }) => (
  <Radio className={className} label={label} disabled={disabled} {...input} />
);

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
    const {
      status: { complete, initialized, msg }
    } = message;

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
      osm,
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
          <Panel.Body>
            {running && <Well bsSize="small">{statusMessage}</Well>}
            <p>
              An <em>Area of Interest</em> contains OpenStreetMap data for a
              given area. It may also include auxiliary files, including OsmAnd
              OBFs (for offline mapping on Android).
            </p>
            <p>
              AOIs are distributed as "POSM Bundles" produced by the{" "}
              <a href="http://export.posm.io/">
                POSM Export Tool{" "}
                <span className="bp3-icon-standard bp3-icon-offline" />
              </a>. They must include "OSM PBF" as an export format.
            </p>
            <p>
              Data contained in an AOI is used to produce offline maps for{" "}
              <a href={`${posm}/fp/`}>Field Papers</a> and{" "}
              <a href={`${posm}/fp/`}>OpenMapKit</a>, as well as to bootstrap
              data that can be edited using OMK and the{" "}
              <a href={`http://${osm.fqdn}/`}>local OpenStreetMap instance</a>{" "}
              (using JOSM, if desired).
            </p>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="bp3-form-group bp3-control-group">
                <RadioGroup label="Active AOI">
                  {available.map(({ description, name, title }, idx) => (
                    <Field
                      key={idx}
                      name="aoi"
                      component={renderRadio}
                      type="radio"
                      label={
                        <span>
                          {title}
                          {description && (
                            <span>
                              {" "}
                              - <em>{description}</em>
                            </span>
                          )}
                        </span>
                      }
                      value={name}
                    />
                  ))}
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
                    validate={tarball}
                  />
                </RadioGroup>
              </div>
              <Button
                text="Activate"
                type="submit"
                disabled={submitting || running}
                intent={Intent.PRIMARY}
                rightIcon="arrow-right"
              />
            </form>
          </Panel.Body>
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
  osm: state.osm,
  posm: getPOSMEndpoint(state)
});

export default connect(
  mapStateToProps,
  { activateAOI }
)(
  reduxForm({
    enableReinitialize: true,
    form: "activateAOI",
    onSubmit: (values, dispatch, { activateAOI }) => activateAOI(values)
  })(AOIPanel)
);
