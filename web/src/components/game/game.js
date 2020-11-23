import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { client } from '../../apollo/client'

import { puzzleToGrid, puzzleToLockMap, WHITE, BLACK, UNDEFINED, isUndef, isWhite, isNumber, DIRECTIONS, mergePuzzleGrids } from '../../util/puzzle-representation'
import PUZZLE_TYPES, { KURODOKO } from '../../util/puzzle-types'
import shuffle from '../../util/shuffle'
import Grid, { GridCell } from '../../styles/grid'
import Timer from './timer'
import Footer from '../../styles/footer'
import Rules from '../rules'
import { Undo, Redo, Hint, Check as CheckBox, Cogs, Check, X } from '../icons'

import { SettingsContext, Settings } from '../settings'
import { motion } from 'framer-motion'
import Button, { ButtonRow } from '../../styles/button'
import { SOLVE_PUZZLE_QUERY } from '../solve/solve'

const copy = (toCopy) => JSON.parse(JSON.stringify(toCopy))

const WINNING_PHRASES = ['Nicely done', 'Wonderful', 'Spectacular', 'Marvelous', 'Outstanding', 'Remarkable', 'Impressive', 'Great', 'Well done', 'Fabulous', 'Clever', 'Dazzling', 'Fantastic', 'Excellent', 'Nice', 'Super', 'Awesome', 'Brilliant', 'Splendid', 'Exceptional', 'Magnificent', 'Yay']

const GameActionRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: .5rem;
  justify-items: center;
  align-items: center;
`

const GameAction = styled.button`
  cursor: pointer;
  /* button reset */
  border: 0;
  outline-width: 0;
  background: transparent;
  color: inherit;
  margin: 0;
  padding: .5rem;
  transition: color 300ms ease, background 300ms ease;
  position: relative;
  /* hides all text but ensures that there is no additional space due to line height */
  font-size: 0;

  &:hover,
  &:active {
    color: ${props => props.theme.activeColor};
  }

  ${props => props.disabled && `
    pointer-events: none;
    color: ${props.theme.disabledColor};
  `};
`

const ActionCounter = styled.sup`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 10px;
  line-height: 0;
  width: 1.2em;
  height: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-radius: 1em; */
  font-variant: all-small-caps;
  color: ${props => props.theme.actionHoverColor};
  background: ${props => props.theme.actionHoverBackground};
`

const WinningPhrase = styled.h2`
  text-align: center;
  font-variant: all-small-caps;
  font-size: 1.125rem;
  line-height: 1;
  margin: 0;
`

const StatusRow = styled.div`
  height: 4rem;
  align-self: center;

  display: flex;
  justify-content: center;
  /* align-items: flex-end; */
  align-items: center;

  color: ${props => props.theme.activeColor};
  font-size: 1.125rem;
  font-weight: bold;
  text-transform: full-width;
  font-variant: all-small-caps tabular-nums;
  line-height: 1;
`

const HintMessage = styled.span`
  max-width: 54%;
  text-align: center;
`

const Separator = styled.s`
  flex: 1;
  height: 0;
  /* transform: translate(0, calc(-0.4em + 1px)); */
  transform: translate(0, 1px);
  border-bottom: 1px solid ${props => props.theme.timerColor};

  &:first-child {
    margin-right: 5px;
  }

  &:last-child {
    margin-left: 5px;
  }
`

const DecisionHeader = styled.span`
  font-size: 0.75rem;
  font-variant: all-small-caps;
`

const GameInfo = styled.div`
  /* display: grid;
  grid-template-columns: repeat(3, 1fr); */
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-variant: all-small-caps;

  span:nth-child(1) { text-align: left; }
  span:nth-child(2) { text-align: center; }
  span:nth-child(3) { text-align: right; }

  :empty::after {
    content: '.';
    visibility: hidden;
  }
`
// TODO end decision mode after finish

const GameWrapper = styled.div`
  display: grid;
  gap: 2px;

  ${props => props.showSettings && `max-height: 1px; overflow: hidden;`}
  /* ${props => props.showSettings ? `max-height: 1px; overflow: hidden;` : `margin-top: -1.5rem;`} */
`

const GameSettingsWrapper = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: ${props => props.theme.backgroundColor};
  z-index: 2;
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;

  > :first-child {
    padding-left: ${props => props.theme.padding};
    padding-right: ${props => props.theme.padding};
    /* max-width: ${props => props.theme.md}px; */
    /* margin: 0 auto; */
    overflow-x: hidden;

    @media screen and (min-width: ${props => props.theme.md}px) {
      justify-self: center;
      width: ${props => props.theme.md}px;
    }
  }

  a#export {
     display: contents;
     text-decoration: none;
     transition: color 300ms ease, background 300ms ease;
  }
`

