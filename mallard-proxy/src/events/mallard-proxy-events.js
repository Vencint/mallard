const EventEmitter = require('events')

class MallardProxyEvent extends EventEmitter {}

module.exports = {
    MallardProxyEvent,
    mallardProxyEvents: {
        start: 'start',
        end: 'end'
    }
}