import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import PUZZLE_TYPES from '../util/puzzle-types'

const LoadingStyles = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`

const LoaderWrapper = styled(motion.div)`
  > div {
    width: 2.5rem;
    height: 2.5rem;
  }
`

const Cell = styled(motion.div)`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${props => props.theme[props.type].cellRadius};
  background: ${props => props.theme.activeColor};
`

// TODO https://codesandbox.io/s/framer-motion-keyframes-ekks8?fontsize=14&module=%2Fsrc%2FExample.tsx
const loaderVariants = {
  initial: {
  },
  animate: {
  }
}

const cellVariants = {
  initial: {
    scale: 0.95,
  },
  animate: {
    scale: 1.05,
  }
}

const cellTransition = {
  type: 'spring',
  damping: 0,
  stiffness: 25,
  // duration: 0.5,
  // yoyo: Infinity,
  // ease: 'easeInOutQuad'
}

const Loader = (props) => (
  <LoadingStyles>
    <LoaderWrapper
      variants={loaderVariants}
      initial={'initial'}
      animate={'animate'}
    >
      <Cell
        variants={cellVariants}
        initial={'initial'}
        animate={'animate'}
        transition={cellTransition}
        type={props.type}
      />
    </LoaderWrapper>
    <h2>Loading ...</h2>
  </LoadingStyles>
)

Loader.propTypes = {
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired
}

export default Loader