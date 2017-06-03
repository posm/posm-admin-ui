import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { Col, Grid, Row } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "@blueprintjs/core/dist/blueprint.css";

import Button from "./Button";
import Welcome from "./Welcome";

storiesOf("Welcome", module).add("to Storybook", () =>
  <Welcome showApp={linkTo("Button")} />
);

storiesOf("Button", module)
  .add("with text", () =>
    <Button onClick={action("clicked")}>Hello Button</Button>
  )
  .add("with some emoji", () =>
    <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>
  );

storiesOf("Card", module)
  .addDecorator(story =>
    <Grid>
      <Row><Col md={12}>Title</Col></Row>
      <Row>
        <Col md={4}>{story()}</Col>
      </Row>
    </Grid>
  )
  .add("default", () => <div className="pt-card">blah blah</div>)
  .add("elevation-1", () =>
    <div className="pt-card pt-elevation-1">blah blah</div>
  )
  .add("elevation-2", () =>
    <div className="pt-card pt-elevation-2">blah blah</div>
  )
  .add("elevation-3", () =>
    <div className="pt-card pt-elevation-3">blah blah</div>
  )
  .add("elevation-4", () =>
    <div className="pt-card pt-elevation-4">blah blah</div>
  );
