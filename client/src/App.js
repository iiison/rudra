import React, { useState, useEffect } from 'react';
import io                             from 'socket.io-client'
import annyang                        from 'annyang'

import './App.css';

function setupAnnyang(setMessage) {
  const socket = io();

  const commands = {
    'hello' : () => {
      console.log('Hey Man');
      setMessage('Hey Man!');
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
    const { filteredFiles } = data
    if (filteredFiles && filteredFiles.length) {
      setMessage(`I found ${filteredFiles.length} files:`)
    }

    console.log(data)
  })

  annyang.addCommands(commands)
  annyang.setLanguage('en-IN')
  annyang.start()
}

function App() {
  const [ message, setMessage ] = useState('Say something...')

  useEffect(() => setupAnnyang(setMessage), [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