const GameSettings = ({ children }) => (
  <GameSettingsWrapper>
    {children}
  </GameSettingsWrapper>
)

const defaultHints = 5

class Game extends React.Component {
  constructor(props) {
    super(props)

    // rewrite puzzle representation to number list
    this.lockedCells = puzzleToLockMap(props.puzzle)
    const gridCells = props.grid || puzzleToGrid(props.puzzle)

    // game state
    this.state = {
      showSettings: false,
      showRules: false,
      solution: props.solution,
      done: false,
      hint: '',
      hintsLeft: props.hintsLeft || defaultHints, // using LS + provider this could be globalized (i.e. 5 hints to start + 1 hint per solved daily puzzle)
      highlighted: [],
      grid: gridCells,
      history: props.history || [copy(gridCells)],
      historyIndex: props.historyIndex || 0,
      gridChanged: false,
      decision: props.decision || false,
      decisionStartCell: props.decisionStartCell || null,
      decisionGridBackup: props.decisionGridBackup || null,
      decisionHistoryIndexBackup: props.decisionHistoryBackup || null,
      decisionHistoryBackup: props.decisionHistoryIndexBackup || null,
      solverUsed: props.solverUsed || false,
    }

    // reference to the grid
    this.exportRef = React.createRef()
    this.timer = null

    this.validationWorker = { validate: PUZZLE_TYPES[props.type].validate }
  }

  componentDidMount() {
    this.validate(false) // needs to be called here since setState is called
    // set timer with elapsedTime
    this.timer && this.timer.start(this.props.elapsedTime || 0)
  }

  componentDidUpdate() {
    if (this.state.gridChanged) this.validate(false)
  }

  /* ========== SETTINGS =========== */

  toggleSettings = () => {
    if (!this.state.done)
      this.state.showSettings ? this.timer.start() : this.timer.stop()
    this.setState({ showSettings: !this.state.showSettings, gridChanged: false })
  }

  toggleRules = () => this.setState({
    showRules: !this.state.showRules,
    gridChanged: false
  })

  /* ========== GAME FUNCTIONS =========== */

  validate(showHints = false) {
    // TODO show hint iff all cells filled but mistake made?
    // TODO switch to web workers
    // console.log(this.validationWorker)
    const [done, cells, hint] = this.validationWorker.validate({
      grid: this.state.grid,
      rows: this.props.rows,
      cols: this.props.cols,
      hints: showHints
    })
    // TODO remove
    // console.log(done, cells, hint)

    if (done) {
      console.log('finish game')
      this.timer && this.timer.stop()
      if (this.state.decision) this.finalizeDecision()
      this.setState({
        done,
        hint: '',
        highlighted: [],
        gridChanged: false,
      })
      !this.state.solverUsed && this.props.onSolve && this.props.onSolve()
    } else if (showHints) {
      this.setState({
        hint,
        highlighted: cells,
        gridChanged: false,
      })
    } else {
      this.setState({
        hint: '',
        highlighted: [],
        gridChanged: false,
      })
    }
  }

  resetGame() {
    // reset timer
    this.timer && this.timer.start(0)
    // reset grid (reset history)
    const grid = puzzleToGrid(this.props.puzzle)
    // reset state
    this.setState({
      hintsLeft: this.props.hintsLeft || defaultHints,
      done: false,
      decision: false,
      gridChanged: true,
      showSettings: false,
      grid,
      history: [copy(grid)],
      historyIndex: 0,
      decisionStartCell: null,
      decisionGridBackup: null,
      decisionHistoryIndexBackup: null,
      decisionHistoryBackup: null,
      solverUsed: false,
    })
  }

  /** Downloads the current game state */
  exportGame() {
    const data = {
      // puzzle info and initial puzzle
      ...this.props,
      // solution if available
      solution: this.state.solution,
      // timer
      // TODO encrypt all data below here
      // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
      elapsedTime: this.timer && this.timer.getElapsedTime(),
      // current state & history
      hintsLeft: this.state.hintsLeft,
      grid: this.state.grid,
      history: this.state.history,
      historyIndex: this.state.historyIndex,
      decision: this.state.decision,
      decisionStartCell: this.state.decisionStartCell,
      decisionGridBackup: this.state.decisionGridBackup,
      decisionHistoryBackup: this.state.decisionHistoryBackup,
      decisionHistoryIndexBackup: this.state.decisionHistoryIndexBackup,
      solverUsed: this.state.solverUsed,
    }
    const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
    const link = (this.exportRef && this.exportRef.current) || document.getElementById('export');
    if (!link) console.log('failed to download')
    link.href = URL.createObjectURL(file);

    link.download = `${this.props.type.toUpperCase()}_${this.props.rows}x${this.props.cols}_${new Date().toLocaleTimeString()}.${this.props.type.toLowerCase()}`; //.json`;
  }

