import React from 'react'
import PropTypes from 'prop-types'
import NIKOLI_PUZZLES from '../../data/nikoli-puzzles'
import { useLSBitmap } from '../../hooks/use-ls-state'

const NikoliStorageContext = React.createContext()

function NikoliStorageProvider(props) {
  const [get, set, setAll] = useLSBitmap('nikoli', NIKOLI_PUZZLES.map(p => false))

  return <NikoliStorageContext.Provider
    value={{
      isSolved: (id) => get(id - 1),
      solve: (id) => set(id - 1, true),
      reset: () => setAll(false)
    }}
  >
    {props.children}
  </NikoliStorageContext.Provider>
}

NikoliStorageProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export {
  NikoliStorageContext,
  NikoliStorageProvider
}