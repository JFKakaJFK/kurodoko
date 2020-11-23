// TODO move validation to puzzle types 
// import PUZZLE_TYPES from "./puzzle-types"

const UNDEFINED = '.'
const BLACK = 'B'
const WHITE = 'W'

const isUndef = (cellValue) => cellValue === UNDEFINED
const isBlack = (cellValue) => cellValue === BLACK
const isNumber = (cellValue) => !isNaN(cellValue)
const isWhite = (cellValue) => cellValue === WHITE || isNumber(cellValue)

const getNumber = (cellValue) => isNumber(cellValue) ? parseInt(cellValue) : null
const getColor = (cellValue) => isNumber(cellValue) ? WHITE : cellValue

const TOP = [-1, 0]
const RIGHT = [0, 1]
const BOTTOM = [1, 0]
const LEFT = [0, -1]
const DIRECTIONS = [TOP, RIGHT, BOTTOM, LEFT]

const puzzleToGrid = (puzzle) => puzzle.map(row => row.split(' '))

// a grid where lock_map[row][col] is true iff the given cell is an uneditable hint
const puzzleToLockMap = (puzzle) => puzzle
  .map(row => row.split(' ')
    .map(hint => hint === '.' ? false : true)
  )

const gridToPuzzle = (grid) => grid.map(row => row.join(' '))

const mergePuzzleGrids = (p1, p2) => p1.map((row, i) =>
  row.map((cell, j) => isUndef(cell) ? p2[i][j] : cell)
)

const ALLOWED = '.WB0123456789'

const validatePuzzleData = ({ type, rows, cols, puzzle }) => {
  if (!type || /* TODO !Object.keys(PUZZLE_TYPES)*/ !['KURODOKO', 'OHNO'].includes(type))
    return [false, `The type of the puzzle is invalid or was not specified.\n(Found: '${type.toString()}', Allowed: ${/* TODO Object.keys(PUZZLE_TYPES)*/['KURODOKO', 'OHNO'].toString()})`]
  if (!rows || isNaN(parseInt(rows)))
    return [false, `The number of rows of the puzzle is invalid or was not specified.\n(Found: '${rows.toString()}', Allowed: Positive Integer)`]
  if (!cols || isNaN(parseInt(cols)))
    return [false, `The number of columns of the puzzle is invalid or was not specified.\n(Found: '${cols.toString()}', Allowed: Positive Integer)`]
  if (!Array.isArray(puzzle))
    return [false, `The puzzle must be an Array.\n(Found: '${(typeof puzzle).toString()}', Allowed: Array)`]
  if (!rows === puzzle.length)
    return [false, `The number of rows specified does not match with the number of rows of the puzzle.\n(Found: '${puzzle.length.toString()}', Expected: '${rows.toString()}')`]
  const grid = puzzleToGrid(puzzle)
  if (!grid.every(row => row.length === cols))
    return [false, `The number of columns specified does not match with the number of all columns of the puzzle.\n(Found: '${grid.find(r => r.length !== cols).length.toString()}', Expected: '${cols.toString()}')`]
  if (!grid.every(row => row.every(cell => cell.split('').every(c => ALLOWED.includes(c)) && (isNumber(cell) ? getNumber(cell) > 0 : true))))
    return [false, `The puzzle cells have invalid values.\n(Allowed: ['.' (empty), 'W' (white) , 'B' (black), positive integer (hint)])`]
  return [true, null]
}

const validatePuzzle = (type, rows, cols, grid) => {
  return validatePuzzleData({
    type: type,
    rows: rows,
    cols: cols,
    puzzle: gridToPuzzle(grid)
  })
}

// TODO typescript and make sure that [bool, str] is returned
const validateData = (data) => {
  let [valid, msg] = validatePuzzleData(data)
  if (!valid) return [valid, msg]

  if (data.hasOwnProperty('elapsedTime') && isNaN(parseInt(data.elapsedTime)) && parseInt(data.elapsedTime) >= 0)
    return [false, `The elapsed time is invalid`]

  if (data.hasOwnProperty('grid')) {
    if (!Array.isArray(data.grid)) {
      return [false, `The current grid state must be a valid puzzle.`]
    } else {
      [valid, msg] = validatePuzzle(data.type, data.rows, data.cols, data.grid)
      if (!valid) return [valid, msg]
    }
  }

  if (data.hasOwnProperty('history') || data.hasOwnProperty('historyIndex')) {
    if (!(data.hasOwnProperty('history') && data.hasOwnProperty('historyIndex')))
      return [false, `If either the history or the game history index are specified, both are needed.`]
    if (!Array.isArray(data.history))
      return [false, `The game history must be an array.`]

    if (isNaN(parseInt(data.historyIndex)) || data.historyIndex >= data.history.length || data.historyIndex < 0) {
      return [false, `The game history index is invalid.`]
    }

    for (let p of data.history) {
      if (!Array.isArray(p)) return [false, `Each history entry must be a puzzle state.`]

      [valid, msg] = validatePuzzle(data.type, data.rows, data.cols, p)
      if (!valid) return [valid, msg]
    }
  }

  if (data.hasOwnProperty('decision') && data.decision) {
    if (!(data.hasOwnProperty('decisionGridBackup') && data.decisionGridBackup && Array.isArray(data.decisionGridBackup))) return [false, `The current grid backup state must be a valid puzzle.`]

    [valid, msg] = validatePuzzle(data.type, data.rows, data.cols, data.decisionGridBackup)
    if (!valid) return [valid, msg]

    if ((data.hasOwnProperty('decisionHistoryBackup') && data.decisionHistoryBackup) || (data.hasOwnProperty('decisionHistoryIndexBackup' && data.decisionHistoryIndexBackup))) {
      if (!(data.hasOwnProperty('decisionHistoryBackup') && data.decisionHistoryBackup && data.hasOwnProperty('decisionHistoryIndexBackup') && data.decisionHistoryIndexBackup))
        return [false, `If either the history backup or the game history index backup are specified, both are needed.`]
      if (!Array.isArray(data.decisionHistoryBackup)) {
        return [false, `The game history backup must be an array.`]
      } else {
        if (isNaN(parseInt(data.decisionHistoryIndexBackup)) || data.decisionHistoryIndexBackup >= data.decisionHistoryBackup.length || data.decisionHistoryIndexBackup < 0) {
          return [false, `The game history index backup is invalid.`]
        }
        for (let p of data.decisionHistoryBackup) {
          if (!Array.isArray(p)) return [false, `Each history backup entry must be a puzzle state.`]

          [valid, msg] = validatePuzzle(data.type, data.rows, data.cols, p)
          if (!valid) return [valid, msg]
        }
      }
    }
  }

  return [true, ``]
}

export {
  UNDEFINED,
  BLACK,
  WHITE,
  isUndef,
  isBlack,
  isWhite,
  isNumber,
  getNumber,
  getColor,
  puzzleToGrid,
  gridToPuzzle,
  mergePuzzleGrids,
  puzzleToLockMap,
  validatePuzzleData,
  validateData,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  DIRECTIONS
}
