import { useState, useEffect, useContext } from 'react'
import THEMES, { ThemeContext, defaultTheme } from '../styles/themes'

function useSystemTheme(init = true) {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    // no support :(
    if (typeof window === `undefined` || !window.matchMedia) return

    // since we only can tell if a media query matches, if we have multiple themes,
    // we need a listener for each theme
    const listener = (mq) => {
      if (!mq || !mq.matches) return

      Object.entries(THEMES).forEach(([k, v]) => mq.media === v.query && setTheme(k))
    }

    // add media queries for all themes
    const mediaQueries = Object.entries(THEMES).map(([k, v]) => {
      const mq = window.matchMedia(v.query)
      mq.addListener(listener)
      // check once to see if the query already matches
      if (init) listener(mq)
      return mq
    })

    return () => {
      mediaQueries.forEach(mq => mq.removeListener(listener))
    }
  }, [])

  return theme
}

function useCurrentTheme() {
  // needs ThemeProvider as parent
  const theme = useContext(ThemeContext)
  return THEMES[theme] || THEMES[defaultTheme]
}

export {
  useSystemTheme,
  useCurrentTheme,
}