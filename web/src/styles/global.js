import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  html, body, #___gatsby, #gatsby-focus-wrapper {
    height: 100%;
  }

  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
    /* overflow-y: scroll; */

    color: ${props => props.theme.textColor};
    background: ${props => props.theme.backgroundColor};
    transition: color 300ms ease, background 300ms ease;
  }
  * {
    box-sizing: inherit;
  }
  *:before {
    box-sizing: inherit;
  }
  *:after {
    box-sizing: inherit;
  }
  body {
    position: relative;
    /* max-width: ${props => props.theme.md}px; */
    margin: 0 auto;
    overflow-x: hidden;

    /* fixes weird cascading bug?? */
    color: ${props => props.theme.textColor};
    background: ${props => props.theme.backgroundColor};
    transition: color 300ms ease, background 300ms ease;

    font-family: ${props => props.theme.defaultFont}, -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    font-weight: ${props => props.theme.defaultFontWeight};
    font-variant: tabular-nums;
    /* font-variant-numeric: tabular-nums; */
    font-size: 1.125rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    word-wrap: break-word;
    font-kerning: normal;
    font-feature-settings: "kern", "liga", "clig", "calt", 'pnum' on, 'lnum' on;
    text-rendering: optimizeLegibility;
  }

  h1,
  h2 {
    font-variant: all-small-caps;
    font-size: 0.75rem;
    font-weight: inherit;

    /* //TODO maybe not on global level */
    &:empty::after {
      content: '.';
      visibility: hidden;
    }
  }

  h1 {
    border: 0;
    border-bottom: 1px solid ${props => props.theme.textColor};
  }

  a {
    background-color: transparent;
    -webkit-text-decoration-skip: objects;
    color: ${props => props.theme.textColor};
    text-decoration: underline;

    &:hover,
    &:active {
      outline-width: 0;
      color: ${props => props.theme.activeColor};
    }
    
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font: inherit;
    margin: 0;
  }

  button,
  input {
    overflow: visible;
  }

  img {
    max-width: 100%;
  }

  button,
  input,
  select,
  a,
  svg {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  ::selection {
    color: ${props => props.theme.actionHoverColor};
    background: ${props => props.theme.actionHoverBackground};
  }

  @media only screen and (max-width: 480px) {
    html {
      font-size: 100%;
    }
  }
`
export default GlobalStyles
