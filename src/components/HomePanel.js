import { H3 } from "@blueprintjs/core";
import React from "react";
import { Col, Grid, Image, PageHeader, Row } from "react-bootstrap";
import { connect } from "react-redux";

import Card from "./Card";
import FilesPanel from "./FilesPanel";
import { getPOSMEndpoint, getApps } from "../selectors";

import omkLogo from "../images/omk.png";
import fpLogo from "../images/fp.png";
import osmLogo from "../images/osm.png";

const styles = {
  card: {},
  image: {
    margin: "auto"
  }
};

const HomePanel = ({ apps, osm, posm }) => (
  <div>
    <div className="posm-panel apps">
      <PageHeader>Apps</PageHeader>
      <Grid fluid>
        <Row>
          {apps.map(x => x.name).includes("OpenMapKit") && (
            <Col md={4}>
              <a
                href={`${posm}/omk/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card style={styles.card}>
                  <H3>OpenMapKitServer</H3>
                  <Image src={omkLogo} style={styles.image} responsive />
                </Card>
              </a>
            </Col>
          )}
          {apps.map(x => x.name).includes("Field Papers") && (
            <Col md={4}>
              <a href={`${posm}/fp/`} target="_blank" rel="noopener noreferrer">
                <Card style={styles.card}>
                  <H3>Field Papers</H3>
                  <Image src={fpLogo} style={styles.image} responsive />
                </Card>
              </a>
            </Col>
          )}
          {apps.map(x => x.name).includes("OpenStreetMap") && (
            <Col md={4}>
              <a
                href={`http://${osm.fqdn}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card style={styles.card}>
                  <H3>OpenStreetMap</H3>
                  <Image src={osmLogo} style={styles.image} responsive />
                </Card>
              </a>
            </Col>
          )}
        </Row>
      </Grid>
    </div>
    <FilesPanel />
  </div>
);

HomePanel.propTypes = {};

const mapStateToProps = state => ({
  apps: getApps(state),
  osm: state.osm,
  posm: getPOSMEndpoint(state)
});

export default connect(mapStateToProps)(HomePanel);
