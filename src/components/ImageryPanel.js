import { NonIdealState } from "@blueprintjs/core";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone-component";
import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";

import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/dropzone.css";

import ImageryPane from "../components/ImageryPane";

const config = {
  imageryEndpoint: "http://posm.local"
};

class ImageryPanel extends Component {
  static defaultProps = {
    endpoint: config.imageryEndpoint
  };

  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };

  state = {
    sources: {}
  };

  componentDidMount() {
    this.getSources();
  }

  getSources = (callback = () => {}) => {
    const { endpoint } = this.props;

    return fetch(`${endpoint}/imagery`)
      .then(rsp => rsp.json())
      .then(sources => {
        this.setState({
          sources
        });

        callback(sources);
      })
      .catch(err => console.warn(err.stack));
  };

  updateName(event) {
    this.setState({
      name: event.target.value
    });
  }

  render() {
    const { endpoint } = this.props;
    const { sources } = this.state;

    const imagery = Object.keys(sources)
      .filter(name => sources[name] !== {})
      .map(name =>
        <ImageryPane
          key={name}
          name={name}
          source={sources[name]}
          endpoint={`${endpoint}/imagery/${name}`}
          refreshInterval={config.refreshInterval}
        />
      );

    return (
      <div className="posm-panel">
        <PageHeader>Imagery</PageHeader>

        <Dropzone
          config={{
            postUrl: `${endpoint}/imagery/upload`
          }}
          eventHandlers={{
            init: dropzone => {
              this.dropzone = dropzone;
            },
            success: (file, rsp) => {
              this.getSources(() => {
                this.dropzone.removeFile(file);
              });
            }
          }}
          djsConfig={{
            acceptedFiles: "image/tiff",
            addRemoveLinks: false,
            method: "PUT"
          }}
        >
          <NonIdealState
            className="dz-message"
            visual="cloud-upload"
            action="Drop GeoTIFFs here to upload"
          />
        </Dropzone>

        {imagery}
      </div>
    );
  }
}

export default ImageryPanel;
