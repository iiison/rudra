import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector }   from 'react-redux';
import Prism                          from 'prismjs'
import { useParams }                  from 'react-router-dom'
import annyang                        from 'annyang'

import { socket } from '../../index'

import { setNotificationContent, toggleContext } from '../../redux/modules/wrapper/wrapper'

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
  dispatch,
  selectedFilePath,
  setCursorPosition,
  setRenderedContent
}){
  window.Ace = AceEditor
  const commands = {
    'add variable at line number :line' : (line, name) => {
      socket.emit('addNewItem', {
        line,
        name,
        type : 'variable',
        file : selectedFilePath
      })
    },

    'add function at line number :line' : (line, name) => {
      socket.emit('addNewItem', {
        line,
        name,
        type : 'function',
        file : selectedFilePath
      })
    },

    'import library *libraryName' : (libraryName) => {
      socket.emit('import operation', {
        name      : libraryName,
        file      : selectedFilePath,
        operation : 'library import'
      })
    },

    'import file *fileName' : (fileName) => {
      socket.emit('import operation', {
        name      : fileName,
        file      : selectedFilePath,
        operation : 'file import'
      })
    },
    
    'import file from *fileName' : (fileName) => {
      socket.emit('import operation', {
        name      : fileName,
        file      : selectedFilePath,
        operation : 'file import'
      })
    }
  }

  socket.on('renderFile', (data = {}) => {
    const { fileContent, cursorPosition = 1 } = data

    setCursorPosition(cursorPosition)
    setRenderedContent(fileContent)
  })

  socket.on('add new content', (data = {}) => {
    const { fileContent } = data

    setRenderedContent(fileContent)
  })

  socket.on('import operation', (data = {}) => {
    const {
      operation,
      query,
      operationOn,
      suggestions : options
    } = data

    if (operation && operation === 'show suggestions') {
      const title = options.length
        ? 'Choose one:'
        : `Not found.`

      console.log('*******************')
      console.log(options)
      console.log('*******************')

      dispatch(setNotificationContent({
        title,
        options,
        event   : ({ active, options }) => {
          socket.emit('import operation', {
            ...query,
            imortItem : active,
            operation : `${operationOn} import confirmation`
          })
        }
      }))
      dispatch(toggleContext())
    }
  })

  annyang.addCommands(commands)
}

export default function Editor() {
  const [ renderedContent, setRenderedContent ] = useState('')
  const [ cursorPosition, setCursorPosition ] = useState(1)
  const { files } = useSelector(state => state.home)
  const { index } = useParams()
  const dispatch = useDispatch()

  const selectedFilePath = files[index]

  useEffect(() => setupPage({
    dispatch,
    selectedFilePath,
    setCursorPosition,
    setRenderedContent
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
              fontSize={14}
              theme='monokai'
              mode='javascript'
              name={selectedFilePath}
              value={renderedContent}
              height='calc(100vh - 62px)'
              cursorStart={cursorPosition}
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

