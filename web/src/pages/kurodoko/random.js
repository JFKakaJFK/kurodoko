import React from 'react'

import SEO from '../../components/seo'
import { KURODOKO } from '../../util/puzzle-types'
import RandomGame from '../../components/random-game'

const Random = () => (
  <>
    <SEO title="Random" />
    <RandomGame type={KURODOKO} backUrl={'/kurodoko/'} />
  </>
)

export default Random