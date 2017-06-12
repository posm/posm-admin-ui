import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React from "react";
import { connect } from "react-redux";
import { PageHeader, Panel } from "react-bootstrap";
import { Field, reduxForm } from "redux-form";

import { activateAOI } from "../actions";
import LogViewer from "./LogViewer";
import { renderTextInput } from "../lib";

const renderRadio = ({ className, disabled, input, label }) =>
  <Radio className={className} label={label} disabled={disabled} {...input} />;

const AOIPanel = ({
  aois: { active, available },
  change,
  form,
  handleSubmit,
  submitting
}) =>
  <div className="posm-panel">
    <PageHeader>Areas of Interest</PageHeader>
    <Panel>
      <LogViewer name="aoi-deploy" />
    </Panel>
    <Panel>
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
          disabled={submitting}
          intent={Intent.PRIMARY}
          rightIconName="arrow-right"
        />
      </form>
    </Panel>
  </div>;

const mapStateToProps = state => ({
  aois: state.aois,
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
