import { Button, Intent, Radio, RadioGroup } from "@blueprintjs/core";
import React from "react";
import { PageHeader, Panel } from "react-bootstrap";

const AOIPanel = () =>
  <div className="posm-panel">
    <PageHeader>Areas of Interest</PageHeader>
    <Panel>
      <form>
        <div className="pt-form-group pt-control-group">
          <RadioGroup label="Active AOI" selectedValue="other">
            <Radio label="Brussells-Ixelles" value="brussellsixelles" />
            <Radio label="Dzveresekwa Export" value="dzveresekwa_export" />
            <Radio label="test area" value="test_area" />
            <Radio label="dc_test" value="dc_test" />
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

export default AOIPanel;
