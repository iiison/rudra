const fs               = require('fs')
const path             = require('path')
const express          = require('express')
const { createServer } = require('http')
const https            = require('https')
const io               = require('socket.io')

const { readFileFromProject } = require('./utils/utils')
const {
  setProjectPath,
  makeValuesGlobal
} = require('./configs/variablesSetter')

const {
  addHomePageEvents,
  addEditorPageEvents
} = require('./src')

setProjectPath('../../git-war-demo')

// Certificates
const key = fs.readFileSync('./certs/key.pem', 'utf8')
const cert = fs.readFileSync('./certs/cert.pem', 'utf8')

const app             = express()
const server          = createServer(app)
const httpsServer     = https.createServer({ key, cert }, app)
const ioServer        = io(server)
const port            = 9000
const httpsServerPort = 9001
const { projPath }    = global

const {
  makeDir,
  makeFile,
  readFile,
  ifFileExists
} = readFileFromProject(projPath, path)

makeValuesGlobal({
  ioServer,
  makeDir,
  makeFile,
  readFile,
  ifFileExists,
}, 'globalUtilFunctions')

app.use(express.static(path.join(__dirname, 'artefacts')))
app.get(
  '/',
  (req, res) => res
    .sendFile(path.join(__dirname, 'artefacts', 'index.html'))
)
app.get('*', (req, res) => res.redirect('/'))

ioServer.on('connection', (client) => {
  addHomePageEvents({ client })
  addEditorPageEvents({ client })

  client.on('disconnect', () => console.log('Connection closed!'))
})

const serveRef = app.listen(
  port,
  '0.0.0.0',
  () => console.log(`HTTP Listening on ${port}!`)
)

const httpsServerRef = app.listen(
  httpsServerPort,
  '0.0.0.0',
  () => console.log(`HTTPS is Listening on ${httpsServerPort}!`)
)

ioServer.attach(serveRef)
ioServer.attach(httpsServerRef)