  /** Cycles through the cell states */
  changeCell = (row, col) => {
    if (this.lockedCells[row][col]) return

    // change cell
    const grid = copy(this.state.grid)
    // undef -> white -> black -> undef -> ...
    grid[row][col] = isUndef(grid[row][col])
      ? WHITE
      : isWhite(grid[row][col])
        ? BLACK
        : UNDEFINED

    // add copy to history, where any potential redo grids are removed
    const history = [...this.state.history.slice(0, this.state.historyIndex + 1), copy(grid)]

    // update state
    this.setState({
      grid,
      history,
      historyIndex: this.state.historyIndex + 1,
      gridChanged: true,
      // check if decision and first cell changed -> decisionStartCell
      decisionStartCell: this.state.decision
        ? this.state.decisionStartCell === null && (!this.state.decisionGridBackup || !this.state.decisionGridBackup[row] || !this.state.decisionGridBackup[row][col] || this.state.decisionGridBackup[row][col] !== grid[row][col])
          ? [row, col]
          : this.state.decisionStartCell
        : null
    })
  }

  /** Returns true iff undo is possible, else false */
  undoPossible = () => {
    return this.state.historyIndex > 0 && this.state.history.length > 1
  }

  /** If allowed undoes the last move */
  undo = () => {
    if (!this.undoPossible()) return
    // get cells from history and decrease the history index pointer
    this.setState({
      grid: copy(this.state.history[Math.max(this.state.historyIndex - 1, 0)]),
      historyIndex: this.state.historyIndex - 1,
      gridChanged: true,
    })
  }

  /** Returns true iff undo is possible, else false */
  redoPossible = () => {
    return this.state.historyIndex < this.state.history.length - 1
  }

  /** If allowed undoes the last move */
  redo = () => {
    if (!this.redoPossible()) return
    // get cells from history and increase the history pointer
    this.setState({
      grid: copy(this.state.history[this.state.historyIndex + 1]),
      historyIndex: this.state.historyIndex + 1,
      gridChanged: true,
    })
  }

  /** Starts a decision level */
  addDecisionLevel = () => {
    this.setState({
      // grid cells stay the same => grid && gridChanged 
      gridChanged: false,
      history: [copy(this.state.grid)],
      historyIndex: 0,
      // save current cells, history, historyPointer
      decision: true,
      decisionStartCell: null, // the first changed cell becomes the startcell
      decisionGridBackup: copy(this.state.grid),
      decisionHistoryIndexBackup: this.state.historyIndex,
      decisionHistoryBackup: [...this.state.history],
    })
  }

  /** Throws away the current decision level */
  discardDecision = () => {
    this.setState({
      // grid cells stay the same => grid && gridChanged 
      grid: copy(this.state.decisionGridBackup),
      gridChanged: true,
      history: [...this.state.decisionHistoryBackup],
      historyIndex: this.state.decisionHistoryIndexBackup,
      // save current cells, history, historyPointer
      decision: false,
      decisionStartCell: null,
      decisionGridBackup: null,
      decisionHistoryIndexBackup: null,
      decisionHistoryBackup: null,
    })
  }

  /** Adds the current decision level to the history */
  finalizeDecision = () => {

    this.setState({
      // grid cells stay the same => grid && gridChanged
      gridChanged: false,
      history: [...this.state.decisionHistoryBackup.slice(0, this.state.decisionHistoryIndexBackup), ...this.state.history],
      historyIndex: this.state.decisionHistoryIndexBackup + this.state.historyIndex,
      // save current cells, history, historyPointer
      decision: false,
      decisionStartCell: null,
      decisionGridBackup: null,
      decisionHistoryIndexBackup: null,
      decisionHistoryBackup: null,
    })
  }

