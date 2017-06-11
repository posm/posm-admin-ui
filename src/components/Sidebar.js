import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ children }) =>
  <Menu className="pt-elevation-1 inline-block menu">
    <li>
      <Link to="/" className="pt-menu-item pt-popover-dismiss pt-icon-home">
        Home
      </Link>
    </li>
    <li>
      <Link
        to="/aois"
        className="pt-menu-item pt-popover-dismiss pt-icon-polygon-filter"
      >
        AOIs
      </Link>
    </li>
    <li>
      <Link
        to="/deployments"
        className="pt-menu-item pt-popover-dismiss pt-icon-layers"
      >
        OMK Deployments
      </Link>
    </li>
    <MenuDivider />
    <MenuItem
      iconName="pt-icon-mobile-phone"
      text="OpenMapKit"
      href="/omk/"
      target="_blank"
      title="OpenMapKit"
      rel="noopener noreferrer"
      label={<span className="pt-icon-standard pt-icon-share" />}
    />

    <MenuItem
      iconName="pt-icon-clipboard"
      text="Field Papers"
      href="/fp/"
      target="_blank"
      title="Field Papers"
      rel="noopener noreferrer"
      label={<span className="pt-icon-standard pt-icon-share" />}
    />
    <MenuItem
      iconName="pt-icon-send-to-map"
      text="OpenStreetMap"
      // TODO don't hard-code me
      href="http://osm.posm.io/"
      target="_blank"
      title="OpenStreetMap"
      rel="noopener noreferrer"
      label={<span className="pt-icon-standard pt-icon-share" />}
    />
    <li>
      <Link
        to="/opendronemap"
        className="pt-menu-item pt-popover-dismiss pt-icon-airplane"
      >
        OpenDroneMap
      </Link>
    </li>
    <li>
      <Link
        to="/imagery"
        className="pt-menu-item pt-popover-dismiss pt-icon-satellite"
      >
        Imagery
      </Link>
    </li>
    <li>
      <Link
        to="/downloads"
        className="pt-menu-item pt-popover-dismiss pt-icon-cloud-download"
      >
        Downloads
      </Link>
    </li>
    <MenuDivider />
    <li>
      <Link
        to="/admin"
        className="pt-menu-item pt-popover-dismiss pt-icon-pulse"
      >
        Admin
      </Link>
    </li>
    <li>
      <Link
        to="/settings"
        className="pt-menu-item pt-popover-dismiss pt-icon-cog"
      >
        Settings
      </Link>
    </li>
  </Menu>;

export default Sidebar;
