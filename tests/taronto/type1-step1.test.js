const expect = require('chai').expect;
const Farmer = require('../CrawlerFake');
const options = require('./options');
const { step1 } = options;
describe('Farmer', async () => {
    console.log('Start');
    it('test', async () => {
        const farmer = new Farmer(step1[0]);
        const rices = await farmer.runGetInfo();
        console.log('rices', rices)
        expect(rices).to.be.true;
    });

});