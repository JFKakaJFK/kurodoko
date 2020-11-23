import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'gatsby'

import PUZZLE_TYPES, { KURODOKO } from '../../util/puzzle-types'
import Grid, { GridCell } from '../../styles/grid'
import { WHITE, BLACK, UNDEFINED, isWhite, isUndef } from '../../util/puzzle-representation'
import Button, { ButtonRow } from '../../styles/button'

const TutorialWrapper = styled.div`
  align-self: stretch;
  padding: ${props => props.theme.padding};
  display: grid;
  grid-template-rows: 1fr 2fr auto;

  > :first-child {
    align-self: center;
    text-align: center;
    font-size: 0.975rem;
    margin: 0 0 .5rem;
  }

  .sc {
    text-align: center;
    font-size: .75rem;
    font-variant: all-small-caps;
    margin: .25rem 0;

    &:empty::after {
      content: '.';
      visibility: hidden;
    }
  }

  a {
    text-decoration: none;
    display: contents;
  }
`

function Tutorial(props) {
  const [stage, setStage] = useState(0)
  const [grid, setGrid] = useState(PUZZLE_TYPES[props.type].tutorial.length > 0 ? JSON.parse(JSON.stringify(PUZZLE_TYPES[props.type].tutorial[0].grid)) : null)
  if (PUZZLE_TYPES[props.type].tutorial.length <= 0) {
    props.back()
    return null
  }

  const currentStage = PUZZLE_TYPES[props.type].tutorial[stage]

  const update = (row, col) => {
    if (currentStage.grid[row, col].locked) return

    // change cell
    const newGrid = JSON.parse(JSON.stringify(grid))
    // undef -> white -> black -> undef -> ...
    newGrid[row][col].value = isUndef(grid[row][col].value)
      ? WHITE
      : isWhite(grid[row][col].value)
        ? BLACK
        : UNDEFINED

    // if the new value is the solution for this cell, 
    // check if any moves left or advance to next stage
    if (newGrid[row][col].value === newGrid[row][col].solution &&
      newGrid.every(row => row.every(
        (cell) => cell.locked || cell.value === cell.solution))) {
      toStage(stage + 1)
      return
    }

    setGrid(newGrid)
  }

  const toStage = (newStage) => {
    // call back fn if the tutorial is done, else advance the stage
    if (newStage >= PUZZLE_TYPES[props.type].tutorial.length) {
      if (!props.linkToMain) props.back()
      return
    }
    setStage(newStage)
    setGrid(JSON.parse(JSON.stringify(PUZZLE_TYPES[props.type].tutorial[newStage].grid)))
  }

  return <TutorialWrapper onClick={() => currentStage.clickAnywhereToAdvance && toStage(stage + 1)}>
    <currentStage.description />
    <Grid rows={currentStage.rows} cols={currentStage.cols} type={props.type}>
      {grid.map((row, i) => row.map((cell, j) => <GridCell
        key={i * currentStage.cols + j}
        type={props.type}
        val={cell.value}
        isLocked={cell.locked}
        highlighted={cell.highlighted}
        onClick={() => !cell.locked && update(i, j)}
      />))}
    </Grid>
    {stage === PUZZLE_TYPES[props.type].tutorial.length - 1
      ? props.linkToMain
        ? <ButtonRow><Link to={props.type === KURODOKO ? '/kurodoko/' : '/ohno/'}><Button primary>Play</Button></Link></ButtonRow>
        : <ButtonRow><Button primary>Play</Button></ButtonRow>
      : <p className="sc">{currentStage.clickAnywhereToAdvance && `Tap the grid to continue.`}</p>
    }
  </TutorialWrapper>
}

Tutorial.propTypes = {
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
  back: PropTypes.func.isRequired,
  linkToMain: PropTypes.bool
}

export default Tutorial
