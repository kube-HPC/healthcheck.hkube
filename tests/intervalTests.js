const { expect } = require('chai');
const { interval, events } = require('../index')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Interval', () => {
    it('should throw if no timeout', () => {
        expect(() => interval.start()).to.throw('timeout is required');
    });
    it('should throw if no checker', () => {
        expect(() => interval.start(2000)).to.throw('checker is required');
    });

    it('should timeout ', (done) => {
        const test = interval.start(1000, () => false, 'test1');
        test.on(events.TIMEOUT,(name)=>{
            expect(name).to.eql('test1');
            test.stop()
            done()
        })

    });

    it('should not timeout ', async () => {
        const test = interval.start(1000, () => true, 'test1');
        test.on(events.TIMEOUT,(name)=>{
            expect.fail();
        })
        await delay(2000);
    }).timeout(3000);
});