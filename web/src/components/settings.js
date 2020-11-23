import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useLSBitmap } from '../hooks/use-ls-state'
import { ToggleTheme } from './theme'
import { ToggleSwitch } from './toggle'

const DEFAULT_SETTINGS = {
  showTimer: {
    name: 'Show Time',
    value: true
  },
  showValidate: {
    name: 'Show Validate',
    value: true
  },
  showUndo: {
    name: 'Show Undo',
    value: true
  },
  showRedo: {
    name: 'Show Redo',
    value: true
  },
  showDecision: {
    name: 'Show Trial Mode',
    value: true
  },
  showHint: {
    name: 'Show Hint',
    value: true
  }
}

const ToggleSettingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-variant: all-small-caps;
`

function ToggleSetting(props) {
  return (
    <ToggleSettingWrapper>
      <span>{props.children}</span>
      <ToggleSwitch {...props} />
    </ToggleSettingWrapper>
  )
}

ToggleSetting.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  on: PropTypes.string,
  off: PropTypes.string,
}

const SettingsContext = React.createContext()

function SettingsProvider(props) {
  const [get, set] = useLSBitmap('settings', Object.entries(DEFAULT_SETTINGS).map(([, v]) => v.value))

  return (
    <SettingsContext.Provider value={{
      settings: Object.assign({}, ...Object.entries(DEFAULT_SETTINGS).map(([k, v], i) => { const o = { [k]: v }; o[k].value = get(i); return o })),
      toggleSetting: (key) => {
        const i = Object.keys(DEFAULT_SETTINGS).findIndex(k => k === key)
        if (i === undefined) return
        set(i, !get(i))
      }
    }}>
      {props.children}
    </SettingsContext.Provider>
  )
}

SettingsProvider.propTypes = {
  children: PropTypes.node,
}

const SettingsWrapper = styled.div`
  display: grid;
  padding: 0 ${props => props.theme.padding};
  gap: 1rem;
`

function Settings(props) {
  const { settings, toggleSetting } = useContext(SettingsContext)
  return (
    <SettingsWrapper>
      <h1>Settings</h1>
      {props.firstChildren}
      {Object.entries(settings).map(([k, v]) => (
        <ToggleSetting key={k} disabled={props.disable && props.disable.includes(k)} onChange={() => toggleSetting(k)} value={v.value}>{v.name}</ToggleSetting>
      ))}
      <ToggleTheme />
      {props.children}
    </SettingsWrapper>
  )
}

Settings.propTypes = {
  children: PropTypes.node,
  firstChildren: PropTypes.node,
  disable: PropTypes.arrayOf(PropTypes.string)
}

export {
  ToggleSetting,
  SettingsProvider,
  SettingsContext,
  Settings
}
