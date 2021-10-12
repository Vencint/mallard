const express = require('express')
const app = express()
const port = 6448

app.get('/v1/test1', ((req, res) => {
    console.info('INFO: called v1')
    res.send('v1')
}))

app.get('/v2/test1', ((req, res) => {
    console.info('INFO: called v2')
    res.send('v2')
}))

app.listen(port)