const fs               = require('fs');
const path             = require('path');
const express          = require('express');
const bodyParser       = require('body-parser');
const { createServer } = require('http');
const io               = require('socket.io');
const findFile         = require('./utils/listFiles')

const app      = express();
const server   = createServer(app)
const ioServer = io(server)
const port     = 9000;
const ioPort   = 8000;
const projPath = path.join(__dirname, '../../test')

app.use(express.static(path.join(__dirname, 'artefacts')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'artefacts', 'index.html')));
app.get('*', (req, res) => res.redirect('/'));

ioServer.on('connection', client => {
  client.on('event', data => {
    console.log(data)
  });

  client.on('openFile', async data => {
    const filteredFiles = await findFile(projPath, data.file)

    console.log('*****************************')
    console.log('openFile', filteredFiles)
    console.log('*****************************')

    ioServer.emit('openFile', { filteredFiles, file : data.file })
  });

  client.on('renderFile', data => {
    const fileContent = fs.readFileSync(data.fileName, 'utf8')

    ioServer.emit('renderFile', { fileContent, ...data })
  })

  client.on('addNewItem', data => {
    const {
      line,
      type,
      name,
      file
    } = data
    const parsedLine = parseInt(line) - 1

    const fileContent = fs.readFileSync(file, 'utf8')
    const fileContentByLine = fileContent.split(/\r?\n/)
    const firstPart = fileContentByLine.slice(0, parsedLine)
    const lastPart = fileContentByLine.slice(parsedLine)
    const newPart = `const ${name} = 23`

    console.log('-----------------------------')
    console.log(parsedLine)
    console.log(fileContentByLine[parsedLine])
    console.log('-----------------------------')

    ioServer.emit('addNewVariable', {
      ...data,
      fileContent : [
        ...firstPart,
        newPart,
        ...lastPart
      ].join('\n')
    })
  })

  client.on('disconnect', client => {
    console.log('Connection closed!')
  });
});

const serveRef = app.listen(port, () => console.log(`Listening on ${port}!`));
// ioServer.listen(ioPort, () => console.log(`IO is listening on ${ioPort}!`));
ioServer.listen(serveRef);

