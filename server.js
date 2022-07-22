const express = require('express')
const app = express()
const port = 443

const fs = require('fs');
const server = require('https').createServer({
    key: fs.readFileSync(__dirname + '/server_withpass.key'),
    cert: fs.readFileSync(__dirname + '/server.crt'),
    passphrase: 'primitive1A'
}, app)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html')
})
app.get('/game.js', (req, res) => {
  res.sendFile(__dirname + '/src/game.js')
})
app.get('/three.min.js', (req, res) => {
  res.sendFile(__dirname + '/lib/three.min.js')
})
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/css/style.css')
})
  


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})