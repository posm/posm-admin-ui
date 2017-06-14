import React from "react";
import { Col, Grid, Image, PageHeader, Row } from "react-bootstrap";
import { connect } from "react-redux";

import Card from "./Card";
import FilesPanel from "./FilesPanel";
import { getPOSMEndpoint } from "../selectors";

import omkLogo from "../images/omk.png";
import fpLogo from "../images/fp.png";
import osmLogo from "../images/osm.png";

const styles = {
  card: {},
  image: {
    margin: "auto"
  }
};

const HomePanel = ({ osm, posm }) =>
  <div>
    <div className="posm-panel">
      <PageHeader>Apps</PageHeader>
      <Grid fluid>
        <Row>
          <Col md={4}>
            <a href={`${posm}/omk/`} target="_blank" rel="noopener noreferrer">
              <Card style={styles.card}>
                <h3>OpenMapKitServer</h3>
                <Image src={omkLogo} style={styles.image} responsive />
              </Card>
            </a>
          </Col>
          <Col md={4}>
            <a href={`${posm}/fp/`} target="_blank" rel="noopener noreferrer">
              <Card style={styles.card}>
                <h3>Field Papers</h3>
                <Image src={fpLogo} style={styles.image} responsive />
              </Card>
            </a>
          </Col>
          <Col md={4}>
            <a
              href={`http://${osm.fqdn}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card style={styles.card}>
                <h3>OpenStreetMap</h3>
                <Image src={osmLogo} style={styles.image} responsive />
              </Card>
            </a>
          </Col>
        </Row>
      </Grid>
    </div>
    <FilesPanel />
  </div>;

HomePanel.propTypes = {};

const mapStateToProps = state => ({
  osm: state.osm,
  posm: getPOSMEndpoint(state)
});

export default connect(mapStateToProps)(HomePanel);
