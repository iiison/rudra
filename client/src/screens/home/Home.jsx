import React, { useState, useEffect } from 'react';
import { useDispatch }                from 'react-redux';
import { useLocation, useHistory }    from 'react-router-dom'
import annyang                        from 'annyang'

import { socket } from '../../index'
import { setQueryResults } from '../../redux/modules/home/home'
import Input from '../components/input/input'

// react-simple-code-editor Deps
// import Editor                         from 'react-simple-code-editor';
// import { highlight, languages }       from 'prismjs/components/prism-core'

import monk from './images/monk.png'
import './App.css';

// const socket = io();

function renderFile({ index, file, push }) {
  push(`/explore/${file}/${index}`)
}

function formatFileNames({ 
  push,
  file,
  event,
  pathname,
  filteredFiles, 
  setSelectedFile,
  isDirectory = false
}) {
  const fileExtensionElementMap = {
    js        : <i class='fab fa-js-square'></i>,
    css       : <i class='fab fa-css3-alt'></i>,
    tpl       : <i class='fab fa-html5'></i>,
    html      : <i class='fab fa-html5'></i>,
    jsx       : <i class='fab fa-react'></i>,
    default   : <i class='fas fa-code'></i>,
    directory : <i class="fas fa-folder-open"></i>
  }
  return filteredFiles.map((fileName, index) => {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
    let iconElement

    if (!isDirectory) {
      iconElement = fileExtensionElementMap[extension] || fileExtensionElementMap.default
    } else {
      iconElement = fileExtensionElementMap.directory
    }

    const handleClick = !isDirectory ? () => renderFile({ index, file, push }) : null

    return (
      <p onClick={handleClick} className='file-item'>
        {iconElement} <span className='file-name'>{fileName}</span>
        {isDirectory && <Input placeholder='Directory Name' returnData={{fileName}} event={event} />}
      </p>
    )
  })
}

function setupAnnyang({
  history,
  location,
  dispatch,
  setFiles,
  setMessage,
  setSelectedFile
}) {
  const commands = {
    'hello' : () => {
      annyang.trigger('go home')

      setMessage('Hey Man! Let\'s do this thing!');
      setFiles([])
    },

    'search for file *file' : (file) => {
      annyang.trigger('go home')
      setMessage(`open ${file}`)

      socket.emit('openFile', {
        operation : 'open',
        file : `${file.replace(/\s/g, '')}`.toLowerCase()
      });
    },

    'select :fileIndex file' : (fileIndex) => {
      setMessage(`Selected ${fileIndex}`)

      // socket.emit('openFile', {
      //   operation : 'open',
      //   file : `${file.replace(/\s/g, '')}`.toLowerCase()
      // })
    },

    'make new directory at *path' : (path) => {
      socket.emit('make directory', {
        path      : `${path.replace(/\s/g, '')}`.toLowerCase(),
        operation : 'list directory'
      })
    },

    'make new file at *path' : (path) => {
      socket.emit('make file', {
        path      : `${path.replace(/\s/g, '')}`.toLowerCase(),
        operation : 'list directory'
      })
    }
  }

  socket.on('openFile', (data = {}) => {
    const { filteredFiles, file } = data
    const { push } = history
    const { pathname } = location

    if (filteredFiles && filteredFiles.length) {
      setMessage(`I found ${filteredFiles.length} files:`)
      setFiles(formatFileNames({ filteredFiles, setSelectedFile, push, pathname, file }))
      dispatch(setQueryResults(filteredFiles))
    } else {
      setMessage(`I couldn't find any file with this name: ${file}.`)
      setFiles([])
    }

    console.log(data)
  })

  socket.on('list directory', (data = {}) => {
    annyang.trigger('go home')

    const { filteredDirs, path, listFor } = data
    const { push } = history
    const { pathname } = location

    if (filteredDirs && filteredDirs.length) {
      setMessage(`I found ${filteredDirs.length} directories:`)
      setFiles(formatFileNames({
        push,
        pathname,
        setSelectedFile,
        file          : path,
        isDirectory   : true,
        filteredFiles : filteredDirs,
        event         : ({ value, fileName }) => {
          socket.emit(`make ${listFor}`, {
            operation : `create ${listFor}`,
            dirName   : `${fileName}${value}`
          });
          setMessage(`Making new ${listFor} '${value}'...`)
        }
      }))

      dispatch(setQueryResults(filteredDirs))
    } else {
      setMessage(`I couldn't find any directories with this name: ${path}.`)
      setFiles([])
    }
  })

  socket.on('create directory status', ({ exceptions, dirName }) => {
    if (!exceptions) {
      setMessage(`Created new directory at ${dirName}.`)
    } else {
      setMessage(`Error occured: ${exceptions}`)
    }

    setFiles([])
  })

  annyang.addCommands(commands)
}

function App() {
  const [ files, setFiles ] = useState([])
  const [ message, setMessage ] = useState('Ask something to Rudra...')

  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()

  useEffect(() => setupAnnyang({
    setMessage,
    setFiles,
    dispatch,
    location,
    history
  }), [])

  return (
    <div className='App'>
      <header className='App-header'>
        <img className='monk App-logo' src={monk} alt='logo' />
        <p>
          {message}
          <div className='t-left'>
            {files.length > 0 && files}
          </div>
        </p>
      </header>
    </div>
  );
}

export default App;

