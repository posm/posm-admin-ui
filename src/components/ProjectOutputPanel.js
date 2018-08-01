import { Code, H4 } from "@blueprintjs/core";
import prettyBytes from "pretty-bytes";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Image } from "react-bootstrap";

import { highlight } from "../lib";
import Map from "./Map";

export default class ProjectSourcesPanel extends Component {
  static propTypes = {
    artifacts: PropTypes.array.isRequired,
    endpoint: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired
  };

  getAPIOutput() {
    const { project } = this.props;

    return (
      <div>
        <H4 className="x_title">API Output</H4>
        <pre
          dangerouslySetInnerHTML={{
            __html: highlight(JSON.stringify(project, null, 2), "json")
          }}
        />
      </div>
    );
  }

  getLogs() {
    const { endpoint } = this.props;
    return (
      <div>
        <H4 className="x_title">Logs</H4>
        <ul className="row list-unstyled">
          <li className="col-xs-4">
            <a href={`${endpoint}/logs/stderr`}>
              <Code>stderr.log</Code>
            </a>
          </li>
          <li className="col-xs-4">
            <a href={`${endpoint}/logs/stdout`}>
              <Code>stdout.log</Code>
            </a>
          </li>
        </ul>
      </div>
    );
  }

  getOutputs() {
    const { artifacts, endpoint } = this.props;

    if (artifacts.length === 0) {
      return null;
    }

    return (
      <div>
        <H4 className="x_title">Outputs</H4>
        <ul className="row list-unstyled">
          {artifacts.map((artifact, col) => (
            <li className="col-xs-4" key={col}>
              <a href={`${endpoint}/artifacts/${artifact}`}>
                <Code>{artifact}</Code>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  getPreview() {
    const { endpoint, project } = this.props;

    if (project.meta == null) {
      return null;
    }

    const { user } = project;
    const { crs_wkt, height, width } = project.meta;
    let { bounds, resolution, size } = project.meta;

    const projName = crs_wkt.split(/"/)[1];
    const epsgCode = crs_wkt
      .split(/\[/)
      .pop()
      .split(/,/)
      .pop()
      .replace(/[^\d]/g, "");

    bounds = bounds.map(x => x.toFixed(5)).join(", ");
    resolution = resolution.map(x => `${x.toFixed(2)} m`).join(" × ");
    size = prettyBytes(size);

    return (
      <div className="row">
        <div className="col-md-4">
          <div className="thumbnail">
            <a href={`${endpoint}/artifacts/odm_orthophoto.tif`}>
              <Image src={`${endpoint}/artifacts/ortho_thumb.png`} />
            </a>
            <div className="caption">
              <dl>
                <dt>Bounds</dt>
                <dd>{bounds}</dd>
                <dt>Resolution</dt>
                <dd>{resolution}</dd>
                <dt>Width × Height</dt>
                <dd>
                  {width} × {height}
                </dd>
                <dt>Filesize</dt>
                <dd>{size}</dd>
                <dt>Coordinate Reference System</dt>
                <dd>
                  {projName} (EPSG:
                  {epsgCode})
                </dd>
              </dl>
            </div>
          </div>
        </div>
        {user.imagery != null && (
          <div className="col-md-8">
            <Map tileJSON={user.imagery} width="100%" />
          </div>
        )}
      </div>
    );
  }

  render() {
    // TODO extract these into components
    const preview = this.getPreview();
    const outputs = this.getOutputs();
    const logs = this.getLogs();
    const apiOutput = this.getAPIOutput();

    return (
      <div>
        {preview}

        {outputs}

        {logs}

        {apiOutput}
      </div>
    );
  }
}
