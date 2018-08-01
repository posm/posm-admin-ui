import { Slider } from "@blueprintjs/core";
import Leaflet from "leaflet";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { getPOSMEndpoint } from "../selectors";

import "leaflet/dist/leaflet.css";

const MEDIA_QUERY = `(-webkit-min-device-pixel-ratio: 1.5),
                     (min--moz-device-pixel-ratio: 1.5),
                     (-o-min-device-pixel-ratio: 3/2),
                     (min-resolution: 1.5dppx)`;

class Map extends Component {
  static defaultProps = {
    bounds: [[-85.05112877980659, -180], [85.0511287798066, 180]],
    maxzoom: 18,
    minzoom: 0,
    showBackground: true,
    url: "",
    width: "100%"
  };

  static propTypes = {
    bounds: PropTypes.array,
    maxzoom: PropTypes.number,
    minzoom: PropTypes.number,
    showBackground: PropTypes.bool,
    tileJSON: PropTypes.string,
    url: PropTypes.string,
    width: PropTypes.string
  };

  state = {
    bounds: this.props.bounds,
    maxzoom: this.props.maxzoom,
    minzoom: this.props.minzoom,
    opacity: 100,
    url: this.props.url
  };

  componentDidMount() {
    const { posm, showBackground, tileJSON } = this.props;
    const { bounds, maxzoom, minzoom } = this.state;
    let { url } = this.state;
    let backgroundTileLayer = `${posm}/tiles/mm/{z}/{x}/{y}.png`;

    if (tileJSON != null) {
      fetch(tileJSON)
        .then(rsp => rsp.json())
        .then(info => {
          let _bounds = bounds;

          if (info.bounds != null) {
            _bounds = [
              info.bounds.slice(0, 2).reverse(),
              info.bounds.slice(2, 4).reverse()
            ];
          }

          this.setState({
            bounds: _bounds,
            maxzoom: info.maxzoom,
            minzoom: info.minzoom,
            url: info.tiles[0]
          });
        })
        .catch(err => console.warn(err.stack));
    }

    if (
      window.devicePixelRatio > 1 ||
      (window.matchMedia && window.matchMedia(MEDIA_QUERY).matches)
    ) {
      backgroundTileLayer = backgroundTileLayer.replace(/\.(?!.*\.)/, "@2x.");
      url = url.replace(/\.(?!.*\.)/, "@2x.");
    }

    const layers = [];

    if (showBackground) {
      layers.push(Leaflet.tileLayer(backgroundTileLayer));
    }

    if (url != null) {
      this.imageryLayer = Leaflet.tileLayer(url, {
        minZoom: minzoom,
        maxZoom: maxzoom
      });

      layers.push(this.imageryLayer);
    }

    this.leaflet = Leaflet.map(this.container, {
      scrollWheelZoom: false,
      layers
    });

    this.leaflet.fitBounds(bounds);

    Leaflet.control
      .scale({
        maxWidth: 250
      })
      .addTo(this.leaflet);
    this.leaflet.attributionControl.setPrefix("");
  }

  componentDidUpdate() {
    const { bounds, maxzoom, minzoom, opacity, url } = this.state;

    const size = this.leaflet.getSize();

    if (size.x === 0 && size.y === 0) {
      this.leaflet.invalidateSize();

      if (this.leaflet.getSize() !== size) {
        this.leaflet.fitBounds(bounds);
      }
    }

    if (this.imageryLayer == null) {
      this.imageryLayer = Leaflet.tileLayer(url, {
        minZoom: minzoom,
        maxZoom: maxzoom
      }).addTo(this.leaflet);

      this.leaflet.fitBounds(bounds);
    }

    this.imageryLayer.setOpacity(opacity / 100);
  }

  componentWillUnmount() {
    try {
      // this throws when the map is invisible (size: 0x0), but we should still attempt to clean up event listeners
      this.leaflet.remove();
    } catch (err) {
      console.warn(err);
    }
  }

  updateOpacity = opacity =>
    this.setState({
      opacity
    });

  render() {
    const { width } = this.props;
    const { opacity } = this.state;

    return (
      <div>
        <div
          className="mapContainer"
          ref={c => (this.container = c)}
          style={{ width }}
        />

        <h4>Opacity</h4>
        <Slider
          labelStepSize={10}
          value={opacity}
          max={100}
          onChange={this.updateOpacity}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posm: getPOSMEndpoint(state)
});

export default connect(mapStateToProps)(Map);
