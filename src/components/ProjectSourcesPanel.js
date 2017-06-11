import { NonIdealState } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";
import Dropzone from "react-dropzone-component";

import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/dropzone.css";

import SourceThumbnail from "./SourceThumbnail";

export default class ProjectSourcesPanel extends React.Component {
  static defaultProps = {
    count: 6
  };

  static propTypes = {
    count: PropTypes.number,
    endpoint: PropTypes.string.isRequired,
    getProject: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    sources: PropTypes.array.isRequired
  };

  state = {
    count: this.props.count
  };

  getShowAllButton() {
    const showAll = this.showAll;
    const { count } = this.state;
    const { sources } = this.props;

    if (sources.length === 0 || sources.length < count) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <button
            onClick={showAll}
            type="button"
            className="btn btn-info btn-sm"
          >
            Show All
          </button>
        </div>
      </div>
    );
  }

  showAll = () => {
    this.setState({
      count: Infinity
    });
  };

  render() {
    const { endpoint, getProject, sources } = this.props;
    const { count } = this.state;

    const thumbnails = sources
      .slice(0, count)
      .map((image, col) =>
        <SourceThumbnail key={col} image={image} {...this.props} />
      );

    const showAllButton = this.getShowAllButton();

    return (
      <div>
        <Dropzone
          config={{
            postUrl: `${endpoint}/upload`
          }}
          eventHandlers={{
            complete: file => {
              getProject();
            }
          }}
          djsConfig={{
            acceptedFiles: "image/jpeg,image/png",
            method: "PUT"
          }}
        >
          <NonIdealState
            className="dz-message"
            visual="cloud-upload"
            action="Drop images here to upload"
          />
        </Dropzone>

        <div className="row sources">
          {thumbnails}
        </div>

        {showAllButton}
      </div>
    );
  }
}
