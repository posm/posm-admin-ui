import React from "react";
import { Image } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import posmLogo from "../images/posm@2x.png";

const Navbar = ({ aois, osm, posm }) =>
  <nav className="pt-navbar pt-fixed-top pt-dark">
    <div className="pt-navbar-group pt-align-left">
      <div className="pt-navbar-heading">
        <Link to="/" title="Home"><Image src={posmLogo} height={32} /></Link>
      </div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <Link to="/aois">
        Active AOI:
        {" "}
        {aois.active
          ? <strong>
              {aois.available.find(x => x.name === aois.active).title}
            </strong>
          : <em>none</em>}
      </Link>
    </div>
  </nav>;

Navbar.propTypes = {};

const mapStateToProps = state => ({
  aois: state.aois,
  osm: state.osm,
  posm: state.config.posm
});

export default connect(mapStateToProps)(Navbar);
