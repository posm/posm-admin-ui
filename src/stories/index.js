import React from "react";

import {
  FocusStyleManager,
  Menu,
  MenuItem,
  MenuDivider
} from "@blueprintjs/core";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "@blueprintjs/core/dist/blueprint.css";

import Button from "./Button";
import Card from "../components/Card";
import DownloadsPanel from "../components/DownloadsPanel";
import HomePanel from "../components/HomePanel";
import Welcome from "./Welcome";

import "../index.css";

FocusStyleManager.onlyShowFocusOnTabs();

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

storiesOf("Card", module).add("default", () =>
  <Col md={4}><Card>blah blah</Card></Col>
);

storiesOf("Sidebar", module).add("default", () =>
  <Menu>
    <MenuItem
      iconName="pt-icon-home"
      onClick={console.log("Home")}
      text="Home"
    />
    <MenuItem iconName="pt-icon-polygon-filter" text="AOIs" />
    <MenuDivider />
    <MenuItem
      iconName="pt-icon-mobile-phone"
      text="OpenMapKit"
      href="/omk/"
      target="_blank"
      title="OpenMapKit"
      rel="noopener noreferrer"
    />
    <MenuItem
      iconName="pt-icon-clipboard"
      text="Field Papers"
      href="/fp/"
      target="_blank"
      title="Field Papers"
      rel="noopener noreferrer"
    />
    <MenuItem
      iconName="pt-icon-send-to-map"
      text="OpenStreetMap"
      // TODO don't hard-code me
      href="http://osm.posm.io/"
      target="_blank"
      title="OpenStreetMap"
      rel="noopener noreferrer"
    />
    <MenuItem iconName="pt-icon-airplane" text="OpenDroneMap" />
    <MenuItem iconName="pt-icon-satellite" text="Imagery" />
    <MenuItem iconName="pt-icon-cloud-download" text="Downloads" />
    <MenuDivider />
    <MenuItem iconName="pt-icon-pulse" text="Admin" />
    <MenuItem iconName="pt-icon-cog" text="Settings" />
  </Menu>
);

storiesOf("HomePanel", module).add("default", () => <HomePanel />);

storiesOf("DownloadsPanel", module).add("default", () => <DownloadsPanel />);
