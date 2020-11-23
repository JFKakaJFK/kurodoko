import React from 'react'

import SEO from '../../components/seo'
import DailyGame from '../../components/daily-game'
import { KURODOKO } from '../../util/puzzle-types'

const Daily = () => (
  <>
    <SEO title="Daily" />
    <DailyGame type={KURODOKO} backUrl={'/kurodoko/'} />
  </>
)

export default Daily