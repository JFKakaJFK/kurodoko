import { isNumber, isBlack, DIRECTIONS, getNumber } from '../util/puzzle-representation'

function dfs(grid, rows, cols, [row, col], visited) {
  visited[row][col] = true
  DIRECTIONS.forEach(([x, y]) => {
    let [r, c] = [row + x, col + y]
    if (r >= 0 && r < rows && c >= 0 && c < cols && !isBlack(grid[r][c]) && !visited[r][c])
      dfs(grid, rows, cols, [r, c], visited)
  })
}

function validate({ grid, rows, cols }) {
  let nWhites = 0
  let firstWhite = null
  // loop over all cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // collect number of white cells
      if (!isBlack(grid[row][col])) {
        if (!firstWhite) firstWhite = [row, col]
        nWhites++

        // check if the number constraints are satisfied
        if (isNumber(grid[row][col])) {
          const number = getNumber(grid[row][col])

          if (number < 1 || number > rows + cols - 1)
            return [false, [[row, col]], `The number constraint of this hint cannot be fulfilled, this puzzle is unsolvable`]

          let visible = DIRECTIONS.reduce((acc, [x, y]) => {
            let seen = 0
            let [r, c] = [row + x, col + y]
            while (r >= 0 && r < rows && c >= 0 && c < cols && !isBlack(grid[r][c]) && acc + seen < number) {
              seen++
              [r, c] = [row + (x * (seen + 1)), col + (y * (seen + 1))]
            }
            return acc + seen
          }, 0)

          if (visible + 1 !== number)
            return [false, [[row, col]], `This cell sees too ${visible + 1 > number ? 'many' : 'few'} other white cells.`]
        }
      } else if (isBlack(grid[row][col])) {
        // check if two black cells are adjacent
        if (row + 1 < rows && isBlack(grid[row + 1][col]))
          return [false, [[row, col], [row + 1, col]], `Black cells cannot be adjacent to each other.`]
        if (col + 1 < cols && isBlack(grid[row][col + 1]))
          return [false, [[row, col], [row, col + 1]], `Black cells cannot be adjacent to each other.`]
      }
    }
  }

  // check if all white cells are connected
  const visited = [...Array(rows)].map(e => Array(cols).fill(false))
  dfs(grid, rows, cols, firstWhite, visited)
  if (nWhites !== visited.reduce((acc, row) => acc + row.reduce((a, c) => a + (c ? 1 : 0), 0), 0))
    return [false, [], `All white cells need to be connected.`]

  return [true, [], ``]
}

export default validate