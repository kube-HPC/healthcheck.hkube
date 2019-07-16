const EventEmitter = require('events');
const events = require('./events');

const start = (timeout, checker, name) => {
    if (!timeout) {
        throw new Error('timeout is required');
    }
    if (!checker) {
        throw new Error('checker is required');
    }

    const timeoutChecker = () => {
        const eventEmitter = new EventEmitter();
        const id = setInterval(() => {
            const status = checker(timeout);
            if (!status) {
                eventEmitter.emit(events.TIMEOUT, name);
            }
        }, timeout);
        return {
            on: eventEmitter.on.bind(eventEmitter),
            stop: () => {
                clearInterval(id);
            }
        };
    };
    return timeoutChecker();
};

module.exports = {
    start
};
