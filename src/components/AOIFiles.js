import path from "path";

import React from "react";
import { Panel } from "react-bootstrap";

export default ({ files, posm, style }) =>
  files != null &&
  files.length > 0 &&
  <Panel header="AOI Files">
    <ul style={style}>
      {files.map(({ contents, description, title }, idx) =>
        <li key={`aoi-${idx}`}>
          <strong>{title}</strong>
          {description && <span> - <em>{description}</em></span>}
          <ul style={style}>
            {contents.map(({ file, type }, jdx) =>
              <li key={`${idx}-${jdx}`}>
                <a href={`${posm}/aoi/${file}`}>
                  <code>{path.basename(file)}</code> - {type}
                </a>
              </li>
            )}
          </ul>
        </li>
      )}
    </ul>
  </Panel>;
