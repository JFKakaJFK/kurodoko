import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DIFFICULTIES from '../../util/difficulties'
import PUZZLE_TYPES from '../../util/puzzle-types'
import { Cell } from '../daily-game'

const Wrapper = styled.div`
  display: grid;
  justify-content: center;
  gap: ${props => props.theme.dailySelectionCellGap}px;
  grid-template-columns: repeat(3, ${props => props.theme.dailySelectionCellWidth}px);
  grid-template-rows: min-content repeat(2, ${props => props.theme.dailySelectionCellWidth}px);

  h2 {
    grid-column: 1 / 4;
    justify-self: start;
    margin: 0;
  }
`

function SizeInput(props) {
  return (
    <Wrapper>
      <h2>Select Puzzle</h2>
      {props.sizes.map((size, i) => (
        <Cell key={i} onClick={() => props.selectOptions(size)}>{size.rows}x{size.cols}</Cell>
      ))}
    </Wrapper>
  )
}

SizeInput.propTypes = {
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
  sizes: PropTypes.arrayOf(PropTypes.shape({
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    difficulty: PropTypes.oneOf(DIFFICULTIES).isRequired
  })).isRequired,
  selectOptions: PropTypes.func.isRequired,
}

export default SizeInput
