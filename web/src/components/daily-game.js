import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import DIFFICULTIES from '../util/difficulties'
import PUZZLE_TYPES, { OHNO, KURODOKO } from '../util/puzzle-types'
import { RandomGame } from './random-game'
import Footer, { FooterLink } from '../styles/footer'
import Button from '../styles/button'
import useLSState from '../hooks/use-ls-state'
import { boolArrayToBitString, getBool, setBit } from '../util/bitstrings'
import styled from 'styled-components'

function useDailyGameStorage() {
  const initial = {
    today: new Date().toLocaleDateString(),
    OHNO: boolArrayToBitString(PUZZLE_TYPES[OHNO].dailySizes.map(s => false)),
    KURODOKO: boolArrayToBitString(PUZZLE_TYPES[KURODOKO].dailySizes.map(s => false))
  }
  const [state, setState] = useLSState('daily', { ...initial })

  const isSolved = (type, size) => {
    const index = PUZZLE_TYPES[type].dailySizes.findIndex(s => s.rows === size.rows && s.cols === size.cols)
    return index >= 0 && state.today === new Date().toLocaleDateString() && getBool(state[type], index)
  }

  const solve = (type, size) => {
    const index = PUZZLE_TYPES[type].dailySizes.findIndex(s => s.rows === size.rows && s.cols === size.cols)
    setState(Object.assign({ ...state }, { [type]: setBit(state[type], index, true) }))
  }

  useEffect(() => {
    // check if date is today, if not wipe
    if (state.today !== new Date().toLocaleDateString()) setState({ ...initial })
  }, [state])

  return [isSolved, solve]
}

const DailySizeSelectionStyles = styled.div`
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

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-variant: small-caps tabular-nums;
  line-height: 1;
  cursor: pointer;
  ${
  props => props.solved
    ? `color: ${props.theme.actionHoverColor}; border: 0; background: ${props.theme.actionHoverBackground};`
    : `border: 1px solid ${props.theme.textColor};`
  }
  transition: all .5s ease-out;
  &:hover {
    border: 0;
    color: ${props => props.theme.actionHoverColor};
    background: ${props => props.theme.actionHoverBackground};
  }
`

function DailySizeSelection(props) {
  return (
    <DailySizeSelectionStyles>
      <h2>Select Size</h2>
      {props.sizes.map((size, i) => <Cell key={i} onClick={() => props.selectOptions(size)} solved={size.solved}>{size.rows}x{size.cols}</Cell>)}
    </DailySizeSelectionStyles>
  )
}

DailySizeSelection.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.shape({
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired,
    difficulty: PropTypes.oneOf(DIFFICULTIES).isRequired,
    solved: PropTypes.bool.isRequired
  })).isRequired,
  selectOptions: PropTypes.func.isRequired
}

function DailyGame(props) {
  const [isSolved, solve] = useDailyGameStorage()
  const [{ rows, cols, difficulty }, selectOptions] = useState({})

  if (!rows || !cols || !difficulty) return (
    <>
      <DailySizeSelection
        sizes={PUZZLE_TYPES[props.type].dailySizes.map(size => ({ ...size, solved: isSolved(props.type, size) }))}
        selectOptions={selectOptions}
      />
      <Footer>
        <FooterLink to={props.backUrl}>Back</FooterLink>
      </Footer>
    </>
  )

  return (
    <>
      <RandomGame
        rows={rows}
        cols={cols}
        difficulty={difficulty}
        seed={new Date().toLocaleDateString()}
        type={props.type}
        onSolve={() => solve(props.type, { rows, cols })}
      />
      <Footer>
        <Button onClick={() => selectOptions({})}>Back</Button>
      </Footer>
    </>
  )
}

DailyGame.propTypes = {
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
  backUrl: PropTypes.string.isRequired,
}

export default DailyGame

export {
  Cell
}
