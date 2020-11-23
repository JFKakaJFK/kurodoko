import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import PUZZLE_TYPES from '../util/puzzle-types'
import Tutorial from './tutorial/tutorial'
import Button, { ButtonRow } from '../styles/button'

const RuleStyles = styled.section`
  /* margin-top: -${props => props.theme.headerPadding}; */

  ol {
    list-style-type: none;
    padding-left: 0;
    margin: 0;

    li p {
      margin: 1.83em 0;
    }

    li:first-child p {
      margin-top: 0;
    }
    li:last-child p{
      margin-bottom: 0;
    }

    padding-bottom: 1rem;
  }

  .hl {
    color: ${props => props.theme.activeColor};
  }
`

function Rules(props) {
  const [tutorial, setTutorial] = useState(false)

  return tutorial ? <Tutorial type={props.type} back={() => setTutorial(false)} linkToMain={props.linkToMainAfterTutorial} /> : (
    <RuleStyles>
      <h1>Rules</h1>
      <ol>
        {PUZZLE_TYPES[props.type].rules.map((Rule, i) => <li key={i}>
          <Rule />
        </li>)}
      </ol>
      <ButtonRow>
        <Button primary onClick={() => setTutorial(true)}>Tutorial</Button>
      </ButtonRow>
    </RuleStyles>
  )
}

Rules.propTypes = {
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
  linkToMainAfterTutorial: PropTypes.bool
}

export default Rules