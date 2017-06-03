import React from "react";

const styles = {
  icon: {
    marginRight: 0
  }
};

const Navbar = ({ children, style }) =>
  <nav className="pt-navbar pt-fixed-top pt-dark">
    <div className="pt-navbar-group pt-align-left">
      <div className="pt-navbar-heading">POSM</div>
    </div>
    <div className="pt-navbar-group pt-align-right">
      <a
        href="/omk/"
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
        href="/fp/"
        target="_blank"
        title="Field Papers"
        rel="noopener noreferrer"
        className="pt-button pt-minimal"
      >
        <span className="pt-icon-large pt-icon-clipboard" style={styles.icon} />
      </a>
      {/* TODO don't hard-code this */}
      <a
        href="http://osm.posm.io/"
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
      <button className="pt-button pt-minimal pt-icon-cog" title="Settings" />
    </div>
  </nav>;

Navbar.propTypes = {};

export default Navbar;