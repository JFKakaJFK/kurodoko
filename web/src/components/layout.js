import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { AnimatePresence } from 'framer-motion'

import LayoutStyles from '../styles/layout'
import GlobalStyles from '../styles/global'
import { ThemeProvider } from './theme'
import { SettingsProvider } from "./settings"

import Header, { HeaderContext, fromPath } from "./header"
import { defaultTheme } from "../styles/themes"

import '../fonts/fonts.css'

const duration = 0.25

const headerVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: duration,
      delay: 2 * duration,
      // when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration,
      delay: duration,
      //when: 'afterChildren'
    },
  },
}

const layout = {
  initial: {
    x: '100%',
  },
  enter: {
    x: 0,
    transition: {
      duration: duration,
      delay: 2 * duration,
      // when: 'beforeChildren',
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: duration,
      delay: duration,
      //when: 'afterChildren'
    },
  },
}

// top -> kurodoko/ohno/import/about/settings
// kurodoko/ohno -> all (except back)
// fadeout right
// enter from left

// to main
// fadeout to left
// enter from right



function Layout({ location, children }) {
  const [header, setHeader] = useState(null)

  useEffect(() => {
    fromPath(location.pathname, (v) => setHeader(v))
  }, [location.pathname])

  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <GlobalStyles />
      <SettingsProvider>
        <HeaderContext.Provider
          value={{
            header,
            setHeader
          }}
        >
          <AnimatePresence>
            <Header
              key={header}
              variants={headerVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            />
          </AnimatePresence>
          <AnimatePresence>
            <LayoutStyles
              key={location.pathname} /*// TODO better keys */
              variants={layout}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {children}
            </LayoutStyles>
          </AnimatePresence>
        </HeaderContext.Provider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
Layout.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

export default Layout
