import React from 'react'

import SEO from '../../components/seo'
import { OHNO } from '../../util/puzzle-types'
import RandomGame from '../../components/random-game'

const Random = () => (
  <>
    <SEO title="Random" />
    <RandomGame type={OHNO} backUrl={'/ohno/'} />
  </>
)

export default Random