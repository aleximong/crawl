module.exports = {

    step1: [{
        maxConcurrent: 1,
        rateLimit: 2000,
        url: 'http://www.taroto.jp/',
        level: '1',
        code: 'taroto',
        prefix: '001',
        parentId: 1,
        type: 'list',
        useFarmer: true,
        getLinks: [{ name: 'link', get: 'href', nodes: [{ selector: '.r-side', type: 'all' }, { selector: 'a', type: 'childrens' }] }],
        getDetails: [],
    }]
}