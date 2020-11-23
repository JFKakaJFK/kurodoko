import PropTypes from 'prop-types'
import styled from 'styled-components'

const PlainButton = styled.button`
  /* button reset */
  border: 0;
  outline-width: 0;
  background: transparent;
  color: inherit;
  margin: 0;
  padding: 0;

  /* base styles */
  font-variant: all-small-caps;
  cursor: pointer;
  text-decoration: none;
  /* transition: color 300ms ease, background 300ms ease, border-color 300ms ease; */

  &:hover,
  &:active {
    transition: color 300ms ease, background 300ms ease, border-color 300ms ease;
  }
`

const Button = styled(PlainButton)`
  ${props => props.align && `text-align: ${props.align};`}

  ${props => props.primary
    ? `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    border: 1px solid ${props.theme.textColor};
    line-height: 1;
    font-size: 0.75rem;
    padding: 0 1rem;

    &:hover,
    &:active {
      color: ${props.theme.actionHoverColor};
      border-color: ${props.theme.actionHoverBackground};
      background-color: ${props.theme.actionHoverBackground};
    }

    ${props.disabled && `
      pointer-events: none;
      color: ${props.theme.disabledColor};
      border-color: ${props.theme.disabledColor};
    `};
  `
    : `
    &:hover,
    &:active {
      color: ${props.theme.activeColor};
    }

    ${props.disabled && `
      pointer-events: none;
      color: ${props.theme.disabledColor};
    `};
  `}
`

Button.propTypes = {
  children: PropTypes.node,
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center', 'right']),
}

const ButtonRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: .5rem;
`

export default Button

export { ButtonRow }