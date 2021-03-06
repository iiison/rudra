import React, { useState, useEffect } from 'react';
import io                             from 'socket.io-client'
import annyang                        from 'annyang'
import Prism                          from 'prismjs'
import { useSelector }                from 'react-redux';

// react-simple-code-editor Deps
// import Editor                         from 'react-simple-code-editor';
// import { highlight, languages }       from 'prismjs/components/prism-core'

// react-ace deps
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import monk from './monk.png'

import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import './App.css';

const socket = io();

function renderFile({ setSelectedFile, fileName }) {
  setSelectedFile(fileName)

  socket.emit('renderFile', {
    operation : 'render',
    fileName
  })
}

function formatFileNames({ filteredFiles, setSelectedFile }) {
  const fileExtensionElementMap = {
    js      : <i class='fab fa-js-square'></i>,
    css     : <i class='fab fa-css3-alt'></i>,
    tpl     : <i class='fab fa-html5'></i>,
    html    : <i class='fab fa-html5'></i>,
    jsx     : <i class='fab fa-react'></i>,
    default : <i class='fas fa-code'></i>,
  }
  return filteredFiles.map((fileName) => {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
    const iconElement = fileExtensionElementMap[extension] || fileExtensionElementMap.default

    return (
      <p onClick={() => renderFile({ setSelectedFile, fileName })} className='file-item'>
        {iconElement} {fileName}
      </p>
    )
  })
}

function setupAnnyang({ setMessage, setFiles, setSelectedFile, setRenderedContent }) {
  const commands = {
    'hello' : () => {
      console.log('Hey Man! Let\'s do this thing!');
      setMessage('Hey Man! Let\'s do this thing!');
    },

    'search for file *file' : (file) => {
      setMessage(`open ${file}`)

      socket.emit('openFile', {
        operation : 'open',
        file : `${file.replace(/\s/g, '')}`.toLowerCase()
      })
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
    if (filteredFiles && filteredFiles.length) {
      setMessage(`I found ${filteredFiles.length} files:`)
      setFiles(formatFileNames({ filteredFiles, setSelectedFile }))
    } else {
      setMessage(`I couldn't find any file with this name: ${file}.`)
      setFiles([])
    }

    console.log(data)
  })

  socket.on('renderFile', (data = {}) => {
    const { fileContent, fileName } = data

    setMessage(`${fileName}: `)
    setRenderedContent(fileContent)
    // if (filteredFiles && filteredFiles.length) {
    //   setMessage(`I found ${filteredFiles.length} files:`)
    //   setFiles(formatFileNames({ filteredFiles, setSelectedFile }))
    // } else {
    //   setMessage(`I couldn't find any file with this name: ${file}.`)
    //   setFiles([])
    // }

    console.log(data)
  })

  // Temp, only for testing
  window.a = annyang

  annyang.addCommands(commands)
  annyang.setLanguage('en-IN')
  annyang.start()
}

function App() {
  const [ files, setFiles ] = useState([])
  const [ selectedFile, setSelectedFile ] = useState([])
  const [ message, setMessage ] = useState('Ask something to Rudra...')
  const [ renderedContent, setRenderedContent ] = useState('')
  const test = useSelector(state => state.test)

  console.log('*****************************')
  console.log(test)
  console.log('*****************************')

  useEffect(() => setupAnnyang({
    setRenderedContent,
    setSelectedFile,
    setMessage,
    setFiles
  }), [])

  useEffect(() => () => Prism.highlightAll(), [renderedContent])
  window.pr = Prism

  return (
    <div className='App'>
      <header className='App-header'>
        <img className='monk App-logo' src={monk} alt='logo' />
        <p>
          {message}
          <div className='t-left'>
            {files.length > 0 && files}
          </div>
          {
            renderedContent && (
              <AceEditor
                tabSize={2}
                width='auto'
                fontSize={18}
                theme="monokai"
                mode="javascript"
                name={selectedFile}
                value={renderedContent}
                enableLiveAutocompletion={true}
                editorProps={{ $blockScrolling: true }}
                onChange={code => setRenderedContent(code)}
              />
            )
          }
        </p>
      </header>
    </div>
  );
}

export default App;

/*
 <pre className="line-numbers">
  <code className="language-js">
    {renderedContent}
  </code>
</pre>
*/

