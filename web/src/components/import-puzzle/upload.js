import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import Button, { ButtonRow } from '../../styles/button'
import { validateData } from '../../util/puzzle-representation'
import { Upload } from '../icons'

const UploadWrapper = styled.div`
  
`

const UploadButton = styled(Button)`
  ${props => props.isDragActive && `
    color: ${props.theme.actionHoverColor};
    border-color: ${props.theme.actionHoverBackground};
    background-color: ${props.theme.actionHoverBackground};
  `}
`;

function UploadPuzzle(props) {

  const [error, setError] = useState(null)

  const onDropAccepted = useCallback(acceptedFiles => {
    if (!acceptedFiles || acceptedFiles.length < 1) return

    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsText(file, "UTF-8")
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          const [valid, msg] = validateData(data)
          if (!valid) {
            setError(msg)
          } else {
            props.setData(data)
          }
        } catch (error) {
          setError(`Failed to parse the puzzle file.`)
        }
      }
      reader.onerror = (event) => {
        setError(`Failed to read the puzzle file. Please try again.`)
      }
    }
  }, [])

  const onDropRejected = useCallback(rejectedFiles => {
    setError(`Only .json, .txt, .kurodoko and .ohno files are accepted.`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/json, text/plain, .kurodoko, .ohno',
    multiple: false,
    onDropAccepted,
    onDropRejected,
  })

  return (
    <UploadWrapper>
      <h2>{error ? error : `Upload or drop file`}</h2>
      <ButtonRow>
        <UploadButton {...getRootProps({ isDragActive, primary: true })}>
          <input {...getInputProps()} />
          <Upload />
        </UploadButton>
      </ButtonRow>
    </UploadWrapper>
  )
}

UploadPuzzle.propTypes = {
  setData: PropTypes.func.isRequired
}

export default UploadPuzzle