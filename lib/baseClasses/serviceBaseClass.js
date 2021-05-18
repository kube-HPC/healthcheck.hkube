class HealthcheckImpl {
    constructor() {
        this._lastIntervalTime = null;
    }

    checkHealth(maxDiff) {
        if (!this._lastIntervalTime) {
            return true;
        }
        const diff = Date.now() - this._lastIntervalTime;
        return (diff < maxDiff);
    }

    setHealthy() {
        this._lastIntervalTime = Date.now();
    }
}

module.exports = HealthcheckImpl;
