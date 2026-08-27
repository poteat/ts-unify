/**
 * The default and minimum size of each panel, in percent of its group:
 * the sidebar and the main column, each split into a top and a bottom.
 */
export const PANEL_SIZES = {
  sidebar: { defaultSize: 22, minSize: 15 },
  sidebarTop: { defaultSize: 60, minSize: 20 },
  sidebarBottom: { defaultSize: 40, minSize: 15 },
  main: { defaultSize: 78, minSize: 30 },
  mainTop: { defaultSize: 60, minSize: 20 },
  mainBottom: { defaultSize: 40, minSize: 15 },
} as const
