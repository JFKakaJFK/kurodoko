import React, { useEffect, useContext, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { motion, useAnimation } from 'framer-motion'
import { NikoliStorageContext } from './storage'
import { useCurrentTheme } from '../../hooks/use-theme'
import { ArrowRight, ArrowLeft } from '../icons'
import debounce from '../../util/debounce'

import JANKO_PUZZLES from '../../data/janko.json'

const NIKOLI_PUZZLES = JANKO_PUZZLES.filter(p => p.rows < 20 && p.cols < 20).sort((a, b) => a.id === b.id ? 0 : parseInt(a.id) < parseInt(b.id) ? -1 : 1)

// TODO depreacted & remove or fix

const Slider = styled.div`
  width: 280px;
  justify-self: center;
  /* margin-top: calc(2*${props => props.theme.headerPadding}); */
  padding-top: 2rem;

  display: grid;
  grid-template-columns: ${props => props.theme.nikoliSelectionCols * props.theme.nikoliSelectionCellWidth + (props.theme.nikoliSelectionCols - 1) * props.theme.nikoliSelectionCellGap}px;
  grid-template-rows: auto ${props => props.theme.nikoliSelectionCellWidth}px;

  overflow: hidden;

  position: relative;

  padding-left: 1rem;
  padding-right: 1rem;
  &:after {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    box-shadow:
      inset .5rem 0 .75rem -.5rem ${props => props.theme.backgroundColor},
      inset -.5rem 0 .75rem .5rem ${props => props.theme.backgroundColor}
    ;
  }
`

const Track = styled(motion.div)`
  width: min-content;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  gap: ${props => props.theme.nikoliSelectionSliderGap}px;
  -webkit-user-drag: none;
`

const PuzzleGrid = styled.div`
  display: grid;
  justify-content: center;
  gap: ${props => props.theme.nikoliSelectionCellGap}px;
  grid-template-columns: repeat(${ props => props.cols}, ${props => props.theme.nikoliSelectionCellWidth}px);
  grid-template-rows: min-content repeat(${ props => props.rows}, ${props => props.theme.nikoliSelectionCellWidth}px);

  h2 {
    grid-column: 1 / ${props => props.cols + 1};
    justify-self: start;
    margin: 0;
  }
`

const Puzzle = styled.div`
  /* width: ${props => props.theme.nikoliSelectionCellWidth}px;
  height: ${props => props.theme.nikoliSelectionCellWidth}px; */
  display: flex;
  align-items: center;
  justify-content: center;
  font-variant: small-caps tabular-nums;
  line-height: 1;
  cursor: pointer;
  ${
  props => props.solved
    ? `color: ${props.theme.actionHoverColor}; border: 0; background: ${props.theme.actionHoverBackground};`
    : `border: 1px solid ${props.theme.textColor};`
  }
  transition: all .5s ease-out;
  &:hover {
    border: 0;
    color: ${props => props.theme.actionHoverColor};
    background: ${props => props.theme.actionHoverBackground};
  }
`

const Controls = styled.div`
  display: grid;
  gap: ${ props => props.theme.nikoliSelectionCellGap}px;
  grid-template-columns: ${ props => props.theme.nikoliSelectionCellWidth}px 1fr ${props => props.theme.nikoliSelectionCellWidth}px;
  align-items: center;
`

const control = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
}

const Control = styled(motion.div)`
  width: ${ props => props.theme.nikoliSelectionCellWidth}px;
  height: ${ props => props.theme.nikoliSelectionCellWidth}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  ${ props => props.disabled ? `pointer-events: none;` : `cursor: pointer;`}
  color: ${ props => props.disabled ? props.theme.disabledColor : props.theme.textColor};
`

const Separator = styled.div`
  flex: 1;
  height: 0;
  border-top: 1px solid ${ props => props.theme.textColor};
`

// TODO move to theme
const swipeThreshold = 10000


function SelectNikoliPuzzle(props) {
  const {
    nikoliSelectionCellWidth: cw,
    nikoliSelectionCellGap: cg,
    nikoliSelectionSliderGap: sg,
    nikoliSelectionRows: rows,
    nikoliSelectionCols: cols,
    nikoliSelectionSliderAnimationDuration: duration
  } = useCurrentTheme()
  const slides = Math.ceil(NIKOLI_PUZZLES.length / (rows * cols))
  const { isSolved } = useContext(NikoliStorageContext)
  const trackRef = useRef()
  // const { width: windowWidth } = useWindowDimensions()
  // const [{ x, width }, update] = useDimensions(trackRef)
  const trackControls = useAnimation()
  const [currentSlide, setPage] = useState(0)

  const to = (slide) => {
    if (slide < 0 || slide >= slides) return setPage(currentSlide)
    setPage(slide)
  }

  useEffect(() => {
    async function move() {
      await trackControls.start({
        x: -currentSlide * (cols * (cw + cg) - cg + sg),
        transition: {
          duration: duration,
          ease: 'easeInOut'
        }
      })
      // update()
    }
    move()
  }, [currentSlide])

  const onDragEnd = debounce(function (e, info) {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x
    console.log('swipe', offset.x, velocity.x, Math.abs(offset.x) * velocity.x, swipeThreshold)
    if (swipe > swipeThreshold) {
      to(currentSlide - 1)
    } else if (swipe < -swipeThreshold) {
      to(currentSlide + 1)
    } else {
      to(currentSlide)
    }
  }, 20)

  return (
    <Slider>
      <Track
        ref={trackRef}
        animate={trackControls}
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0
        }}
        dragElastic={0.75}
        onDragEnd={onDragEnd}
      >
        {[...new Array(slides)].map((e, slide) => (
          <PuzzleGrid
            key={slide}
            rows={rows}
            cols={cols}
          >
            <h2>Puzzles {slide * rows * cols + 1}-{Math.min((slide + 1) * rows * cols, NIKOLI_PUZZLES.length)}</h2>
            {NIKOLI_PUZZLES.slice(slide * rows * cols, Math.min(NIKOLI_PUZZLES.length, (slide + 1) * rows * cols)).map(puzzle => (
              <Puzzle
                key={puzzle.id}
                onClick={() => props.selectPuzzle(puzzle)}
                solved={isSolved(puzzle.id)}
              >
                {puzzle.id}
              </Puzzle>
            ))}
          </PuzzleGrid>
        ))}
      </Track>
      <Controls>
        <Control
          variants={control}
          whileHover="hover"
          whileTap="tap"
          disabled={currentSlide <= 0}
          onClick={() => to(currentSlide - 1)}
        >
          <ArrowLeft />
        </Control>
        <Separator />
        <Control
          variants={control}
          whileHover="hover"
          whileTap="tap"
          disabled={currentSlide + 1 >= slides}
          onClick={() => to(currentSlide + 1)}
        >
          <ArrowRight />
        </Control>
      </Controls>
    </Slider>
  )
}

SelectNikoliPuzzle.propTypes = {
  selectPuzzle: PropTypes.func.isRequired,
}

export default SelectNikoliPuzzle
