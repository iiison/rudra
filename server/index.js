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

ioServer.on('connection', client => {
  client.on('event', data => {
    console.log(data)
  });

  client.on('openFile', async data => {
    const filteredFiles = await findFile(projPath, data.file)

    console.log('*****************************')
    console.log('openFile', filteredFiles)
    console.log('*****************************')

    ioServer.emit('openFile', { filteredFiles })
  })

  client.on('disconnect', client => {
    console.log('Connection closed!')
  });
});

const serveRef = app.listen(port, () => console.log(`Listening on ${port}!`));
// ioServer.listen(ioPort, () => console.log(`IO is listening on ${ioPort}!`));
ioServer.listen(serveRef);

