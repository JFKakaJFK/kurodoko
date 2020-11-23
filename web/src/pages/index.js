import React from 'react'

import SEO from '../components/seo'
import Menu from '../components/menu'
import Footer, { FooterLink } from '../styles/footer'

const urls = [{
  text: 'Kurodoko',
  url: '/kurodoko/'
}, {
  text: 'Oh no',
  url: '/ohno/'
}, {
  text: 'Import',
  url: '/import'
}, {
  text: 'Settings',
  url: '/settings'
}]

const Index = () => (
  <>
    <SEO title="Home" />
    <Menu urls={urls} circle square />
    <Footer>
      <FooterLink to={'/about'}>About</FooterLink>
    </Footer>
  </>
)

export default Index