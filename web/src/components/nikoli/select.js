import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import NIKOLI_PUZZLES from '../../data/nikoli-puzzles'
import { NikoliStorageContext } from './storage'
import { useCurrentTheme } from '../../hooks/use-theme'
import { ArrowRight, ArrowLeft } from '../icons'
import SiemaCarousel from '../siema'

const Slider = styled.div`
  justify-self: center;

  box-sizing: content-box;
  max-width: ${props => props.theme.nikoliSelectionCols * props.theme.nikoliSelectionCellWidth + (props.theme.nikoliSelectionCols - 1) * props.theme.nikoliSelectionCellGap + props.theme.nikoliSelectionSliderGap}px;

  display: grid;
  grid-template-rows: auto ${props => props.theme.nikoliSelectionCellWidth}px;
`

const PuzzleGrid = styled.div`
  display: grid;
  justify-content: center;
  gap: ${props => props.theme.nikoliSelectionCellGap}px;
  grid-template-columns: repeat(${ props => props.theme.nikoliSelectionCols}, ${props => props.theme.nikoliSelectionCellWidth}px);
  grid-template-rows: min-content repeat(${ props => props.theme.nikoliSelectionRows}, ${props => props.theme.nikoliSelectionCellWidth}px);

  h2 {
    grid-column: 1 / ${props => props.theme.nikoliSelectionCols + 1};
    justify-self: start;
    margin: 0;
  }

  padding: 0 ${props => props.theme.nikoliSelectionSliderGap / 2}px;
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
  justify-self: center;
  width: ${props => props.theme.nikoliSelectionCols * props.theme.nikoliSelectionCellWidth + (props.theme.nikoliSelectionCols - 1) * props.theme.nikoliSelectionCellGap}px;
  
  display: grid;
  gap: ${ props => props.theme.nikoliSelectionCellGap}px;
  grid-template-columns: ${ props => props.theme.nikoliSelectionCellWidth}px 1fr ${props => props.theme.nikoliSelectionCellWidth}px;
  align-items: center;
`

const control = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
}

const Control = styled(motion.button)`
  /* button reset */
  border: 0;
  outline-width: 0;
  background: transparent;
  color: inherit;
  margin: 0;
  padding: 0;

  /* base styles */
  font-variant: all-small-caps;
  text-decoration: none;

  width: ${ props => props.theme.nikoliSelectionCellWidth}px;
  height: ${ props => props.theme.nikoliSelectionCellWidth}px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${ props => props.disabled ? `pointer-events: none;` : `cursor: pointer;`}
  color: ${ props => props.disabled ? props.theme.disabledColor : props.theme.textColor};
`

const Separator = styled.div`
  height: 0;
  border-top: 1px solid ${ props => props.theme.textColor};
`

function SelectNikoliPuzzle(props) {
  const {
    nikoliSelectionRows: rows,
    nikoliSelectionCols: cols,
  } = useCurrentTheme()
  const slides = Math.ceil(NIKOLI_PUZZLES.length / (rows * cols))
  const { isSolved } = useContext(NikoliStorageContext)
  const [siema, setSiema] = useState(null)
  const [slide, setSlide] = useState(0)

  return (
    <Slider>
      <SiemaCarousel
        options={{
          duration: 250,
          easing: 'ease',
          onInit: function () { setSlide(this.currentSlide) },
          onChange: function () { setSlide(this.currentSlide) }
        }}
        setSiema={(siema) => setSiema(siema)}
      >
        {[...new Array(slides)].map((e, slide) => (
          <PuzzleGrid key={slide} >
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
      </SiemaCarousel>
      <Controls>
        <Control
          variants={control}
          whileHover="hover"
          whileTap="tap"
          disabled={slide <= 0}
          onClick={() => siema && siema.prev()}
        >
          <ArrowLeft />
        </Control>
        <Separator />
        <Control
          variants={control}
          whileHover="hover"
          whileTap="tap"
          disabled={slide >= slides - 1}
          onClick={() => siema && siema.next()}
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
