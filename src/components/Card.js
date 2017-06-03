import React from "react";

const styles = {
  paddingTop: 5,
  textAlign: "center"
};

const Card = ({ children, style }) =>
  <div className="pt-cart pt-elevation-2" style={{ ...style, ...styles }}>
    {children}
  </div>;

Card.propTypes = {};

export default Card;
