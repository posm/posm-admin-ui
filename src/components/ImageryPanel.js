import { NonIdealState } from "@blueprintjs/core";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone-component";
import React, { Component } from "react";
import { PageHeader } from "react-bootstrap";
import { connect } from "react-redux";

import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/dropzone.css";

import ImageryPane from "../components/ImageryPane";
import { getImageryEndpoint } from "../selectors";

class ImageryPanel extends Component {
  static propTypes = {
    endpoint: PropTypes.string
  };

  state = {
    sources: {}
  };

  componentDidMount() {
    this.getSources();
  }

  componentDidUpdate(nextProps, nextState) {
    const { endpoint } = this.props;

    if (endpoint !== nextProps.endpoint) {
      this.getSources();
    }
  }

  getSources = (callback = () => {}) => {
    const { endpoint } = this.props;

    if (endpoint == null) {
      return callback();
    }

    return fetch(`${endpoint}/imagery`)
      .then(rsp => rsp.json())
      .then(sources => {
        this.setState({
          sources
        });

        callback(null, sources);
      })
      .catch(err => console.warn(err.stack));
  };

  updateName(event) {
    this.setState({
      name: event.target.value
    });
  }

  render() {
    const { endpoint, refreshInterval } = this.props;
    const { sources } = this.state;

    const imagery = Object.keys(sources)
      .filter(name => sources[name] !== {})
      .sort(
        (a, b) =>
          (sources[a].meta.user.name || a) > (sources[b].meta.user.name || b)
      )
      .map(name => (
        <ImageryPane
          key={name}
          name={name}
          source={sources[name]}
          endpoint={`${endpoint}/imagery/${name}`}
          refreshInterval={refreshInterval}
        />
      ));

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
            method: "PUT",
            maxFilesize: Infinity
          }}
        >
          <NonIdealState
            className="dz-message"
            icon="cloud-upload"
            action="Tap, click, or drop GeoTIFFs here to upload"
          />
        </Dropzone>

        {imagery}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  endpoint: getImageryEndpoint(state),
  refreshInterval: state.config.refreshInterval
});

export default connect(mapStateToProps)(ImageryPanel);