  /** Fetches the solution from the api and displays a new hint */
  getHint = async (updateHintsLeft = true, whiteAsHint = true) => {
    if (this.state.hintsLeft <= 0) return this.setState({
      hint: 'You have no hints left.'
    })

    const { rows, cols, type, puzzle } = this.props
    const grid = copy(this.state.grid)
    // check if solution available
    let solution = this.state.solution

    if (!solution) {
      // and add solution to state
      try {
        this.setState({
          disableHint: true,
          gridChanged: false,
        })
        // TODO stop request on unmount iff active (maybe, it doesn't really do any harm other than maybe throwing console errors)
        const res = await client.query({
          query: SOLVE_PUZZLE_QUERY,
          variables: { rows, cols, type, puzzle },
        })

        if (res.data && res.data.solve && res.data.solve.satisfiable) {
          solution = res.data.solve.solution
          this.setState({
            disableHint: false,
            ...res.data.solve,
            gridChanged: false,
          })
        } else {
          this.setState({
            disableHint: false,
            hint: res.error ? res.error : 'Seems like this puzzle has no solution.',
            gridChanged: false,
          })
          return res.error ? res.error : 'Seems like this puzzle has no solution.'
        }
      } catch (e) {
        this.setState({
          disableHint: false,
          hint: e.message,
          gridChanged: false,
        })
        return e.message
      }
    }

    if (!solution) {
      return this.setState({
        hint: 'Could not provide a hint.',
        gridChanged: false,
      })
    }

    // find undefined cell in grid which is white in the solution
    let undefs = 0
    let [row, col] = [null, null]
    let solutionGrid = puzzleToGrid(solution)

    let indices = [...new Array(rows * cols)].map((e, i) => i)
    shuffle(indices)
    for (let i of indices) {
      const [r, c] = [Math.floor(i / cols), i % cols]
      if (!row && !col && (isUndef(grid[r][c]) || (!isNumber(grid[r][c]) && grid[r][c] !== solutionGrid[r][c]))) {
        [row, col] = [r, c]
      }
      if (isUndef(grid[r][c])) {
        if (++undefs >= 2) break
      }
    }

    if (row === null || col === null) return this.setState({
      hint: '',
      gridChanged: true, // if there are no undefined cells, validate the progress
    })

    let hint = solutionGrid[row][col]

    // compute visibility in solution
    if (isWhite(hint) && whiteAsHint) {
      hint = DIRECTIONS.reduce((acc, [x, y]) => {
        let seen = 0
        let [r, c] = [row + x, col + y]
        while (r >= 0 && r < rows && c >= 0 && c < cols && isWhite(solutionGrid[r][c])) {
          seen++
          [r, c] = [row + (x * (seen + 1)), col + (y * (seen + 1))]
        }
        return acc + seen
      }, type === KURODOKO ? 1 : 0).toString()
    }

    // add visibility as numbered hint
    grid[row][col] = hint

    // add copy to history, where any potential redo grids are removed
    const history = [...this.state.history.slice(0, this.state.historyIndex + 1), copy(grid)]

    // update state
    this.setState({
      hint: '',
      grid,
      history,
      highlighted: [[row, col]],
      hintsLeft: updateHintsLeft ? this.state.hintsLeft - 1 : this.state.hintsLeft,
      historyIndex: this.state.historyIndex + 1,
      // only check if solved if there are no undefined cells left in the grid
      gridChanged: undefs - 1 <= 0,
    })
  }

  /** Replaces the current state with the solution */
  solve = async (animated = false) => {
    const err = await this.getHint(false, false)

    if (animated) {
      const interval = 150 // ms

      const solveStep = async () => {
        if (!this.state.done) { // doesnt work properly :/
          await this.getHint(false, false)
          setTimeout(solveStep, interval)
        }
      }

      setTimeout(solveStep, interval)
    } else {
      if (!this.state.solution) return this.setState({
        hint: err || 'Could not solve the puzzle.',
        gridChanged: false
      })
      this.setState({
        grid: mergePuzzleGrids(puzzleToGrid(this.props.puzzle), puzzleToGrid(this.state.solution)),
        gridChanged: true,
        solverUsed: true,
        showSettings: false,
      })
    }
  }

