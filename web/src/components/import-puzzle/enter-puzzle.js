import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useEffect } from 'react'
import Grid, { GridCell } from '../../styles/grid'
import PUZZLE_TYPES, { KURODOKO } from '../../util/puzzle-types'
import { gridToPuzzle, isUndef, isWhite, WHITE, BLACK, UNDEFINED } from '../../util/puzzle-representation'
import Button, { ButtonRow } from '../../styles/button'
import { Check } from '../icons'
import UploadPuzzle from './upload'

const Wrapper = styled.div`
  display: grid;
  gap: .5rem;

  h2 {
    margin: 0;
  }
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-variant: all-small-caps tabular-nums;
  height: 3rem;
  padding: 0 1rem;
  border: 1px solid ${props => props.theme.textColor};
`

const NumInput = styled.input`
  color: ${props => props.theme.textColor};
  background: ${props => props.theme.backgroundColor};
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 1px solid ${props => props.theme.textColor};
  text-align: center;
  outline-width: 0;

  /* Remove spinners */
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;
`

function SizeInput({ setSize, size }) {

  return (
    <InputWrapper>
      <NumInput
        type="number"
        min="1"
        step="1"
        max="30"
        value={size.rows || ''}
        onChange={({ target }) => target.validity.valid && !isNaN(parseInt(target.value)) && setSize({ rows: target.value, cols: size.cols })}
      />
      x
      <NumInput
        type="number"
        min="1"
        step="1"
        max="30"
        value={size.cols || ''}
        onChange={({ target }) => target.validity.valid && !isNaN(parseInt(target.value)) && setSize({ rows: size.rows, cols: target.value })}
      />
    </InputWrapper>
  )
}

SizeInput.propTypes = {
  setSize: PropTypes.func.isRequired,
  size: PropTypes.shape({
    rows: PropTypes.string,
    cols: PropTypes.string
  })
}

const Select = styled.select`
  height: 3rem;
  padding: 0 1rem;
  line-height: 1;
  font-size: 0.75rem;
  text-align: center;
  /* // TODO safari support (custom select or maybe using a label...) */
  text-align-last: center;
  outline-width: 0;
  font-variant: all-small-caps;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  background: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  border: 1px solid ${props => props.theme.textColor};
  transition: all 300ms ease;

  &:hover {
    background: ${props => props.theme.actionHoverBackground};
    color: ${props => props.theme.actionHoverColor};
    border-color: ${props => props.theme.actionHoverBackground};
  }
  /* Hide arrows */
  /* for Firefox */
  -moz-appearance: none;
  /* for Chrome */
  -webkit-appearance: none;
`

const Center = styled.div`
  text-align: center;
  font-variant: all-small-caps;
  margin: 0.83em;
`

function TypeInput({ setType, type }) {

  return (
    <ButtonRow>
      <Select value={type} onChange={(e) => setType(e.target.value)}>
        {Object.entries(PUZZLE_TYPES).map(([t, { name }]) => (
          <option key={t} value={t}>{name}</option>
        ))}
      </Select>
    </ButtonRow>
  )
}

TypeInput.propTypes = {
  setType: PropTypes.func.isRequired,
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired
}

function EnterPuzzle(props) {
  const [type, setType] = useState(KURODOKO)
  const [{ rows, cols }, setSize] = useState({})
  const [grid, setGrid] = useState(null)
  const [editable, setEditable] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editable && editable.node) editable.node.focus()
  }, [editable, grid])

  const isEditable = (row, col) => editable && editable.row === row && editable.col === col

  if (!grid) return (
    <div>
      <div>
        <h2>Select Type</h2>
        <TypeInput setType={setType} type={type} />
        <h2>Select Size</h2>
        <SizeInput setSize={setSize} size={{ rows, cols }} />
        <h2>{error ? error : ' '}</h2>
        <ButtonRow>
          <Button primary onClick={() => {
            if (!type) return setError(`The puzzle type is invalid.`)
            if (isNaN(parseInt(rows))) return setError(`The number of rows is invalid.`)
            if (isNaN(parseInt(cols))) return setError(`The number of cols is invalid.`)
            setGrid([...new Array(parseInt(rows))].map((e) => [...new Array(parseInt(cols))].map((e) => '.')))
          }}>
            <Check />
          </Button>
        </ButtonRow>
      </div>
      <Center>or</Center>
      <UploadPuzzle setData={props.setData} />
    </div>
  )

  const updateCell = (e, row, col) => {

    if (isUndef(grid[row][col]) && !isEditable(row, col))
      return setEditable({ row, col, node: e.target })

    const newGrid = [...grid]
    // undef -> white -> black -> undef -> ...
    newGrid[row][col] = isUndef(newGrid[row][col])
      ? WHITE
      : isWhite(newGrid[row][col])
        ? BLACK
        : UNDEFINED

    setGrid(newGrid)
    if (isEditable(row, col)) setEditable(null)
  }

  const handleNumberInput = (e, row, col) => {
    const target = e.target
    const num = parseInt(target.innerText)
    if (!isNaN(num)) {
      if (num >= 1 && num <= parseInt(rows) + parseInt(cols) - (type === KURODOKO ? 1 : 2)) {
        const newGrid = [...grid]
        newGrid[row][col] = target.innerText
        return setGrid(newGrid)
      }
    }
    target.innerText = ''
  }

  return (
    <Wrapper>
      <h2>Tap once to enter a number (between 1 and {parseInt(rows) + parseInt(cols) - (type === KURODOKO ? 1 : 2)}), twice for white and three times to make the cell black.</h2>
      <Grid rows={parseInt(rows)} cols={parseInt(cols)} type={type}>
        {grid.map(
          (row, i) => row.map(
            (cell, j) => <GridCell
              contentEditable={isEditable(i, j)}
              key={i * parseInt(cols) + j}
              type={type}
              val={cell}
              onClick={(e) => updateCell(e, i, j)}
              onInput={(e) => handleNumberInput(e, i, j)}
              onBlur={(e) => handleNumberInput(e, i, j)}
            />
          )
        )}
      </Grid>
      <ButtonRow>
        <Button primary onClick={() => props.setData({
          type,
          rows: parseInt(rows),
          cols: parseInt(cols),
          puzzle: gridToPuzzle(grid)
        })}>
          <Check />
        </Button>
      </ButtonRow>
    </Wrapper>
  )
}

EnterPuzzle.propTypes = {
  setData: PropTypes.func.isRequired
}

export default EnterPuzzle