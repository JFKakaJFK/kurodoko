import React from 'react'

import SEO from '../components/seo'
import Footer, { FooterLink } from '../styles/footer'
import Loader from '../components/loader'


// TODO delete this page
const Index = () => (
  <>
    <SEO title="Settings" />
    <Loader type={'OHNO'} />
    <Footer>
      <FooterLink to={'/'}>Back</FooterLink>
    </Footer>
  </>
)

export default Index