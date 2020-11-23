import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styled from 'styled-components'

import Button from './button'

const FooterLink = (props) => (
  <Link to={props.to}><Button>{props.children}</Button></Link>
)

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 1rem 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  line-height: 1;
  font-variant: all-small-caps;
`

const Separator = styled.span`
  flex: 1;
  margin-bottom: calc(.4em - 1px);
  height: 0;
  border-bottom: 1px solid ${props => props.theme.textColor};

  &:first-child {
    margin-right: .5rem;
  }

  &:last-child {
    margin-left: .5rem;
  }
`

const BackWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  padding-left: 2rem;
  position: relative;

  span:last-child {
    margin: 0 0.5rem calc(.4em - 1px) 0;
  }
`

const BackArrow = styled.span`
  width: 10px;
  height: 10px;
  border: 1px solid ${props => props.theme.textColor};
  transform: translate(1px,-50%) rotate(45deg);
  border-top: 0;
  border-right: 0;
  position: absolute;
  bottom: calc(50% - 0.4em); 
  /* + 1px); */
`

const Back = () => (
  <BackWrapper>
    <BackArrow />
    <Separator />
  </BackWrapper>
)

const Footer = ({ children, arrow }) => (
  <FooterWrapper>
    {arrow ? <Back /> : <Separator />}
    {children}
    <Separator />
  </FooterWrapper>
)

Footer.propTypes = {
  children: PropTypes.node.isRequired
}

export default Footer

export {
  FooterLink
}