  render() {
    const { id, type, difficulty, rows, cols } = this.props
    const { showSettings, showRules, grid, decision, hint, highlighted, done, decisionStartCell, decisionGridBackup, hintsLeft, disableHint } = this.state

    return (
      <SettingsContext.Consumer>
        {({ settings }) => (
          <>
            <GameWrapper showSettings={showSettings}>
              <WinningPhrase>{done && WINNING_PHRASES[Math.floor(Math.random() * WINNING_PHRASES.length)]}</WinningPhrase>

              <StatusRow>
                <Separator />
                {hint && <HintMessage>{hint}</HintMessage>}
                <Timer
                  ref={timer => this.timer = timer}
                  showTimer={settings.showTimer.value && !hint}
                />
                <Separator />
              </StatusRow>

              <GameInfo>
                <span>{difficulty ? difficulty : ''}</span>
                <span>{id ? id : ''}</span>
                <span>{rows}x{cols}</span>
              </GameInfo>
              <Grid rows={rows} cols={cols} type={type}>
                {grid.map(
                  (row, i) => row.map(
                    (cell, j) => this.lockedCells[i][j] || done || isNumber(cell) // initial hint, finished game or added hint
                      ? <GridCell
                        key={i * rows + j}
                        type={type}
                        val={cell}
                        isLocked
                        highlighted={highlighted.some(([r, c]) => r === i && c === j)}
                        decision={decision}
                        decisionCellChanged={false}
                        hideValue={done && type === KURODOKO && !isNumber(cell)}
                      />
                      : <GridCell
                        key={i * rows + j}
                        type={type}
                        val={cell}
                        onClick={() => this.changeCell(i, j)}
                        highlighted={highlighted.some(([r, c]) => r === i && c === j) || (decisionStartCell && i === decisionStartCell[0] && j === decisionStartCell[1])}
                        decision={decision}
                        decisionCellChanged={decision && (!decisionGridBackup || !decisionGridBackup[i] || decisionGridBackup[i][j] !== cell)}
                      />
                  )
                )}
              </Grid>
              <GameActionRow>
                {settings.showUndo.value && <GameAction disabled={!this.undoPossible() || done} onClick={this.undo}><Undo /></GameAction>}
                {settings.showHint.value && <GameAction disabled={done || hintsLeft === 0 || disableHint} onClick={this.getHint}><Hint /><ActionCounter>{hintsLeft}</ActionCounter></GameAction>}
                <GameAction onClick={this.toggleSettings}><Cogs /></GameAction>
                {settings.showValidate.value && <GameAction disabled={done} onClick={() => this.validate(true)}><CheckBox /></GameAction>}

                {settings.showRedo.value && <GameAction disabled={!this.redoPossible() || done} onClick={this.redo}><Redo /></GameAction>}
              </GameActionRow>
              {settings.showDecision.value && <DecisionHeader>Trial Mode</DecisionHeader>}
              <ButtonRow>
                {settings.showDecision.value && (decision ? (
                  <>
                    <Button primary disabled={done} onClick={this.finalizeDecision}><Check /></Button>
                    <Button primary disabled={done} onClick={this.discardDecision}><X /></Button>
                  </>
                ) : <Button primary disabled={done} onClick={this.addDecisionLevel}>trial mode</Button>)}
              </ButtonRow>
            </GameWrapper>
            {showSettings && (showRules ? (
              <GameSettings>
                <Rules type={type} />
                <Footer>
                  <Button onClick={() => this.toggleRules()}>Back</Button>
                </Footer>
              </GameSettings>
            ) : (
                <GameSettings>
                  <Settings
                    disable={decision ? ['showDecision'] : null}
                    firstChildren={(
                      <Button align="left" onClick={() => this.toggleRules()}>Show Rules</Button>
                    )}
                  >
                    <ButtonRow>
                      <Button primary onClick={() => this.resetGame()}>reset game</Button>
                      <Button primary onClick={() => this.solve()}>solve</Button>
                    </ButtonRow>
                    <ButtonRow>
                      <a id="export" href="#" ref={this.exportRef} onClick={() => this.exportGame()}><Button primary>export game</Button></a>
                    </ButtonRow>
                  </Settings>
                  <Footer>
                    <Button onClick={() => this.toggleSettings()}>Back</Button>
                  </Footer>
                </GameSettings>
              ))}
          </>
        )}
      </SettingsContext.Consumer>
    )
  }
}

Game.propTypes = {
  type: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  puzzle: PropTypes.arrayOf(PropTypes.string).isRequired,
  // optional just for displaying more info
  difficulty: PropTypes.string,
  id: PropTypes.string,
  solution: PropTypes.arrayOf(PropTypes.string),
  hintsLeft: PropTypes.number,
  // for saving nikoli puzzle progress
  onSolve: PropTypes.func,
  // needed for importing puzzles
  elapsedTime: PropTypes.number, // ms
  grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired),
  history: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired)),
  historyIndex: PropTypes.number,
  decision: PropTypes.bool,
  decisionGridBackup: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired),
  decisionHistoryBackup: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired)),
  decisionHistoryIndexBackup: PropTypes.number
}

export default Game

// TODO
export {
  GameInfo
}
