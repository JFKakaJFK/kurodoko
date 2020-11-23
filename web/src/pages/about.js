import React from 'react'
import styled from 'styled-components'
import SEO from '../components/seo'
import Footer, { FooterLink } from '../styles/footer'
import { GitHub } from '../components/icons'

const AboutStyles = styled.section`
  height: 100%;
  overflow: hidden;
  
  > div:first-child {
    max-height: 100%;
    overflow: auto;
    padding: ${props => props.theme.headerPadding} 0;
  }

  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    box-shadow: inset 0 0 10px 20px ${props => props.theme.backgroundColor};
  }

  a {
    text-decoration: underline;
  }

  .gh {
    display: flex;
    text-align: center;
    margin: 2rem 0 1rem;
    font-size: 1rem;
    line-height: 1;
    font-variant: small-caps;
    align-items: center;
    justify-content: center;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;

      svg {
        object-fit: cover;
        object-position: center;
        /* width: 1em; */
        margin: 0 .25rem;
      }
    }
  }
`

const About = () => (
  <>
    <SEO title="About" />
    <AboutStyles>
      <div>
        <h1>About</h1>
        <p>Coming soon.</p>
        <p>
          This webapp was built as a part of my bachelor's thesis about the
        pen and paper logic puzzles <b>Kurodoko</b> and <b>Oh No</b>.
        One of the main goals was to develop a graphical user interface for playing the
        puzzles. The other aims of the project were to devise solvers and generators for both puzzles
        wich of course are a central part of this webapp. In addition to that I also proved the NP-completeness
        of <b>Oh No</b>.
      </p>
        <h2>Acknowledgements</h2>
        <p>
          I would like to express my gratitude to my supervisor Univ.-Prof. Dr. Aart Middeldorp
          who always gave me helpful hints and suggestions when I was stuck
        and <a href="https://www.instagram.com/alillyrc/" target="_blank" rel="noopener noreferrer nofollow">@alillyrc</a> for coming up with the awesome
        design for the application.
        Secondly I would also like to thank my friends and family who gave me feedback and helped with testing the game.
      </p>
        <h2>Privacy Policy</h2>

        <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights. If you wish to be informed what Personal Information we hold about you and if you want it to be removed from our systems, please <a href="mailto:johannes.koch@live.at" target="_blank" rel="noopener noreferrer nofollow">contact us</a>.</p>
        <p>In certain circumstances, you have the following data protection rights:</p>
        <ul>
          <li>The right to access, update or to delete the information we have on you.</li>
          <li>The right of rectification.</li>
          <li>The right to object.</li>
          <li>The right of restriction.</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>

        <h2>Log Files</h2>
        <p>Kurodoko follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

        <h2>Cookies and Web Beacons</h2>
        <p>Like any other website, Kurodoko uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
        <p>For more general information on cookies, please read <a href="https://www.cookieconsent.com/what-are-cookies/" target="_blank" rel="noopener noreferrer nofollow">"What Are Cookies"</a>.</p>

        <h2>Consent</h2>
        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

        {/* <p className="gh">Built by <a href="https://github.com/JFKakaJFK" target="_blank" rel="noopener noreferrer nofollow"><GitHub /> JFKakaJFK</a></p> */}
      </div>
    </AboutStyles>
    <Footer>
      <FooterLink to={'/'}>Back</FooterLink>
    </Footer>
  </>
)

export default About