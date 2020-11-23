import { motion } from 'framer-motion'
import styled from 'styled-components'

const LayoutStyles = styled(motion.main)`
  /* overflow-x: hidden; causes weird layout bug*/
  /* padding-top: ${props => props.theme.padding}; */
  position: relative;
  /* min-height: 100vh; */
  /* expands to -webkit-fill-available and -moz-available */
  /* min-height: fill-available;
  min-height: stretch;  */
  min-height: calc(100% - ${props => props.theme.headerHeight});
  @media screen and (min-width: ${props => props.theme.md}px) {
    padding-top: ${props => props.theme.padding};
    min-height: 100%;
  }
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;

  > :first-child {
    /* max-width: ${props => props.theme.md}px; */
    /* margin: 0 auto; */
    overflow-x: hidden;
    padding-left: ${props => props.theme.padding};
    padding-right: ${props => props.theme.padding};

    @media screen and (min-width: ${props => props.theme.md}px) {
      justify-self: center;
      width: ${props => props.theme.md}px;
    }
  }
`

export default LayoutStyles