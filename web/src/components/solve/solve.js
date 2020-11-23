import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/react-hooks';

import Loader from '../loader';
import { GameInfo } from '../game/game';
import Grid, { GridCell } from '../../styles/grid';
import { puzzleToGrid, mergePuzzleGrids } from '../../util/puzzle-representation';
import ErrorMessage from '../error';
import PUZZLE_TYPES from '../../util/puzzle-types';

const SOLVE_PUZZLE_QUERY = gql`
  query SOLVE_PUZZLE_QUERY($rows: Int!, $cols: Int!, $type: PuzzleType!, $puzzle: [String!]!) {
    solve(rows: $rows, cols: $cols, type: $type, puzzle: $puzzle) {
      satisfiable
      solution
    }
  }
`

// component displaying solution + stats (e.g. solving time, uniqueness & estimated difficulty)
function Solve(props) {
  const { rows, cols, type, difficulty, id, puzzle } = props
  const [{ satisfiable, solution }, setSolution] = useState({})

  const [fetchSolution, { loading, error, data }] = useLazyQuery(
    SOLVE_PUZZLE_QUERY,
    { variables: { rows, cols, type, puzzle }, },
  );

  useEffect(() => {
    if (props.solution && PUZZLE_TYPES[props.type].validateSolution({
      ...props,
      puzzle: puzzleToGrid(props.puzzle),
      solution: puzzleToGrid(props.solution)
    })) return setSolution({
      satisfiable: true,
      solution: props.solution
    })
    // if no solution available, fetch via network
    fetchSolution()
  }, [])

  useEffect(() => {
    if (!data || !data.solve) return

    setSolution(data.solve)
  }, [data])

  if (error) return <ErrorMessage error={error} />

  if (satisfiable === false) return <ErrorMessage
    title={`Invalid puzzle :(`}
    error={{ message: `Seems like this puzzle has no solution.` }}
  />

  console.warn(solution)

  if (loading || !solution) return (
    <div>
      <Loader type={type} />
    </div>
  )

  console.warn(solution)

  // TODO stats & stuff (needs api update)
  return (
    <div>
      <GameInfo>
        <span>{difficulty ? difficulty : ''}</span>
        <span>{id ? id : ''}</span>
        <span>{rows}x{cols}</span>
      </GameInfo>
      <Grid rows={rows} cols={cols} type={type}>
        {mergePuzzleGrids(puzzleToGrid(puzzle), puzzleToGrid(solution)).map(
          (row, i) => row.map(
            (cell, j) => <GridCell
              key={i * rows + j}
              type={type}
              val={cell}
              isLocked
            />
          )
        )}
      </Grid>
    </div>
  )
}

Solve.propTypes = {
  type: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  puzzle: PropTypes.arrayOf(PropTypes.string).isRequired,
  // optional solution
  solution: PropTypes.arrayOf(PropTypes.string),
  // optional just for displaying more info
  difficulty: PropTypes.string,
  id: PropTypes.string,
}

export default Solve

export {
  SOLVE_PUZZLE_QUERY
}
