import React, { useState } from 'react'

import SelectNikoliPuzzle from './select'
import Game from '../game'
import Footer, { FooterLink } from '../../styles/footer'
import Button from '../../styles/button'
import { NikoliStorageContext, NikoliStorageProvider } from './storage'


function Nikoli(props) {
  const [puzzle, selectPuzzle] = useState(null)

  if (!puzzle) return (
    <>
      <NikoliStorageProvider>
        <SelectNikoliPuzzle selectPuzzle={selectPuzzle} />
      </NikoliStorageProvider>
      <Footer>
        <FooterLink to={'/kurodoko/'}>Back</FooterLink>
      </Footer>
    </>
  )

  return (
    <>
      <NikoliStorageProvider>
        <NikoliStorageContext.Consumer>
          {({ solve }) => <Game {...puzzle} id={`Janko ${parseInt(puzzle.id)}${!puzzle.author ? '' : ` - (by ${puzzle.author})`}`} onSolve={() => solve(puzzle.id)} />}
        </NikoliStorageContext.Consumer>
      </NikoliStorageProvider>
      <Footer>
        <Button onClick={() => selectPuzzle(null)}>Back</Button>
      </Footer>
    </>
  )
}

export default Nikoli
