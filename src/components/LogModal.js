import React from "react";
import { Modal } from "react-bootstrap";

import LogViewer from "./LogViewer";

export default ({ event, onHide, show }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Logs</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <LogViewer event={event} />
    </Modal.Body>
  </Modal>
);
