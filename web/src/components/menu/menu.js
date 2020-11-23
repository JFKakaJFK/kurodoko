import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { Link } from 'gatsby'

const duration = .25

const link = {
  initial: {
    x: '100%',
  },
  enter: {
    x: 0,
    transition: { duration: duration, },
  },
  exit: {
    x: '100%',
    transition: { duration: duration },
  },
  hover: {
    x: '1.5rem',
    transition: { duration: duration },
  }
}

const menu = {
  initial: {},
  enter: {
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.07,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1,
      // when: "afterChildren",
    },
  }
}

const SymbolRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  > :not(:last-child) {
    margin-right: 5px;
  }
`

const Symbol = styled.div`
  /* margin: 2rem 0; */
  width: ${props => props.big ? 50 : 40}px;
  height: ${props => props.big ? 50 : 40}px;
  background: ${props => props.theme.activeColor};
  align-self: center;
  justify-self: center;

  /* &:first-child {
    margin: 1rem 0 2rem;
  }

  &:last-child {
    margin: 2rem 0 1rem;
  } */
`

const Square = styled(Symbol)`
`

const Circle = styled(Symbol)`
  border-radius: 50%;
`

const MenuItemStyles = styled(motion.li)`
  a {
    padding: 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    text-decoration: none;
    line-height: 1;
    font-size: 1.5rem;
    color: ${props => props.theme.textColor};

    > :last-child {
      margin-left: .5rem;
      /* the small caps have 80% of the height => middle is 0.5font size * .8 -1px */
      margin-bottom: calc(.4em - 1px);
      flex: 1;
      height: 0;
      border-bottom: 1px solid ${props => props.theme.textColor};
    }

    &:hover { 
      color: ${props => props.theme.activeColor};

      > :last-child {
        border-color: ${props => props.theme.activeColor};
      }
    }
  }
`

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 5px;
  grid-template-rows: minmax(6rem, 7rem) auto minmax(6rem, 7rem);
  align-content: start;
  font-variant: all-small-caps;
`

const MenuStyles = styled(motion.ul)`
  margin: 0;
  list-style-type: none;
  padding-left: 0;
  display: grid;
  gap: 2rem;
  transition: margin-right 300ms ease;

  @media screen and (max-width: ${props => props.theme.md}px){
    margin-right: calc(-${props => props.theme.padding} - 1rem);
  }
`

const MenuLink = (props) => (
  <MenuItemStyles
    variants={link}
    whileHover="hover"
  >
    <Link to={props.to}>
      <span>{props.children}</span><span />
    </Link>
  </MenuItemStyles>
)

MenuLink.propTyes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
}


function Menu(props) {
  return (
    <Wrapper>
      <SymbolRow>
        {props.circle && <Circle big={props.bigSymbols} />}
        {props.square && <Square big={props.bigSymbols} />}
      </SymbolRow>
      <MenuStyles variants={menu} >
        {props.urls.map(({ url, text }, i) => <MenuLink key={i} to={url}>{text}</MenuLink>)}
      </MenuStyles>
      <SymbolRow>
        {props.square && <Square big={props.bigSymbols} />}
        {props.circle && <Circle big={props.bigSymbols} />}
      </SymbolRow>
    </Wrapper>
  )
}

Menu.propTypes = {
  urls: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  circle: PropTypes.bool,
  square: PropTypes.bool,
  bigSymbols: PropTypes.bool,
}

export default Menu
