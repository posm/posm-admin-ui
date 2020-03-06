import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { posmAdminEndpoint } from "../actions";

import {
  getShouldShowAdmin,
  getApps,
  getDocs,
  getImageryAvailability,
  getODMAvailability,
  getSuperuserStatus,
  getUserDetails,
  getAllowedApps
} from "../selectors";

const Sidebar = ({
  apps,
  docs,
  imageryAvailable,
  odmAvailable,
  isSuperuser,
  showAdmin,
  userDetails,
  allowedApps
}) => {
  const filteredApps = apps.filter(app => allowedApps.includes(app.key));
  const isLoggedIn = !!userDetails.displayName;

  return (
    <Menu className="bp3-elevation-1 inline-block menu">
      <li>
        <Link
          to="/"
          className="bp3-menu-item bp3-popover-dismiss bp3-icon-home"
        >
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
      {filteredApps.map((app, idx) => (
        <MenuItem
          key={idx}
          icon={app.icon}
          text={app.name}
          href={app.url}
          target="_blank"
          title={app.description || app.name}
          rel="noopener noreferrer"
          label={<span className="bp3-icon-standard bp3-icon-share" />}
        />
      ))}
      {odmAvailable && (
        <li>
          <Link
            to="/posm/opendronemap"
            className="bp3-menu-item bp3-popover-dismiss bp3-icon-airplane"
          >
            OpenDroneMap
          </Link>
        </li>
      )}
      {imageryAvailable && (
        <li>
          <Link
            to="/posm/imagery"
            className="bp3-menu-item bp3-popover-dismiss bp3-icon-satellite"
          >
            Imagery
          </Link>
        </li>
      )}
      <li>
        <Link
          to="/posm/files"
          className="bp3-menu-item bp3-popover-dismiss bp3-icon-cloud"
        >
          Files
        </Link>
      </li>
      {docs.length > 0 && (
        <div>
          <MenuDivider />
          {docs.map((doc, idx) => (
            <MenuItem
              key={idx}
              icon={doc.icon}
              text={doc.name}
              href={doc.url}
              target="_blank"
              title={doc.description || doc.name}
              rel="noopener noreferrer"
              label={<span className="bp3-icon-standard bp3-icon-share" />}
            />
          ))}
        </div>
      )}
      {showAdmin && (
        <div>
          <MenuDivider />
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
          {isSuperuser && (
            <li>
              <a
                href={`${posmAdminEndpoint}/admin/`}
                className="bp3-menu-item bp3-popover-dismiss bp3-icon-dashboard"
              >
                User Management
              </a>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <a
                href={`${posmAdminEndpoint}/change-password/`}
                className="bp3-menu-item bp3-popover-dismiss bp3-icon-key"
              >
                Change Password
              </a>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <a
                href={`${posmAdminEndpoint}/logout/`}
                className="bp3-menu-item bp3-popover-dismiss bp3-icon-log-out"
              >
                Logout
              </a>
            </li>
          )}
        </div>
      )}
    </Menu>
  );
};

const mapStateToProps = state => ({
  showAdmin: getShouldShowAdmin(state),
  apps: getApps(state),
  docs: getDocs(state),
  allowedApps: getAllowedApps(state),
  imageryAvailable: getImageryAvailability(state),
  odmAvailable: getODMAvailability(state),
  isSuperuser: getSuperuserStatus(state),
  userDetails: getUserDetails(state)
});

export default connect(mapStateToProps)(Sidebar);
