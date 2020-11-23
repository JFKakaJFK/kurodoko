import React from 'react'

import SEO from '../../components/seo'
import { OHNO } from '../../util/puzzle-types'
import Rules from '../../components/rules'
import Footer, { FooterLink } from '../../styles/footer'

const RulesPage = () => (
  <>
    <SEO title="Rules" />
    <Rules type={OHNO} linkToMainAfterTutorial={true} />
    <Footer>
      <FooterLink to={'/ohno/'}>Back</FooterLink>
    </Footer>
  </>
)

export default RulesPage