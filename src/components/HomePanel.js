import React from "react";
import { Alert, Col, Grid, Image, Row } from "react-bootstrap";

import Card from "./Card";
import DownloadsPanel from "./DownloadsPanel";

import omkLogo from "../images/omk.png";
import fpLogo from "../images/fp.png";
import osmLogo from "../images/osm.png";

const styles = {
  card: {},
  image: {
    margin: "auto"
  }
};

const HomePanel = () =>
  <div>
    <div className="posm-panel">
      <Alert bsStyle="success">
        <a href="TODO">Active AOI</a>: <strong>Bruxelles</strong>
      </Alert>
      <Grid fluid>
        <Row>
          <Col md={4}>
            <a href="/omk/" target="_blank" rel="noopener noreferrer">
              <Card style={styles.card}>
                <h3>OpenMapKitServer</h3>
                <Image src={omkLogo} style={styles.image} responsive />
              </Card>
            </a>
          </Col>
          <Col md={4}>
            <a href="/fp/" target="_blank" rel="noopener noreferrer">
              <Card style={styles.card}>
                <h3>Field Papers</h3>
                <Image src={fpLogo} style={styles.image} responsive />
              </Card>
            </a>
          </Col>
          <Col md={4}>
            {/* TODO don't hard-code this */}
            <a
              href="http://osm.posm.io/"
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
    <DownloadsPanel />
  </div>;

HomePanel.title = "Home";

HomePanel.propTypes = {};

export default HomePanel;
