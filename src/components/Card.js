import React from "react";

const styles = {
  paddingTop: 5,
  textAlign: "center"
};

const Card = ({ children, style }) => (
  <div className="bp3-cart bp3-elevation-2" style={{ ...style, ...styles }}>
    {children}
  </div>
);

Card.propTypes = {};

export default Card;
