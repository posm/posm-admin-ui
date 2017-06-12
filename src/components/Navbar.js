import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import posmLogo from "../images/posm.png";

const styles = {
  icon: {
    marginRight: 0
  }
};

const Navbar = ({ aois, osm, posm }) =>
  <nav className="pt-navbar pt-fixed-top pt-dark">
    <div className="pt-navbar-group pt-align-left">
      <div className="pt-navbar-heading">
        <Link to="/" title="Home"><Image src={posmLogo} /></Link>
      </div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <a
        href={`${posm}/omk/`}
        target="_blank"
        rel="noopener noreferrer"
        className="pt-button pt-minimal"
      >
        <span
          className="pt-icon-large pt-icon-mobile-phone"
          style={styles.icon}
        />
      </a>
      <a
        href={`${posm}/fp/`}
        target="_blank"
        title="Field Papers"
        rel="noopener noreferrer"
        className="pt-button pt-minimal"
      >
        <span className="pt-icon-large pt-icon-clipboard" style={styles.icon} />
      </a>
      <a
        href={`http://${osm.fqdn}/`}
        target="_blank"
        title="OpenStreetMap"
        rel="noopener noreferrer"
        className="pt-button pt-minimal"
      >
        <span
          className="pt-icon-large pt-icon-send-to-map"
          style={styles.icon}
        />
      </a>
      <span className="pt-navbar-divider" />
      <Link to="/aois">
        Active AOI:
        {" "}
        {aois.active
          ? <strong>
              {aois.available.find(x => x.name === aois.active).label}
            </strong>
          : <em>none</em>}
      </Link>
      <span className="pt-navbar-divider" />
      <Link
        to="/settings"
        className="pt-button pt-minimal pt-icon-cog"
        title="Settings"
      />
    </div>
  </nav>;

Navbar.propTypes = {};

const mapStateToProps = state => ({
  aois: state.aois,
  osm: state.osm,
  posm: state.config.posm
});

export default connect(mapStateToProps)(Navbar);
