import React, { useState } from 'react'
import PropTypes from 'prop-types'

import PUZZLE_TYPES from '../../util/puzzle-types'
import RandomGame from './random-game'
import Footer, { FooterLink } from '../../styles/footer'
import Button from '../../styles/button'
import SizeInput from './size-input'

function Random(props) {
  const [{ rows, cols, difficulty }, selectOptions] = useState({})

  // TODO if present, get type,rows, cols, difficulty, seed from url hash

  if (!rows || !cols || !difficulty) return (
    <>
      <SizeInput
        sizes={PUZZLE_TYPES[props.type].sizes}
        selectOptions={selectOptions}
        type={props.type}
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
        seed={props.seed ? props.seed : new Date().valueOf().toString()}
        type={props.type}
      />
      <Footer>
        <Button onClick={() => selectOptions({})}>Back</Button>
      </Footer>
    </>
  )
}

Random.propTypes = {
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
  backUrl: PropTypes.string.isRequired,
  seed: PropTypes.string,
}

export default Random
