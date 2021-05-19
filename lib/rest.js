const Server = require('@hkube/rest-server');

class RestServer {
    constructor() {
        this._rest = new Server();
        this._server = null;
        this._app = null;
    }

    async init({ port }) {
        this._server = await this._rest.start({
            port
        });
        this._app = this._server.app;
    }

    start(path, checker, name) {
        if (!path) {
            throw new Error('path is required');
        }
        if (!checker) {
            throw new Error('checker is required');
        }

        this._server.app.use(path, (req, res, next) => {
            const check = checker();
            const status = check ? 200 : 500;
            res.status(status);
            res.json({
                name,
                status
            });
            next();
        });
    }

    async initAndStart(options, checker, name) {
        if (!options?.enabled) {
            return;
        }
        await this.init(options);
        const { path } = options;
        this.start(path, checker, name);
    }
}

module.exports = new RestServer();
