import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isWhite, isNumber, getNumber, getColor } from '../../util/puzzle-representation'
import PUZZLE_TYPES from '../../util/puzzle-types'

const CellStyles = styled.div`

  display: flex;
  align-items: center;
  justify-content: center;
  font-variant: all-small-caps tabular-nums;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  outline-width: 0;
  /* ${props => props.highlighted && !props.theme[props.type].whiteHasCircle && `box-shadow: inset 0 0 0 ${props.theme[props.type].gridGap}px ${props.theme[props.type].gridHighlightBackground};`} */
  /* ${props => props.highlighted && !props.theme[props.type].whiteHasCircle && `border: ${props.theme[props.type].gridGap}px solid ${props.theme[props.type].gridHighlightBackground}; margin: -${props.theme[props.type].gridGap}px;`} */
  transition: background .3s ease, color .3s ease, width .3s ease, height .3s ease;
  ${props => props.isLocked ? `pointer-events: none;` : `cursor: pointer;`}

  position: relative;

  color: ${props => props.hideValue
    ? 'transparent'
    : props.theme[props.type][getColor(props.val)][props.highlighted
      ? 'highlightColor'
      : props.decision
        ? props.decisionCellChanged ? 'decisionChangedColor' : 'decisionColor'
        : 'color'
    ]};
  background: ${props => props.theme[props.type][getColor(props.val)][props.highlighted
    ? 'highlightBackgroundColor'
    : props.decision
      ? props.decisionCellChanged ? 'decisionChangedBackgroundColor' : 'decisionBackgroundColor'
      : 'backgroundColor'
  ]};
  border-radius: ${props => props.theme[props.type].cellRadius};

  ${props => {
    const thickness = props.highlighted ? props.theme[props.type].highlightCellBorderThickness : props.theme[props.type].cellBorderThickness
    const color = props.theme[props.type][getColor(props.val)][props.highlighted
      ? 'highlightBorderColor'
      : props.decision
        ? props.decisionCellChanged ? 'decisionChangedBorderColor' : 'decisionBorderColor'
        : 'borderColor']
    return (thickness > 0 && color !== 'transparent') ? `border: ${thickness}px solid ${color};` : ``
  }}

  svg {
    ${props => !props.theme[props.type][getColor(props.val)].circle && `display: none;`}
    width: 20%;
    height: auto;
    object-position: center;
    fill: currentColor;
  }

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

const Circle = () => <svg width="4" height="4" viewBox="0 0 4 4" xmlns="http://www.w3.org/2000/svg">
  <circle cx="2" cy="2" r="2" />
</svg>


const Cell = (props) => (
  <CellStyles {...props}>
    {isWhite(props.val) && (!isNumber(props.val) ? <Circle /> : getNumber(props.val))}
  </CellStyles>
)

Cell.propTypes = {
  val: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
  isLocked: PropTypes.bool,
  hideValue: PropTypes.bool,
  highlighted: PropTypes.bool,
  decision: PropTypes.bool,
  decisionCellChanged: PropTypes.bool
}

export default Cell