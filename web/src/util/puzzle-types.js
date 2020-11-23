import React from 'react'
import validateKurodoko from '../lib/validate-kurodoko'
import validateOhno from '../lib/validate-ohno'
import { EASY, MEDIUM, HARD } from './difficulties'
import { isUndef, isNumber, isWhite } from './puzzle-representation'
import kurodokoTutorial from './kurodoko-tutorial'
import ohnoTutorial from './ohno-tutorial'

const isValidSolution = ({ puzzle, solution, rows, cols }, validator) => {
  let valid = true
  const merged = puzzle.map((row, i) =>
    row.map((cell, j) => {
      // check if conflict
      const solvedCell = solution[i][j]
      if ((isNumber(cell) && !isWhite(solvedCell))
        || (!isNumber(cell) && !isUndef(cell) && cell !== solvedCell)) { valid = false }
      // if no conflict return the solution iff undef else puzzle
      return isUndef(cell) ? solvedCell : cell
    }))
  return valid && validator({ puzzle: merged, rows, cols })
}

const PUZZLE_TYPES = {
  KURODOKO: {
    name: 'Kurodoko',
    rules: [
      () => <p>A cell can see the other cells in the same row or column. Black cells block the view of white cells.</p>,
      () => <p>The number in a cell tells how many white cells are seen by this cell (<span className="hl">including</span> the cell itself).</p>,
      () => <p>Black cells cannot be neighbours.</p>,
      () => <p>All white cells must be orthogonally connected.</p>
    ],
    tutorial: kurodokoTutorial,
    sizes: [
      { rows: 5, cols: 5, difficulty: EASY },
      { rows: 7, cols: 7, difficulty: MEDIUM },
      { rows: 9, cols: 9, difficulty: MEDIUM },
      { rows: 11, cols: 11, difficulty: MEDIUM },
      { rows: 13, cols: 13, difficulty: HARD },
      { rows: 15, cols: 13, difficulty: HARD }
    ],
    dailySizes: [
      { rows: 5, cols: 5, difficulty: EASY },
      { rows: 7, cols: 7, difficulty: MEDIUM },
      { rows: 9, cols: 9, difficulty: MEDIUM },
      { rows: 11, cols: 11, difficulty: MEDIUM },
      { rows: 13, cols: 13, difficulty: HARD },
      { rows: 15, cols: 13, difficulty: HARD }
    ],
    validate: validateKurodoko,
    validateSolution: (data) => isValidSolution(data, validateKurodoko),
  },
  OHNO: {
    name: 'Oh No',
    rules: [
      () => <p>White cells can see other white cells in their own row and column.</p>,
      () => <p>Every white cell can see at least one other white cell.</p>,
      () => <p>The number in a cell thells how many other cells are seen by this cell (<span className="hl">excluding</span> the cell itself).</p>,
      () => <p>Black cells block the view.</p>
    ],
    tutorial: ohnoTutorial,
    sizes: [
      { rows: 4, cols: 4, difficulty: EASY },
      { rows: 5, cols: 5, difficulty: EASY },
      { rows: 7, cols: 7, difficulty: MEDIUM },
      { rows: 9, cols: 9, difficulty: MEDIUM },
      { rows: 12, cols: 9, difficulty: HARD },
      { rows: 12, cols: 12, difficulty: HARD }
    ],
    dailySizes: [
      { rows: 4, cols: 4, difficulty: EASY },
      { rows: 5, cols: 5, difficulty: EASY },
      { rows: 7, cols: 7, difficulty: MEDIUM },
      { rows: 9, cols: 9, difficulty: MEDIUM },
      { rows: 12, cols: 9, difficulty: HARD },
      { rows: 12, cols: 12, difficulty: HARD }
    ],
    validate: validateOhno,
    validateSolution: (data) => isValidSolution(data, validateOhno),
  }
}

const KURODOKO = 'KURODOKO'
const OHNO = 'OHNO'

export default PUZZLE_TYPES

export {
  KURODOKO,
  OHNO
}
