import path from "path";

import { createSelector } from "reselect";

export const getAvailableAOIs = state => state.aois.available || [];

export const getAOIFiles = createSelector([getAvailableAOIs], aois =>
  aois.map(({ contents, description, name, title }) => ({
    title,
    description,
    contents: Object.entries(contents).map(([file, { type }]) => ({
      file: path.join(name, file),
      type
    }))
  }))
);

export const getActiveAOI = state => state.aois.active;

export const getActiveAOIName = createSelector(
  [getAvailableAOIs, getActiveAOI],
  (aois, activeAOI) => {
    const active = aois.find(x => x.name === activeAOI);

    return active && active.title;
  }
);

export const getFQDN = state => state.network.fqdn || "";

export const getHostname = state => state.network.hostname || "";

export const getODMEndpoint = state => state.config.odmEndpoint;

export const getPOSMEndpoint = state => state.config.posm;
