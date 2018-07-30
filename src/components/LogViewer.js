import React, { Component } from "react";
import { Event } from "react-socket-io";
import { Terminal } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";

import "xterm/dist/xterm.css";

Terminal.applyAddon(fit);

const styles = {
  height: 400
};

export default class LogViewer extends Component {
  onMessage = msg => {
    this.terminal.writeln(msg.output.replace(/\n/, "\r\n"));
  };

  componentDidMount() {
    this.terminal = new Terminal({
      cursorBlink: false
    });
    this.terminal.open(this.container);
    this.terminal.fit();
  }

  componentWillUnmount() {
    if (this.terminal) {
      this.terminal.destroy();
      this.terminal = null;
    }
  }

  render() {
    const { event, style } = this.props;

    return (
      <div
        id="terminal"
        ref={c => (this.container = c)}
        style={{ ...styles, ...style }}
      >
        <Event event={event} handler={this.onMessage} />
      </div>
    );
  }
}
