import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getActiveAOIName, getUserDetails } from "../selectors";

import posmLogo from "../images/posm@2x.png";
import { Popover } from "../../node_modules/@blueprintjs/core";
import Sidebar from "./Sidebar";

const Navbar = ({ activeAOI, osm, posm, userDetails }) => {
  const isLoggedIn = !!userDetails.displayName;

  return (
    <nav className="bp3-navbar bp3-fixed-top bp3-dark">
      <div className="bp3-navbar-group bp3-align-left">
        <div className="bp3-navbar-heading">
          <Link to="/" title="Home" className="homeLink">
            <Image src={posmLogo} height={32} />
          </Link>
          <Popover minimal usePortal={false} position="bottom-left">
            <Image src={posmLogo} height={32} className="logo" />
            <Sidebar />
          </Popover>
        </div>
      </div>
      <div className="bp3-navbar-group bp3-align-right">
        <Link to="/aois">
          Active AOI: {activeAOI ? <strong>{activeAOI}</strong> : <em>none</em>}
        </Link>
        <div className="bp3-navbar-user">
          {isLoggedIn ? (
            <React.Fragment>
              <span className="user-icon bp3-icon-user" />
              {userDetails.displayName}
            </React.Fragment>
          ) : (
            "You are not logged in"
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {};

const mapStateToProps = state => ({
  activeAOI: getActiveAOIName(state),
  osm: state.osm,
  posm: state.config.posm,
  userDetails: getUserDetails(state)
});

export default connect(mapStateToProps)(Navbar);
