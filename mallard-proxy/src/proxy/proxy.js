const http = require('http')
const {MallardProxyEvent, mallardProxyEvents} = require('../events/mallard-proxy-events')
const {findAllClientOptions} = require('../db/mallard-db')


let mallardProxyActive = false
let actual = null, duplicates = []


/**
 * Initializes everything needed for a running mallard proxy:
 *  - actual: the server to which forward requests
 *  - duplicates: list of servers where to send the exact same requests for testing purposes
 *  - mallardProxyActive: state variable to indicate whether or not the proxy is currently running
 */
const initMallardProxy = () => {
    findAllClientOptions()
        .then(clientOptions => {
            const _actual = clientOptions.find(co => co.isActual)?.options
            if (_actual === null) throw new Error('There is no server to forward requests to.')

            const _duplicates = clientOptions.filter(co => !co.isActual).map(co => co.options)
            if (_duplicates.length === 0) console.info('INFO: Starting mallard with no duplicates.')
            else console.info(`INFO: Starting mallard with ${_duplicates.length} duplicates.`)

            actual = _actual
            duplicates = _duplicates
            mallardProxyActive = true
        })
        .catch(err => {
            console.error(err)
            mallardProxyActive = false
        })
}

/**
 * Terminates the mallard proxy by setting mallardProxyActive to false.
 */
const termMallardProxy = () => {
    actual = null
    duplicates = []
    mallardProxyActive = false
}

/**
 * EventEmitter to react to start and end events for the proxy.
 * @type {MallardProxyEvent}
 */
const mallardProxyEvent = new MallardProxyEvent()
mallardProxyEvent.on(mallardProxyEvents.start, initMallardProxy)
mallardProxyEvent.on(mallardProxyEvents.end, termMallardProxy)

/**
 * Creates an http request.
 * @param options parameters for request
 * @param path path to endpoint
 * @param callback function to be called on the request's response
 */
const doRequest = (options, path, callback) => {
    http
        .request({...options, path: path}, res => {
            let response = ''
            res.on('data', chunk => response += chunk)
            res.on('end', () => callback(response))
        })
        .on('error', console.error)
        .end()
}

/**
 * Handles a request to the mallard proxy, duplicates it and then forwards them.
 * @param clientRequest request object
 * @param clientResponse response object
 */
const handleProxyRequest = (clientRequest, clientResponse) => {
    if (!mallardProxyActive) {
        clientResponse.status(503).send('Mallard is currently not available.')
        return
    }

    console.debug(`DEBUG: request '${clientRequest.url}' - actual '${actual.path}' - duplicates '${duplicates.map(d => d.path)}'`)

    doRequest(actual, actual.path + clientRequest.url, res => clientResponse.send(res))
    duplicates.forEach(
        duplicate => doRequest(duplicate, duplicate.path + clientRequest.url, () => {
        })
    )
}

/**
 * TODO: This step will be done by the user via the UI later
 */
mallardProxyEvent.emit(mallardProxyEvents.start)


module.exports = handleProxyRequest