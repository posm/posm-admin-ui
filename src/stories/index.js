import React from "react";

import { FocusStyleManager } from "@blueprintjs/core";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";
import "@blueprintjs/core/dist/blueprint.css";

import AdminPanel from "../components/AdminPanel";
import AOIPanel from "../components/AOIPanel";
import Button from "./Button";
import Card from "../components/Card";
import DownloadsPanel from "../components/DownloadsPanel";
import HomePanel from "../components/HomePanel";
import ImageryPanel from "../components/ImageryPanel";
import OpenDroneMapPanel from "../components/OpenDroneMapPanel";
import SettingsPanel from "../components/SettingsPanel";
import Sidebar from "../components/Sidebar";
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
  <Sidebar>
    <HomePanel />
    <AOIPanel />
    <OpenDroneMapPanel />
    <ImageryPanel />
    <DownloadsPanel />
    <AdminPanel />
    <SettingsPanel />
  </Sidebar>
);

storiesOf("HomePanel", module).add("default", () => <HomePanel />);

storiesOf("DownloadsPanel", module).add("default", () => <DownloadsPanel />);
