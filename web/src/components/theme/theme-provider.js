import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

import THEMES, { ThemeContext } from '../../styles/themes'
import { useSystemTheme } from '../../hooks/use-theme'
import useLSState from '../../hooks/use-ls-state'

function ThemeProvider({ children, defaultTheme }) {
  const [init, setInit] = useLSState('checkSystemTheme', true)
  const systemTheme = useSystemTheme(init)
  const [theme, setTheme] = useLSState('currentTheme', systemTheme || defaultTheme)

  useEffect(() => {
    if (systemTheme === null || !THEMES.hasOwnProperty(systemTheme)) return
    // if a theme is already in ls, don't change it again for the
    // startup system check
    setInit(false)
    setTheme(systemTheme)
  }, [systemTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme: (theme) => THEMES.hasOwnProperty(theme) ? setTheme(theme) : {}
      }}
    >
      <SCThemeProvider theme={THEMES[theme] || THEMES[defaultTheme]}>
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  defaultTheme: PropTypes.oneOf(Object.keys(THEMES)).isRequired,
  children: PropTypes.node
}

export default ThemeProvider