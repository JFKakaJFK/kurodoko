import React from 'react'

import SEO from '../../components/seo'
import { KURODOKO } from '../../util/puzzle-types'
import Rules from '../../components/rules'
import Footer, { FooterLink } from '../../styles/footer'

const RulesPage = () => (
  <>
    <SEO title="Rules" />
    <Rules type={KURODOKO} linkToMainAfterTutorial={true} />
    <Footer>
      <FooterLink to={'/kurodoko/'}>Back</FooterLink>
    </Footer>
  </>
)

export default RulesPage