import React, { useState, useEffect } from 'react';
import { useDispatch }                from 'react-redux';
import { useLocation, useHistory }    from 'react-router-dom'
import annyang                        from 'annyang'

import { socket } from '../../index'
import { setQueryResults } from '../../redux/modules/home/home'

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
  pathname,
  filteredFiles, 
  setSelectedFile
}) {
  const fileExtensionElementMap = {
    js      : <i class='fab fa-js-square'></i>,
    css     : <i class='fab fa-css3-alt'></i>,
    tpl     : <i class='fab fa-html5'></i>,
    html    : <i class='fab fa-html5'></i>,
    jsx     : <i class='fab fa-react'></i>,
    default : <i class='fas fa-code'></i>,
  }
  return filteredFiles.map((fileName, index) => {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
    const iconElement = fileExtensionElementMap[extension] || fileExtensionElementMap.default

    return (
      <p onClick={() => renderFile({ index, file, push })} className='file-item'>
        {iconElement} {fileName}
      </p>
    )
  })
}

function goHome(path, push) {
  push('/')
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
      goHome(location.pathname, history.push)
      setMessage('Hey Man! Let\'s do this thing!');
    },

    'search for file *file' : (file) => {
      goHome(location.pathname, history.push)
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

/*
 <pre className='line-numbers'>
  <code className='language-js'>
    {renderedContent}
  </code>
</pre>
*/

