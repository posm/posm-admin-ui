import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getPOSMEndpoint } from "../selectors";

const Sidebar = ({ osm, posm }) => (
  <Menu className="bp3-elevation-1 inline-block menu">
    <li>
      <Link to="/" className="bp3-menu-item bp3-popover-dismiss bp3-icon-home">
        Home
      </Link>
    </li>
    <li>
      <Link
        to="/posm/aois"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-polygon-filter"
      >
        AOIs
      </Link>
    </li>
    <li>
      <Link
        to="/posm/deployments"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-layers"
      >
        OMK Deployments
      </Link>
    </li>
    <MenuDivider />
    <MenuItem
      icon="mobile-phone"
      text="OpenMapKit"
      href={`${posm}/omk/`}
      target="_blank"
      title="OpenMapKit"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    />

    <MenuItem
      icon="clipboard"
      text="Field Papers"
      href={`${posm}/fp/`}
      target="_blank"
      title="Field Papers"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    />
    <MenuItem
      icon="send-to-map"
      text="OpenStreetMap"
      href={`http://${osm.fqdn}/`}
      target="_blank"
      title="OpenStreetMap"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    />
    <li>
      <Link
        to="/posm/opendronemap"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-airplane"
      >
        OpenDroneMap
      </Link>
    </li>
    <MenuItem
      icon="layout-skew-grid"
      text="ODM GCPs"
      href={`${posm}/posm-gcpi/`}
      target="_blank"
      title="OpenDroneMap Ground Control Points"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    />
    <li>
      <Link
        to="/posm/imagery"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-satellite"
      >
        Imagery
      </Link>
    </li>
    <li>
      <Link
        to="/posm/files"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-cloud"
      >
        Files
      </Link>
    </li>
    <MenuDivider />
    <MenuItem
      icon="book"
      text="POSM Guide"
      href={`${posm}/guide/`}
      target="_blank"
      title="POSM Guide"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    />
    <MenuItem
      icon="book"
      text="About OMK"
      href={`${posm}/openmapkit-website/`}
      target="_blank"
      title="About OpenMapKit"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    />
    {/* <MenuItem
      icon="book"
      text="OSM Features"
      href={`${posm}/wiki.openstreetmap.org/wiki/Map_Features`}
      target="_blank"
      title="OpenStreetMap Map Features"
      rel="noopener noreferrer"
      label={<span className="bp3-icon-standard bp3-icon-share" />}
    /> */}
    <li>
      <Link
        to="/posm/admin"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-pulse"
      >
        Admin
      </Link>
    </li>
    <li>
      <Link
        to="/posm/settings"
        className="bp3-menu-item bp3-popover-dismiss bp3-icon-cog"
      >
        Settings
      </Link>
    </li>
  </Menu>
);

const mapStateToProps = state => ({
  osm: state.osm,
  posm: getPOSMEndpoint(state)
});

export default connect(mapStateToProps)(Sidebar);
