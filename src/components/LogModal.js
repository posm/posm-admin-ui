import React from "react";
import { Button, Modal } from "react-bootstrap";

import LogViewer from "./LogViewer";

export default ({ event, onHide, show }) =>
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Logs</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <LogViewer event={event} />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>;
