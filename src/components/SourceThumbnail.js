import { Code } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image } from "react-bootstrap";

export default class SourceThumbnail extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  };

  render() {
    const { endpoint, image } = this.props;

    return (
      <div className="col-md-2">
        <div className="thumbnail">
          <div className="image view view-first">
            <Image
              responsive
              style={{ width: "100%", display: "block" }}
              src={`${endpoint}/images/${image}/thumb`}
            />
            <div className="mask">
              <p>
                <Code>{image}</Code>
              </p>
              <div className="tools tools-bottom">
                <a href={`${endpoint}/images/${image}`}>
                  <i className="fa fa-download" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
