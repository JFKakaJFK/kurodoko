import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DIFFICULTIES, { EASY, MEDIUM, HARD } from '../util/difficulties'
import Button from '../styles/button'

// rows, cols, difficulty
const defaultOptions = [null, null, null]

const getDifficulty = (ncells) => {
  if (ncells < 42) {
    return EASY
  } else if (ncells < 80) {
    return MEDIUM
  } else {
    return HARD
  }
}

function PuzzleOptionInput(props) {
  const [custom, setCustom] = useState(false)
  const [[rows, cols, difficulty], setOptions] = useState([5, 5, EASY])

  return (
    <div>
      <h2>Select Puzzle</h2>
      {custom ? (
        <form onSubmit={() => props.selectOptions([!rows ? 5 : parseInt(rows), !cols ? 5 : parseInt(cols), difficulty])}>
          <label htmlFor="#rows">
            Rows:
              <input
              id="rows"
              type="number"
              value={rows}
              step="1"
              min="5"
              max="20"
              onChange={(e) => setOptions([e.target.value, cols, difficulty])}
              required
            />
          </label><br />
          <label htmlFor="#cols">
            Cols:
              <input
              id="cols"
              type="number"
              value={cols}
              step="1"
              min="5"
              max="20"
              onChange={(e) => setOptions([rows, e.target.value, difficulty])}
              required
            />
          </label><br />
          <label htmlFor="difficulty">
            Difficulty:
            <select
              id="difficulty"
              value={difficulty}
              onBlur={(e) => setOptions([rows, cols, e.target.value])}
              onChange={(e) => setOptions([rows, cols, e.target.value])}
              required
            >
              {DIFFICULTIES.map(diff => (<option key={diff}>{diff}</option>))}
            </select>
          </label><br />
          <button type="submit">Select</button>
        </form>
      ) : (
          <div>
            {props.sizes.map(({ rows: r, cols: c, solved }, i) => (
              <div
                key={i}
                onClick={() => props.selectOptions([r, c, getDifficulty(r * c)])}
                solved={solved}
              >
                {r}x{c}({solved.toString()})
              </div>
            ))}
          </div>
        )}
      <Button onClick={() => setCustom(!custom)}>{custom ? 'Back' : 'Custom Puzzle'}</Button>
    </div>
  )
}

PuzzleOptionInput.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.shape({
    rows: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired
  })).isRequired,
  selectOptions: PropTypes.func.isRequired,
}

export default PuzzleOptionInput

export {
  defaultOptions
}