import React from 'react'

import SEO from '../components/seo'
import Footer, { FooterLink } from '../styles/footer'
import { Settings } from '../components/settings'

const Index = () => (
  <>
    <SEO title="Settings" />
    <Settings />
    <Footer>
      <FooterLink to={'/'}>Back</FooterLink>
    </Footer>
  </>
)

export default Index