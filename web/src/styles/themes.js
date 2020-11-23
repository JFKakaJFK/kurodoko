import React from 'react'

import { WHITE, BLACK, UNDEFINED } from '../util/puzzle-representation'

const COLORS = {
  white: (opacity = 1) => `hsla(0, 0%, 100%, ${opacity})`, // #FFFFFF
  black: (opacity = 1) => `hsla(0, 0%, 6%, ${opacity})`, // #101010
  light_black: (opacity = 1) => `hsla(0, 0%, 20%, ${opacity})`, // #343434
  light_gray: (opacity = 1) => `hsla(0, 0%, 92%, ${opacity})`, // #EAEAEA
  gray_medium: (opacity = 1) => `hsla(0, 0%, 71%, ${opacity})`, // #B5B5B5
  gray: (lightness = 50, opacity = 1) => `hsla(0, 0%, ${lightness}%, ${opacity})`, // #B5B5B5
  red: (opacity = 1) => `hsla(346, 100%,  37%, ${opacity})` // #BC002D
}

// common styles across all themes
const base = {
  // typo
  defaultFont: `'Roboto Slab'`,
  defaultFontWeight: '400',
  // breakpoints
  md: 600,//768, // px (tablet)
  // general layout
  headerHeight: '84px',
  headerPadding: '1.5rem',
  padding: '2.5rem',
  // for nikoli selection
  nikoliSelectionRows: 7,
  nikoliSelectionCols: 5,
  nikoliSelectionSliderGap: 40, // px
  nikoliSelectionCellWidth: 40, // px
  nikoliSelectionCellGap: 10, // px
  // daily selection // TODO currently also used for random game size selection
  dailySelectionCellWidth: 64, // px
  dailySelectionCellGap: 10, // px
  // for the puzzle grid
  OHNO: {
    gridGap: 4,
    cellRadius: '50%',
    minCellWidth: 16, // px // 24,
    maxCellWidth: 48, // px
    cellBorderThickness: 1, // px
    highlightCellBorderThickness: 3, // px
  },
  KURODOKO: {
    gridGap: 1,
    cellRadius: '0',
    minCellWidth: 16, // px // 24,
    maxCellWidth: 48, // px
    cellBorderThickness: 0,
    highlightCellBorderThickness: 3,
  },
}

