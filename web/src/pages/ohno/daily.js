import React from 'react'

import SEO from '../../components/seo'
import { OHNO } from '../../util/puzzle-types'
import DailyGame from '../../components/daily-game'

const Daily = () => (
  <>
    <SEO title="Daily" />
    <DailyGame type={OHNO} backUrl={'/ohno/'} />
  </>
)

export default Daily