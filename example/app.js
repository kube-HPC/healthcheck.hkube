const { rest } = require('../index');

const main = async () => {
    await rest.init({ port: 9999 });
    rest.start('/true', () => true, 'true');
    rest.start('/false', () => false, 'false');
};
main();
