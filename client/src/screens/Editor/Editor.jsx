import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector }   from 'react-redux';
import Prism                          from 'prismjs'
import { useParams }                  from 'react-router-dom'
import annyang                        from 'annyang'

import { socket } from '../../index'
import LintErrorTemplate from './LintErrorTemplate'

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

    'add react class component' : (name) => {
      socket.emit('addNewItem', {
        name,
        changeType : 'file',
        type       : 'reactClassComponent',
        file       : selectedFilePath
      })
    },

    'add react function component' : (name) => {
      socket.emit('addNewItem', {
        name,
        changeType : 'file',
        type       : 'reactFunctionComponent',
        file       : selectedFilePath
      })
    },

    'add state hook at line number *line' : (line) => {
      socket.emit('addNewItem', {
        line,
        type : 'reactStateHook',
        file : selectedFilePath
      })
    },

    'add use effect at line number *line' : (line) => {
      socket.emit('addNewItem', {
        line,
        type : 'reactUseEffectHook',
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
    const { fileContent, line = 1 } = data
    const parsedLineNumber = parseInt(line, 10)

    setRenderedContent(fileContent)
    setCursorPosition(parsedLineNumber)
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

  socket.on('show context', ({ type, data } = {}) => {
    const {
      meta,
      errors
    } = data
    const title = `Lint: ${meta.errorCount} Errors, ${meta.warningCount} Warnings`
    const allErrors = [...errors.errors, ...errors.warnings].map(error => {
      error.key = error.message

      return error
    })

    dispatch(setNotificationContent({
      type,
      title,
      options  : allErrors,
      template : LintErrorTemplate,
      event    : ({ active, options }) => console.log(active, options)
    }))
    dispatch(toggleContext(true))
  })

  annyang.addCommands(commands)
}

function handleEditorChange({ setwasCodeEdited, code, setRenderedContent }) {
  setRenderedContent(code)
  setwasCodeEdited(true)
}

function handleManualCodeSave(file, content, setwasCodeEdited) {
  socket.emit('save content', {
    file,
    content,
  })

  setwasCodeEdited(false)
}

export default function Editor() {
  const [ renderedContent, setRenderedContent ] = useState('')
  const [ wasCodeEdited, setwasCodeEdited ] = useState(false)
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

  useEffect(() => () => {
    Prism.highlightAll()
    annyang.removeCommands(['save contents'])
    annyang.addCommands({
      'save contents' : () => handleManualCodeSave(selectedFilePath, renderedContent, setwasCodeEdited)
    })
  }, [renderedContent, selectedFilePath])

  return (
    <div className='editor-cont'>
      <header className='editor-header'>
        <img className='small-monk' src={monk} alt='logo' />
        <h1>Rudra</h1>
        {
          wasCodeEdited && (
            <div
              className='editor-save'
              onClick={() => handleManualCodeSave(selectedFilePath, renderedContent, setwasCodeEdited)}
            >Save</div>
          )
        }
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
              editorProps={{ $blockScrolling: true }}
              onChange={code => handleEditorChange({ code, setRenderedContent, setwasCodeEdited })}
            />
          )
        }
      </div>
    </div>
  )
}

