const chai = require('chai');
const { expect } = chai;
const chaiAsPromised = require('chai-as-promised');
let chaiHttp = require('chai-http');

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const { rest, events } = require('../index')

describe('rest', () => {
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
});