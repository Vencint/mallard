const express = require('express')
const app = express()
const port = process.env.MALLARD_PORT || 6338

const handleProxyRequest = require('./src/proxy/proxy')


app.all('/**', handleProxyRequest)


app.listen(port, () => {
    console.info(`INFO: Mallard is listening on localhost:${port}`)
})
