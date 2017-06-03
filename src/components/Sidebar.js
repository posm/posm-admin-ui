import { Tab2, Tabs2 } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";

const Sidebar = ({ children }) =>
  <Tabs2 id="sidebar" renderActiveTabPanelOnly vertical>
    {(Array.isArray(children) ? children : [children]).map((panel, idx) =>
      <Tab2 id={idx} key={idx} title={panel.type.title} panel={panel} />
    )}
  </Tabs2>;

Sidebar.propTypes = {
  children: PropTypes.any
};

export default Sidebar;
