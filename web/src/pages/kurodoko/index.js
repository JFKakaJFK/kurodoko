import React from 'react'

import SEO from '../../components/seo'
import Menu from '../../components/menu'
import Footer, { FooterLink } from '../../styles/footer'

const urls = [{
  url: '/kurodoko/rules',
  text: 'Rules'
}, {
  url: '/kurodoko/nikoli',
  text: 'Nikoli Puzzles'
}, {
  url: '/kurodoko/janko',
  text: 'Janko Puzzles'
}, {
  url: '/kurodoko/daily',
  text: 'Play Daily'
}, {
  url: '/kurodoko/random',
  text: 'Play Random'
}, {
  url: '/import',
  text: 'Import'
}]

const Index = () => (
  <>
    <SEO title="Kurodoko" />
    <Menu urls={urls} square />
    <Footer>
      <FooterLink to={'/'}>Back</FooterLink>
    </Footer>
  </>
)

export default Index