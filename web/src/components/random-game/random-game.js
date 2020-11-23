import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks';

import Game from '../game'
import Loader from '../loader';
import ErrorMessage from '../error';

const RANDOM_GAME_QUERY = gql`
  query RANDOM_GAME_QUERY($rows: Int!, $cols: Int!, $type: PuzzleType!, $difficulty: Difficulty, $seed: String) {
    generate(rows: $rows, cols: $cols, type: $type, difficulty: $difficulty, seed: $seed) {
      type
      difficulty
      rows
      cols
      puzzle
      solution
      seed
    }
  }
`

function RandomGame(props) {
  const { rows, cols, type, difficulty, seed, onSolve } = props

  const { loading, data, error } = useQuery(
    RANDOM_GAME_QUERY,
    {
      variables: { rows, cols, type, difficulty, seed },
      // we don't want to return a cached puzzle, we want a freshly generated one
      fetchPolicy: 'network-only'
    }
  )

  if (loading) return (
    <div>
      <Loader type={type} />
    </div>
  )

  if (error || !data || !data.generate) return <ErrorMessage error={error} />


  // TODO add type,rows, cols, difficulty, seed to url as hash

  return (
    <div>
      <Game {...data.generate} onSolve={onSolve} />
    </div>
  )
}

RandomGame.propTypes = {
  type: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  difficulty: PropTypes.string.isRequired,
  seed: PropTypes.string,
  onSolve: PropTypes.func,
}

export default RandomGame
