import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { KURODOKO, OHNO } from '../util/puzzle-types'
import { Link } from 'gatsby'

const Wrapper = styled(motion.header)`
  height: ${props => props.theme.headerHeight};
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: transparent;
  z-index: 42;
  position: relative;

  @media screen and (min-width: ${props => props.theme.md}px) {
    position: absolute;
  }
`

const HeaderLink = styled(Link)`
  margin: ${props => props.theme.headerPadding} ${props => props.theme.headerPadding} 0;
  pointer-events: all;
  overflow: visible;

  font-variant: all-small-caps;
  text-decoration: none;

  &:first-child {
    font-family: 'Otsutome';
    writing-mode: vertical-rl;
    text-orientation: upright;
    line-height: 1;
    padding-top: 0.2em;
    word-wrap: break-word;
    font-size: 1.5rem;
    white-space: nowrap;
  }

  &:last-child {
    font-size: 1.125rem;
    line-height: 1;
  }
`

const Home = (props) => (
  <Wrapper {...props} >
    <HeaderLink to="/">黒どこ</HeaderLink>
    <HeaderLink to="/">Kurodoko</HeaderLink>
  </Wrapper>
)

const Kurodoko = (props) => (
  <Wrapper {...props} >
    <HeaderLink to="/">黒どこ</HeaderLink>
    <HeaderLink to="/">Kurodoko</HeaderLink>
  </Wrapper>
)

// 大野
const Ohno = (props) => (
  <Wrapper {...props} >
    <HeaderLink to="/">Oh no</HeaderLink>
    <HeaderLink to="/">Oh no</HeaderLink>
  </Wrapper>
)

const HeaderContext = React.createContext()

function Header(props) {
  const { header } = useContext(HeaderContext)
  switch (header) {
    case OHNO:
      return <Ohno {...props} />
    case KURODOKO:
      return <Kurodoko {...props} />
    default:
      return <Home {...props} />
  }
}

const fromPath = (path, cb) => {
  if (path.toLocaleLowerCase().includes('kurodoko'))
    return cb(KURODOKO)
  if (path.toLocaleLowerCase().includes('ohno'))
    return cb(OHNO)
  cb('HOME')
}

export default Header

export {
  HeaderContext,
  fromPath,
}