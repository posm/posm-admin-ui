import path from "path";

import { Code, H4 } from "@blueprintjs/core";
import React, { Component } from "react";
import { Carousel, Modal, PageHeader, Panel } from "react-bootstrap";
import { connect } from "react-redux";

import AOIFiles from "./AOIFiles";
import { getAOIFiles, getHostname } from "../selectors";

import macSMBConnect1 from "../images/mac-smb-connect-1.png";
import macSMBConnect2 from "../images/mac-smb-connect-2.png";
import macSMBConnect3 from "../images/mac-smb-connect-3.png";

const styles = {
  carousel: {
    backgroundColor: "#666",
    height: 315
  },
  carouselImage: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  outerUL: {
    columnCount: 3,
    listStyle: "none",
    paddingLeft: 10
  },
  ul: {
    listStyle: "none",
    paddingLeft: 10
  }
};

class DownloadsPanel extends Component {
  state = {
    showModal: false
  };

  closeModal = () =>
    this.setState({
      showModal: false
    });

  openModal = () =>
    this.setState({
      showModal: true
    });

  render() {
    const { aoiFiles, hostname, posm, publicFiles } = this.props;
    const { showModal } = this.state;

    return (
      <div className="posm-panel">
        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Connecting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Carousel interval={0} style={styles.carousel}>
              <Carousel.Item>
                <img
                  alt="Connect to Server"
                  style={styles.carouselImage}
                  src={macSMBConnect1}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  alt="Connecting..."
                  style={styles.carouselImage}
                  src={macSMBConnect2}
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  alt="Guest"
                  style={styles.carouselImage}
                  src={macSMBConnect3}
                />
              </Carousel.Item>
            </Carousel>
          </Modal.Body>
        </Modal>
        <PageHeader>Files</PageHeader>
        <Panel>
          <Panel.Heading>
            <H4>
              Public{" "}
              <span
                onClick={this.openModal}
                className="pull-right bp3-icon-standard bp3-icon-help bp3-intent-primary"
              />
            </H4>
          </Panel.Heading>
          <Panel.Body>
            <p>
              To add to this list, copy files to{" "}
              <a href={`smb://${hostname}/public`}>
                <Code>
                  smb://
                  {hostname}
                  /public
                </Code>
              </a>{" "}
              (Windows:{" "}
              <Code>
                \\
                {hostname.toUpperCase()}
                \public
              </Code>
              ), connecting as Guest.
            </p>
            {publicFiles.length > 0 && (
              <ul style={styles.outerUL}>
                {publicFiles.map((file, idx) => (
                  <li key={idx}>
                    <a href={`${posm}/public/${file}`}>
                      <Code>{path.basename(file)}</Code>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p>
              See{" "}
              <a href="https://github.com/posm/posm/wiki/Recommended-Downloads">
                Recommended Downloads{" "}
                <span className="bp3-icon-standard bp3-icon-offline" />
              </a>{" "}
              for a list of tools we recommend making available.
            </p>
          </Panel.Body>
        </Panel>
        <AOIFiles files={aoiFiles} posm={posm} style={styles.ul} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  aoiFiles: getAOIFiles(state),
  hostname: getHostname(state),
  posm: state.config.posm,
  publicFiles: state.publicFiles
});

export default connect(mapStateToProps)(DownloadsPanel);
