import { H3 } from "@blueprintjs/core";
import React from "react";
import { Col, Grid, Image, PageHeader, Row } from "react-bootstrap";
import { connect } from "react-redux";

import FilesPanel from "./FilesPanel";
import { getPOSMEndpoint, getApps, getAllowedApps } from "../selectors";

import omkLogo from "../images/omk.png";
import odkLogo from "../images/odk.png";
import fpLogo from "../images/fp.png";
import osmLogo from "../images/osm.png";
import posmLogo from "../images/posm@2x.png";

const styles = {
  row: {
    display: "flex",
    justifyContent: "space-between"
  },
  imageContainer: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center"
  },
  heading: {
    flexShrink: 0
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px",
    flexGrow: 1
  },
  image: {
    margin: "auto",
    maxWidth: "160px"
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    width: "auto",
    margin: "8px",
    padding: "0 32px"
  }
};

const logos = {
  omk: omkLogo,
  fp: fpLogo,
  odkc: odkLogo,
  osm: osmLogo,

  replay: posmLogo,
  odmgcp: posmLogo
};

const HomePanel = ({ apps, osm, posm, allowedApps }) => {
  const filteredApps = apps.filter(
    app => allowedApps.includes(app.key) && app.visibleInHomePanel
  );

  return (
    <div>
      <div className="posm-panel apps">
        <PageHeader>Apps</PageHeader>
        <Grid fluid>
          <Row style={styles.row}>
            {filteredApps.map(app => (
              <Col
                className="bp3-cart bp3-elevation-2"
                md={4}
                style={styles.cardContainer}
              >
                <a
                  style={styles.link}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <H3 style={styles.heading}>{app.name}</H3>
                  <div style={styles.imageContainer}>
                    <Image
                      src={logos[app.key]}
                      style={styles.image}
                      responsive
                    />
                  </div>
                </a>
              </Col>
            ))}
          </Row>
        </Grid>
      </div>
      <FilesPanel />
    </div>
  );
};

HomePanel.propTypes = {};

const mapStateToProps = state => ({
  apps: getApps(state),
  osm: state.osm,
  allowedApps: getAllowedApps(state),
  posm: getPOSMEndpoint(state)
});

export default connect(mapStateToProps)(HomePanel);
