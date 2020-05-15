import React, { useState, useEffect } from 'react';
import Prism                          from 'prismjs'
import { useSelector }                from 'react-redux';
import { useParams }                  from 'react-router-dom'
import annyang                     from 'annyang'

import { socket } from '../../index'

// react-ace deps
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

import monk from '../home/images/monk.png'
import './styles.css'

import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'

function setupPage({
  setRenderedContent,
  selectedFilePath
}){
  const commands = {
    'add variable at line number :line with name *name' : (line, name) => {
      socket.emit('addNewItem', {
        line,
        name,
        type : 'variable',
        file : selectedFilePath
      })
    }
  }

  socket.on('renderFile', (data = {}) => {
    const { fileContent } = data

    setRenderedContent(fileContent)

    // if (filteredFiles && filteredFiles.length) {
    //   setMessage(`I found ${filteredFiles.length} files:`)
    //   setFiles(formatFileNames({ filteredFiles, setSelectedFile }))
    // } else {
    //   setMessage(`I couldn't find any file with this name: ${file}.`)
    //   setFiles([])
    // }
  })

  socket.on('addNewVariable', (data = {}) => {
    const { fileContent } = data

    setRenderedContent(fileContent)
  })

  annyang.addCommands(commands)
}

export default function Editor() {
  window.pr = Prism
  const [ renderedContent, setRenderedContent ] = useState('')
  const { files } = useSelector(state => state.home)
  const { index } = useParams()

  const selectedFilePath = files[index]

  useEffect(() => setupPage({
    setRenderedContent,
    selectedFilePath
  }), [])

  useEffect(() => socket.emit('renderFile', {
    operation : 'render',
    fileName : selectedFilePath
  }), [])

  useEffect(() => () => Prism.highlightAll(), [renderedContent])

  return (
    <div className='editor-cont'>
      <header className='editor-header'>
        <img className='small-monk' src={monk} alt='logo' />
        <h1>Rudra</h1>
      </header>
      <div className='editor'>
        {
          renderedContent && (
            <AceEditor
              tabSize={2}
              width='auto'
              height='calc(100vh - 62px)'
              fontSize={14}
              theme='monokai'
              mode='javascript'
              name={selectedFilePath}
              value={renderedContent}
              enableLiveAutocompletion={true}
              editorProps={{ $blockScrolling: true }}
              onChange={code => setRenderedContent(code)}
            />
          )
        }
      </div>
    </div>
  )
}

