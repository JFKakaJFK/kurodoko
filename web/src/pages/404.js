import React from 'react'

import SEO from '../components/seo'
import Footer, { FooterLink } from '../styles/footer'

const ErrorPage = () => (
  <>
    <SEO title="404" />
    <div>
      <h1>Something went wrong :/</h1>
      <pre><code>404 - Not Found</code></pre>
    </div>
    <Footer>
      <FooterLink to={'/'}>Home</FooterLink>
    </Footer>
  </>
)

export default ErrorPage