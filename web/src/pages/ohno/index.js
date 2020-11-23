import React from 'react'

import SEO from '../../components/seo'
import Menu from '../../components/menu'
import Footer, { FooterLink } from '../../styles/footer'

const urls = [{
  url: '/ohno/rules',
  text: 'Rules'
}, {
  url: '/ohno/daily',
  text: 'Play Daily'
}, {
  url: '/ohno/random',
  text: 'Play Random'
}, {
  url: '/import',
  text: 'Import'
}]

const Index = () => (
  <>
    <SEO title="Oh No" />
    <Menu urls={urls} circle bigSymbols />
    <Footer>
      <FooterLink to={'/'}>Back</FooterLink>
    </Footer>
  </>
)

export default Index