import { isUndef, isNumber, isWhite, DIRECTIONS, getNumber } from '../util/puzzle-representation'

function validate({ grid, rows, cols, hints = false }) {
  let hasUndef = false
  // loop over all cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!hasUndef && isUndef(grid[row][col])) {
        if (!hints)
          return [false, [], ``]
        hasUndef = true
      }

      // check if the number constraints are satisfied
      if (isNumber(grid[row][col])) {
        const number = getNumber(grid[row][col])

        if (number < 1 || number > rows + cols - 2)
          return [false, [[row, col]], `The number constraint of this hint cannot be fulfilled, this puzzle is unsolvable`]

        let visible = DIRECTIONS.reduce((acc, [x, y]) => {
          let seen = 0
          let [r, c] = [row + x, col + y]
          while (r >= 0 && r < rows && c >= 0 && c < cols && isWhite(grid[r][c]) && acc + seen <= number) {
            seen++
            [r, c] = [row + (x * (seen + 1)), col + (y * (seen + 1))]
          }
          return acc + seen
        }, 0)

        if (visible !== number)
          return [false, [[row, col]], `This cell sees too ${visible > number ? 'many' : 'few'} other white cells.`]
      }

      // check if every white cell has at least one white neighbour
      if (isWhite(grid[row][col]) && !DIRECTIONS.some(([x, y]) => {
        let [r, c] = [row + x, col + y]
        return r >= 0 && r < rows && c >= 0 && c < cols && isWhite(grid[r][c])
      }))
        return [false, [[row, col]], `A white cell needs to see at least one other white cell.`]
    }
  }

  return [!hasUndef, [], [`All cells need to be either be black or white.`]]
}

export default validate