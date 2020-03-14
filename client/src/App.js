import React, { useState, useEffect } from 'react';
import io                             from 'socket.io-client'
import annyang                        from 'annyang'

import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import './App.css';

function formatFileNames({ filteredFiles, setSelectedFile }) {
  const fileExtensionElementMap = {
    js      : <i class="fab fa-js-square"></i>,
    css     : <i class="fab fa-css3-alt"></i>,
    tpl     : <i class="fab fa-html5"></i>,
    html    : <i class="fab fa-html5"></i>,
    jsx     : <i class="fab fa-react"></i>,
    default : <i class="fas fa-code"></i>,
  }
  return filteredFiles.map((fileName) => {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
    const iconElement = fileExtensionElementMap[extension] || fileExtensionElementMap.default

    return (
      <p onClick={setSelectedFile(fileName)} className='file-item'>
        {iconElement} {fileName}
      </p>
    )
  })
}

function setupAnnyang({ setMessage, setFiles, setSelectedFile }) {
  const socket = io();

  const commands = {
    'hello' : () => {
      console.log('Hey Man! Let\'s do this thing!');
      setMessage('Hey Man! Let\'s do this thing!');
    },

    'open *file' : (file) => {
      setMessage(`open ${file}`)

      console.log('*****************************')
      console.log(file)
      console.log('*****************************')

      socket.emit('openFile', {
        operation : 'open',
        file : `${file.replace(/\s/g, '')}`.toLowerCase()
      })
    },
    'select :fileIndex file' : (fileIndex) => {
      setMessage(`Selected ${fileIndex}`)

      console.log('*****************************')
      console.log(fileIndex)
      console.log('*****************************')

      // socket.emit('openFile', {
      //   operation : 'open',
      //   file : `${file.replace(/\s/g, '')}`.toLowerCase()
      // })
    }
  }

  socket.on('openFile', (data = {}) => {
    const { filteredFiles, file } = data
    if (filteredFiles && filteredFiles.length) {
      setMessage(`I found ${filteredFiles.length} files:`)
      setFiles(formatFileNames({ filteredFiles, setSelectedFile }))
    } else {
      setMessage(`I couldn't find any file with this name: ${file}.`)
      setFiles([])
    }

    console.log(data)
  })

  annyang.addCommands(commands)
  annyang.setLanguage('en-IN')
  annyang.start()
}

function App() {
  const [ message, setMessage ] = useState('Say something...')
  const [ files, setFiles ] = useState([])
  const [ selectedFile, setSelectedFile ] = useState([])

  useEffect(() => setupAnnyang({
    setSelectedFile,
    setMessage,
    setFiles
  }), [])
  useEffect(() => setFiles(files), [files])

  return (
    <div className="App">
      <header className="App-header">
        <i class="fab fa-react"></i>
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

