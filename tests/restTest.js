const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
let chaiHttp = require('chai-http');
const { promisify } = require('util');
const uid = require('@hkube/uid');
const delay = promisify(setTimeout);

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const { rest, baseClasses } = require('../index')

describe('rest', () => {
    describe('api test', () => {
        before(async () => {
            await rest.init({ port: 9999 });
        });
        it('should throw if no path', () => {
            expect(() => rest.start()).to.throw('path is required');
        });
        it('should throw if no checker', async () => {
            expect(() => rest.start('/foo')).to.throw('checker is required');
        });
        it('should create path', async () => {
            rest.start('/true', () => true, 'true')
            const res = await chai.request(rest._app).get('/true')
            expect(res).to.have.status(200);
        });
        it('should work with two paths', async () => {
            rest.start('/true', () => true, 'true')
            rest.start('/false', () => false, 'false')
            const res1 = await chai.request(rest._app).get('/true')
            expect(res1).to.have.status(200);
            const res2 = await chai.request(rest._app).get('/false')
            expect(res2).to.have.status(500);
        });
        it('should work with HealthcheckImpl', async () => {
            const healthChecker = new baseClasses.HealthcheckImpl();
            rest.start('/HealthcheckImpl', () => healthChecker.checkHealth(500), 'true')
            let res = await chai.request(rest._app).get('/HealthcheckImpl')
            expect(res).to.have.status(200);
            healthChecker.setHealthy();
            await delay(1000);
            res = await chai.request(rest._app).get('/HealthcheckImpl')
            expect(res).to.have.status(500);
            healthChecker.setHealthy();
            await delay(200);
            res = await chai.request(rest._app).get('/HealthcheckImpl')
            expect(res).to.have.status(200);
            await delay(1000);
            res = await chai.request(rest._app).get('/HealthcheckImpl')
            expect(res).to.have.status(500);
        }).timeout(5000);
    });
    describe('init and start tests', () => {
        beforeEach(()=>{
            rest._app=null;
        })
        it('should init and start', async () => {
            const options = { path: `/${uid.randomString(5)}`, port: 9998, enabled: true };
            await rest.initAndStart(options, () => true, 'true')
            expect(rest._app).to.exist;
            const res = await chai.request(rest._app).get(options.path)
            expect(res).to.have.status(200);
        });
        it('should not init when not enabled', async () => {
            const options = { path: `/${uid.randomString(5)}`, port: 9998, enabled: false };
            await rest.initAndStart(options, () => true, 'true');
            expect(rest._app).to.not.exist;
        });
        it('should not init with no options', async () => {
            await rest.initAndStart(null, () => true, 'true')
            expect(rest._app).to.not.exist;
        });
    });
});