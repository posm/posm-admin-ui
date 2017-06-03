import React from "react";
import { Alert, Col, Grid, Image, PageHeader, Row } from "react-bootstrap";

import Card from "./Card";
import DownloadsPanel from "./DownloadsPanel";

import omkLogo from "../images/omk.png";
import fpLogo from "../images/fp.png";
import osmLogo from "../images/osm.png";

const styles = {
  card: {
    minHeight: 350
  },
  col: {
    position: "relative"
  },
  image: {
    margin: "auto"
  }
};

const HomePanel = () =>
  <div>
    <PageHeader>Home</PageHeader>
    <Alert bsStyle="success">
      <a href="#">Active AOI</a>: <strong>Bruxelles</strong>
    </Alert>
    <Grid fluid>
      <Row>
        <Col md={4} mdOffset={0} style={styles.col}>
          <a href="/omk/" target="_blank">
            <Card style={styles.card}>
              <h3>OpenMapKitServer</h3>
              <Image src={omkLogo} style={styles.image} responsive />
            </Card>
          </a>
        </Col>
        <Col md={4} style={styles.col}>
          <a href="/fp/" target="_blank">
            <Card style={styles.card}>
              <h3>Field Papers</h3>
              <Image src={fpLogo} style={styles.image} responsive />
            </Card>
          </a>
        </Col>
        <Col md={4} style={styles.col}>
          {/* TODO don't hard-code this */}
          <a href="http://osm.posm.io/" target="_blank">
            <Card style={styles.card}>
              <h3>OpenStreetMap</h3>
              <Image src={osmLogo} style={styles.image} responsive />
            </Card>
          </a>
        </Col>
      </Row>
    </Grid>
    <DownloadsPanel />
  </div>;

HomePanel.title = "Home";

HomePanel.propTypes = {};

export default HomePanel;
