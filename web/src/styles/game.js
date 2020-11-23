import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Layout from './layout'

const GameActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  /* flex-wrap: nowrap; */
  flex-wrap: wrap;
`

const GameAction = styled.span`
  ${props => props.disabled && `opacity: 50%; pointer-events: none;`}
  ${props => !props.disabled && `cursor: pointer;`}
`

GameAction.propTypes = {
  disabled: PropTypes.bool
}

const GameInfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  :empty::after,
  > :empty::after {
    content: '.';
    visibility: hidden;
  }
`

const GameInfo = styled.span`
`

const GameSettingsStyles = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${props => props.theme.backgroundColor};
`

const GameSettings = (props) => (
  <GameSettingsStyles>
    <Layout>
      {props.children}
    </Layout>
  </GameSettingsStyles>
)

GameSettings.propTypes = {
  children: PropTypes.node
}

const GameSettingStyles = styled.li`
  span {
    cursor: pointer;
    text-decoration: underline;
  }
`

const GameSetting = (props) => (
  <GameSettingStyles>
    {props.children} - <a onClick={props.onClick}>{props.val ? 'Yes' : 'No'}</a>
  </GameSettingStyles>
)

GameSetting.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  val: PropTypes.bool.isRequired
}

export {
  GameInfoRow,
  GameInfo,
  GameAction,
  GameActionRow,
  GameSettings,
  GameSetting
}