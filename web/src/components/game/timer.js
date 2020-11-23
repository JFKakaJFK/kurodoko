import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TimerStyles = styled.div`
  align-self: center;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  span {
    text-align: center;
    min-width: 10px;
  }
`
const formatTime = (time) => {
  const hours = Math.floor(time / (1000 * 3600))
  const minutes = Math.floor(time / (1000 * 60)) - hours * 60
  const seconds = Math.floor(time / 1000) - minutes * 60 - hours * 3600

  const f = t => t.toString().padStart(2, '0')

  return (hours > 0 ? `${f(hours)}:` : '') + `${f(minutes)}:${f(seconds)}`
}

/**
 * A timer using time differences between start and end times
 */
class Timer extends React.Component {
  constructor(props) {
    super(props)

    this.tickRate = 200

    this.state = {
      elapsed: 0,
      start: 0,
      current: 0,
      paused: true,
    }
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval)
  }

  _tick = () => {
    if (this.props.isPaused) return
    this.setState({ current: new Date().valueOf() })
  }

  start = (elapsed = null) => {
    this.interval = setInterval(this._tick, this.tickRate)
    const now = new Date().valueOf()
    this.setState({
      elapsed: elapsed === null ? this.state.elapsed : elapsed,
      paused: false,
      start: now,
      current: now,
    })
  }

  stop = () => {
    if (this.state.paused) return
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.setState({
      elapsed: this.state.elapsed + new Date().valueOf() - this.state.start,
      start: 0,
      current: 0,
      paused: true,
    })
  }

  getElapsedTime = () => {
    return this.state.paused ? this.state.elapsed : this.state.elapsed + new Date().valueOf() - this.state.start
  }

  render() {
    if (!this.props.showTimer) return null

    const {
      elapsed,
      start,
      current
    } = this.state

    return (
      <TimerStyles>
        {formatTime(elapsed + current - start).split('').map((c, i) => c === ':' ? ':' : <span key={i}>{c}</span>)}
      </TimerStyles>
    )
  }
}

Timer.propTypes = {
  showTimer: PropTypes.bool.isRequired
}

export default Timer