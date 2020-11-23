import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ErrorStyles = styled.div`
  
`

function ErrorMessage(props) {
  return (
    <ErrorStyles>
      <h1>{props.title}</h1>
      <p>{props.error && props.error.message ? props.error.message : props.defaultMessage}</p>
    </ErrorStyles>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  defaultMessage: PropTypes.string.isRequired
}

ErrorMessage.defaultProps = {
  title: `Something went wrong :/`,
  defaultMessage: `Please try again.`
}

export default ErrorMessage