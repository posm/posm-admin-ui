import path from "path";

import { Code, H4 } from "@blueprintjs/core";
import React from "react";
import { Panel } from "react-bootstrap";

const styles = {
  li: {
    marginTop: 15,
    marginBottom: 15
  }
};

export default ({ files, posm, style }) =>
  files != null &&
  files.length > 0 && (
    <Panel header={<H4>AOI Files</H4>}>
      <Panel.Body>
        <ul style={style}>
          {files.map(({ contents, description, title }, idx) => (
            <li key={`aoi-${idx}`} style={styles.li}>
              <strong>{title}</strong>
              {description && (
                <span>
                  {" "}
                  - <em>{description}</em>
                </span>
              )}
              <ul style={style}>
                {contents.map(({ file, type }, jdx) => (
                  <li key={`${idx}-${jdx}`}>
                    <a href={`${posm}/aoi/${file}`}>
                      <Code>{path.basename(file)}</Code> - {type}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Panel.Body>
    </Panel>
  );
