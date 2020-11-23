import React, { useContext } from 'react'

import THEMES, { ThemeContext, defaultTheme } from '../../styles/themes'
import { ToggleSetting } from '../settings'

// this is fine since there are only 2 themes, but iff there are more themes this needs to be replaced
// with some kind of cycle through component
function ToggleTheme() {
  const { theme, changeTheme } = useContext(ThemeContext)
  const themes = Object.keys(THEMES)
  return (
    <ToggleSetting
      onChange={() => changeTheme(themes[(themes.findIndex(t => t === theme) + 1) % themes.length])}
      value={theme === defaultTheme}
      on={THEMES[defaultTheme].name}
      off={THEMES[themes.find(t => t !== defaultTheme)].name}
    >
      Change Theme
    </ToggleSetting>
  )
}

export default ToggleTheme