import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import debounce from '../../util/debounce'
import PUZZLE_TYPES from '../../util/puzzle-types'

const calcCellWidth = (width, cols, theme, type) => Math.min(Math.max(((width - ((cols + 1) * theme[type].gridGap)) / cols), theme[type].minCellWidth), theme[type].maxCellWidth)

const calcGridHeight = (width, rows, cols, theme, type) => calcCellWidth(width, cols, theme, type) * rows + theme[type].gridGap * (rows + 1)

const GridStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  background: transparent;
  
  > div {
    border: ${props => props.theme[props.type].gridGap}px solid ${props => props.theme[props.type].gridBorderColor};
    background: ${props => props.theme[props.type].gridLineColor};
    justify-content: center;
    align-content: center;
    ${props => props.width &&
    `height: ${calcGridHeight(props.width, props.rows, props.cols, props.theme, props.type)}px;`}
    
    display: grid;
    grid-template-rows: ${({ rows, theme, type }) => `repeat(${rows}, minmax(${theme[type].minCellWidth}px, ${theme[type].maxCellWidth}px))`};
    grid-template-columns: ${({ cols, theme, type }) => `repeat(${cols}, minmax(${theme[type].minCellWidth}px, ${theme[type].maxCellWidth}px))`};
    gap: ${props => props.theme[props.type].gridGap}px;
    font-size: calc(${props => calcCellWidth(props.width || '16', props.cols, props.theme, props.type)}px / 2); /* * (2 / 3) */
  }
  `

function Grid(props) {
  const gridRef = useRef(null)
  const [width, setWidth] = useState(null)

  const effect = typeof window === `undefined` ? useEffect : useLayoutEffect
  effect(() => {
    // event listener
    const handleResize = debounce(() => {
      if (!gridRef || !gridRef.current) return
      setWidth(gridRef.current.getBoundingClientRect().width)
    }, 20)
    // init & add listener
    handleResize()
    window.addEventListener('resize', handleResize)
    // remove listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [gridRef])

  return (
    <GridStyles rows={props.rows} cols={props.cols} width={width} type={props.type}>
      <div ref={gridRef}>
        {props.children}
      </div>
    </GridStyles>
  )
}

Grid.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(Object.keys(PUZZLE_TYPES)).isRequired,
}

export default Grid