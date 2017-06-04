import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React from "react";
import { connect } from "react-redux";
import { PageHeader, Panel } from "react-bootstrap";

const AOIPanel = ({ aois: { active, available } }) =>
  <div className="posm-panel">
    <PageHeader>Areas of Interest</PageHeader>
    <Panel>
      <form>
        <div className="pt-form-group pt-control-group">
          <RadioGroup label="Active AOI" selectedValue={active}>
            {available.map(({ label, name }, idx) =>
              <Radio key={idx} label={label} value={name} />
            )}
            <Radio label="Other:" value="other" />
            <input
              className="pt-input"
              type="text"
              placeholder="POSM bundle URL"
              dir="auto"
            />
          </RadioGroup>
        </div>
        <Button
          text="Activate"
          intent={Intent.PRIMARY}
          rightIconName="arrow-right"
        />
      </form>
    </Panel>
  </div>;

AOIPanel.propTypes = {};

const mapStateToProps = state => ({
  aois: state.aois
});

export default connect(mapStateToProps)(AOIPanel);
