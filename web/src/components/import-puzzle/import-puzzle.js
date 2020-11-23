import React, { useState, useEffect, useContext } from 'react'

import Footer, { FooterLink } from '../../styles/footer'
import Game, { GameInfo } from '../game/game'
import Button, { ButtonRow } from '../../styles/button'
import { puzzleToGrid } from '../../util/puzzle-representation'
import { HeaderContext } from '../header'
import Grid, { GridCell } from '../../styles/grid'
import styled from 'styled-components'
import EnterPuzzle from './enter-puzzle'
import Solve from '../solve'

const ImportWrapper = styled.div`
  display: grid;
  gap: .5rem;
`

function ImportPuzzle(props) {
  const { setHeader } = useContext(HeaderContext)
  const [data, setData] = useState(null)
  const [play, setPlay] = useState(false)
  const [solve, setSolve] = useState(false)

  useEffect(() => {
    if (data)
      setHeader(data.type)
  }, [data])

  if (!data) return (
    <>
      <EnterPuzzle setData={setData} />
      <Footer>
        <FooterLink to={'/'}>Back</FooterLink>
      </Footer>
    </>
  )

  if (!play && !solve) return (
    <>
      <ImportWrapper>
        <GameInfo>
          <span>{data.difficulty ? data.difficulty : data.type}</span>
          <span>{data.id ? data.id : ''}</span>
          <span>{data.rows}x{data.cols}</span>
        </GameInfo>
        <Grid rows={data.rows} cols={data.cols} type={data.type}>
          {(data.grid ? data.grid : puzzleToGrid(data.puzzle)).map(
            (row, i) => row.map(
              (cell, j) => <GridCell
                key={i * data.rows + j}
                type={data.type}
                val={cell}
                isLocked
              />
            )
          )}
        </Grid>
        <ButtonRow>
          <Button primary onClick={() => setPlay(true)}>Play</Button>
          <Button primary onClick={() => setSolve(true)}>Solve</Button>
        </ButtonRow>
      </ImportWrapper>

      <Footer>
        <Button onClick={() => setData(null)}>Back</Button>
      </Footer>
    </>
  )

  if (solve) return (
    <>
      <Solve {...data} />
      <Footer>
        <Button onClick={() => setSolve(false)}>Back</Button>
      </Footer>
    </>
  )

  return (
    <>
      <Game {...data} />
      <Footer>
        <Button onClick={() => setPlay(false)}>Back</Button>
      </Footer>
    </>
  )
}

export default ImportPuzzle