import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const toggleBoxSize = 16 // px
const toggleStateGap = 4 // times of boxSizes in between states

const ToggleWrapper = styled.div`
  position: relative;
  width: ${toggleBoxSize * (toggleStateGap + 1)}px;
  ${props => props.disabled
    ? `pointer-events: none; opacity: .8;`
    : `cursor: pointer;`
  }

  &:before {
    content: '';
    width: ${toggleBoxSize * toggleStateGap}px;
    height: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-top: 1px solid ${props => props.theme.textColor};
  }

  div {
    width: ${toggleBoxSize}px;
    height: ${toggleBoxSize}px;
    background: ${props => props.theme.backgroundColor};
    border: 1px solid ${props => props.theme.textColor};
    transform-origin: center;
    transform: translateX(${props => props.value ? `0` : `${toggleBoxSize * toggleStateGap}`}px) translateZ(0);
    transition: transform 0.3s ease-out, background 300ms ease;
  }
`

function Toggle({ value, onChange, disabled }) {
  return (
    <ToggleWrapper value={value} disabled={disabled} onClick={disabled ? null : onChange}>
      <div />
    </ToggleWrapper>
  )
}

Toggle.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

const ToggleSwitchWrapper = styled.button`
  /* button reset */
  border: 0;
  outline-width: 0;
  background: transparent;
  color: inherit;
  margin: 0;
  padding: 0;

  /* base styles */
  text-decoration: none;

  display: grid;
  width: min-content;
  font-variant: all-small-caps;
  font-size: 0.75rem;
  gap: .5em;

  div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

function ToggleSwitch({ value, onChange, disabled, on, off }) {
  return (
    <ToggleSwitchWrapper>
      <div>
        <span>{on ? on : 'On'}</span>
        <span>{off ? off : 'Off'}</span>
      </div>
      <Toggle value={value} disabled={disabled} onChange={onChange} />
    </ToggleSwitchWrapper>
  )
}

ToggleSwitch.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  on: PropTypes.string,
  off: PropTypes.string,
}

export default Toggle

export {
  ToggleSwitch
}