const light = {
  ...base,
  // needed for preference matching
  name: 'light',
  query: '(prefers-color-scheme: light)',
  // base colors
  textColor: COLORS.black(),
  backgroundColor: COLORS.white(),
  disabledColor: COLORS.gray_medium(),
  actionHoverColor: COLORS.white(),
  actionHoverBackground: COLORS.red(),
  activeColor: COLORS.red(),
  OHNO: {
    ...base.OHNO,
    gridBorderColor: 'transparent',
    gridLineColor: 'transparent',
    [WHITE]: {
      // normal
      borderColor: 'transparent',
      color: COLORS.black(),
      backgroundColor: COLORS.light_gray(),
      // decision - normal cells
      decisionBorderColor: 'transparent',
      decisionColor: COLORS.black(),
      decisionBackgroundColor: COLORS.gray(82, 1),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: COLORS.black(),
      decisionChangedBackgroundColor: COLORS.gray(95),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: COLORS.black(),
      highlightBackgroundColor: COLORS.light_gray(),
    },
    [BLACK]: {
      // normal
      borderColor: 'transparent',
      color: 'transparent',
      backgroundColor: COLORS.red(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: 'transparent',
      decisionBackgroundColor: `hsla(346, 68%,  37%, 1)`,
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: COLORS.red(.9),
      // highlight
      highlightBorderColor: COLORS.black(),
      highlightColor: 'transparent',
      highlightBackgroundColor: COLORS.red(),
    },
    [UNDEFINED]: {
      // normal
      borderColor: COLORS.light_gray(),
      color: 'transparent',
      backgroundColor: 'transparent',
      // decision
      decisionBorderColor: COLORS.light_gray(),
      decisionColor: 'transparent',
      decisionBackgroundColor: 'transparent',
      // decision - cells changed in decision mode
      decisionChangedBorderColor: COLORS.light_gray(),
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: 'transparent',
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: 'transparent',
      highlightBackgroundColor: 'transparent',
    },
  },
  KURODOKO: {
    ...base.KURODOKO,
    gridBorderColor: COLORS.black(),
    gridLineColor: COLORS.gray_medium(),
    [WHITE]: {
      circle: true,
      // normal
      borderColor: 'transparent',
      color: COLORS.black(),
      backgroundColor: COLORS.white(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: COLORS.black(),
      decisionBackgroundColor: COLORS.white(),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: COLORS.gray(50),
      decisionChangedBackgroundColor: COLORS.white(),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: COLORS.black(),
      highlightBackgroundColor: COLORS.white(),
    },
    [BLACK]: {
      // normal
      borderColor: 'transparent',
      color: 'transparent',
      backgroundColor: COLORS.black(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: 'transparent',
      decisionBackgroundColor: COLORS.black(),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: COLORS.gray(50),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: 'transparent',
      highlightBackgroundColor: COLORS.black(),
    },
    [UNDEFINED]: {
      // normal
      borderColor: 'transparent',
      color: 'transparent',
      backgroundColor: COLORS.white(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: 'transparent',
      decisionBackgroundColor: COLORS.white(),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: COLORS.white(),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: 'transparent',
      highlightBackgroundColor: COLORS.white(),
    },
  },
}

const dark = {
  ...base,
  // needed for preference matching
  name: 'dark',
  query: '(prefers-color-scheme: dark)',
  // base colors
  textColor: COLORS.white(),
  backgroundColor: COLORS.black(),
  disabledColor: COLORS.gray_medium(),
  actionHoverColor: COLORS.white(),
  actionHoverBackground: COLORS.red(),
  activeColor: COLORS.red(),
  OHNO: {
    ...base.OHNO,
    gridBorderColor: 'transparent',
    gridLineColor: 'transparent',
    [WHITE]: {
      // normal
      borderColor: 'transparent',
      color: COLORS.black(),
      backgroundColor: COLORS.white(),
      // decision - normal cells
      decisionBorderColor: 'transparent',
      decisionColor: COLORS.black(),
      decisionBackgroundColor: COLORS.white(.75),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: COLORS.black(),
      decisionChangedBackgroundColor: COLORS.white(),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: COLORS.black(),
      highlightBackgroundColor: COLORS.white(),
    },
    [BLACK]: {
      // normal
      borderColor: 'transparent',
      color: 'transparent',
      backgroundColor: COLORS.red(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: 'transparent',
      decisionBackgroundColor: COLORS.red(.55),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: COLORS.red(),
      // highlight
      highlightBorderColor: COLORS.white(),
      highlightColor: 'transparent',
      highlightBackgroundColor: COLORS.red(),
    },
    [UNDEFINED]: {
      // normal
      borderColor: COLORS.light_gray(),
      color: 'transparent',
      backgroundColor: 'transparent',
      // decision
      decisionBorderColor: COLORS.light_gray(),
      decisionColor: 'transparent',
      decisionBackgroundColor: 'transparent',
      // decision - cells changed in decision mode
      decisionChangedBorderColor: COLORS.light_gray(),
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: 'transparent',
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: 'transparent',
      highlightBackgroundColor: 'transparent',
    },
  },
  KURODOKO: {
    ...base.KURODOKO,
    gridBorderColor: COLORS.black(),
    gridLineColor: COLORS.gray_medium(),
    [WHITE]: {
      circle: true,
      // normal
      borderColor: 'transparent',
      color: COLORS.black(),
      backgroundColor: COLORS.white(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: COLORS.black(),
      decisionBackgroundColor: COLORS.white(),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: COLORS.gray(50),
      decisionChangedBackgroundColor: COLORS.white(),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: COLORS.black(),
      highlightBackgroundColor: COLORS.white(),
    },
    [BLACK]: {
      // normal
      borderColor: 'transparent',
      color: 'transparent',
      backgroundColor: COLORS.black(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: 'transparent',
      decisionBackgroundColor: COLORS.black(),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: COLORS.gray(50),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: 'transparent',
      highlightBackgroundColor: COLORS.black(),
    },
    [UNDEFINED]: {
      // normal
      borderColor: 'transparent',
      color: 'transparent',
      backgroundColor: COLORS.white(),
      // decision
      decisionBorderColor: 'transparent',
      decisionColor: 'transparent',
      decisionBackgroundColor: COLORS.white(),
      // decision - cells changed in decision mode
      decisionChangedBorderColor: 'transparent',
      decisionChangedColor: 'transparent',
      decisionChangedBackgroundColor: COLORS.white(),
      // highlight
      highlightBorderColor: COLORS.red(),
      highlightColor: 'transparent',
      highlightBackgroundColor: COLORS.white(),
    },
  },
}

const defaultTheme = 'light'

const THEMES = {
  light,
  dark
}

const ThemeContext = React.createContext()

export default THEMES

export {
  defaultTheme,
  ThemeContext
}