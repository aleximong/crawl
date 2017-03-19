const code = 'A00';
const options1 = {
    site: 'taroto',
    isProxy: false,
    maxConnection: 10,
    rateLimit: 2000,
    url: 'http://www.taroto.jp/',
    settings: {
        isCreateUpdate: true,
        beginLevel: 0,
        amount: 3,
    },
    querys: {
        number: 3,
        levels: [
            {
                level: 1,
                prefix: 'taroto',
                code: code,
                rootUrl: 'http://www.taroto.jp/sitemap.xml',
                //rootUrl: 'http://localhost:8000/taroto/xml.html',
                type: 'list',
                getLinks: []
            },
            {
                level: 2,
                prefix: 'taroto',
                code: code,
                type: 'mix',
                useFarmer: true,
                getLinks: [{ name: 'link', get: 'text', nodes: [{ selector: 'loc', type: 'all' }] }],
                getDetails: []
            },
            {
                level: 3,
                prefix: 'taroto',
                code: code,
                type: 'item',
                useFarmer: true,
                getLinks: [],
                getDetails: [{
                    name: 'category_path',
                    get: 'text',
                    nodes: [{ type: 'all', selector: '.crumbsList', }]
                }, {
                    name: 'category_name',
                    get: 'text',
                    nodes: [{ type: 'all', selector: 'h2.category', }]
                }],

                getItems: [{
                    name: 'product_name',
                    get: 'text',
                    nodes: [{ type: 'all', selector: '.syouhin', }]
                },
                {
                    name: 'product_namefull',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.Item_Name' }]
                },
                {
                    name: 'product_code',
                    get: 'text',
                    nodes: [{ type: 'all', selector: '.Item_Id' }]
                },
                {
                    name: 'product_amount',
                    get: 'value',
                    nodes: [{ type: 'all', selector: 'input[name="F_item_num"]' }]
                },
                {
                    name: 'product_details',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.syousai01' }]
                },
                {
                    name: 'product_pricing',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.Item_Price' }]
                }
                ],
            },
        ]
    },
}

const options2 = {
    site: 'denzai-net',
    loadImage: false,
    timeout: 10000,
    isProxy: false,
    maxConcurrent: 10,
    rateLimit: 3000,
    url: 'https://www.denzai-net.jp/',
    settings: {
        isCreateUpdate: true,
        beginLevel: 0,
        amount: 3,
    },
    querys: {
        number: 3,
        levels: [
            {
                level: 1,
                prefix: 'denzai',
                code: code,
                type: 'list',
                rootUrl: 'http://www.denzai-net.jp/page_system/mod_itemlist.php?&page=',
                useFarmer: true,
            },
            {
                level: 2,
                prefix: 'denzai',
                code: code,
                type: 'list',
                useFarmer: true,

                getLinks: [{ name: 'linkPage', get: 'text', nodes: [{ selector: '.gaitou .kensu span.red', type: 'all' }] }],

                getDetails: [],
                getItems: [{
                    name: 'product_details',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.item_listA form', }]
                },
                {
                    name: 'product_namefull',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.Item_Name' }]
                },
                {
                    name: 'product_code',
                    get: 'text',
                    nodes: [{ type: 'all', selector: '.Item_Id' }]
                },
                {
                    name: 'product_amount',
                    get: 'value',
                    nodes: [{ type: 'all', selector: 'input[name="F_item_num"]' }]
                },
                {
                    name: 'product_pricing',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.Item_Price' }]
                }
                ],
            },
            {
                level: 3,
                prefix: 'denzai',
                code: code,
                type: 'item',
                useFarmer: true,
                getLinks: [],
                getDetails: [{ name: 'product', get: 'html', nodes: [{ type: 'all', selector: '.item_listA form' }] }],
                getItems: [
                    {
                        name: 'product_url',
                        get: 'value',
                        nodes: [{ type: 'all', selector: 'input[name="item_url"]', }]
                    },
                    {
                        name: 'product_image',
                        get: 'src',
                        nodes: [{ type: 'all', selector: '.dt_img img', }]
                    },
                    {
                        name: 'product_category',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'table td', }, { type: 'eq', selector: '3', }]
                    },
                    {
                        name: 'product_name',
                        get: 'value',
                        nodes: [{ type: 'all', selector: 'input[name="shohin"]', }]
                    },
                    {
                        name: 'product_namefull',
                        get: 'value',
                        nodes: [{ type: 'all', selector: 'input[name="name"]' }]
                    },
                    {
                        name: 'product_code',
                        get: 'value',
                        nodes: [{ type: 'all', selector: 'input[name="code"]' }]
                    },
                    {
                        name: 'product_amount',
                        get: 'value',
                        nodes: [{ type: 'all', selector: 'input[name="kazu"]' }]
                    },
                    {
                        name: 'product_pricing',
                        get: 'value',
                        nodes: [{ type: 'all', selector: 'input[name="price"]', }]
                    },
                    {
                        name: 'product_details',
                        get: 'html',
                        nodes: [{ type: 'all', selector: 'table' }]
                    },

                ],
            },

        ]
    },
}

const options3 = {
    site: 'panasonic',
    isProxy: false,
    maxConnection: 10,
    rateLimit: 2000,
    url: 'http://www2.panasonic.biz',
    settings: {
        isCreateUpdate: true,
        beginLevel: 0,
        amount: 7,
    },

    querys: {
        number: 7,
        levels: [
            { level: 1, prefix: 'panasonic', code: code, rootUrl: 'http://www2.panasonic.biz/es/ai/products/search/category/index.jsp', type: 'list', node: [] },
            {
                level: 2,
                prefix: 'panasonic',
                code: code,
                type: 'list',
                useFarmer: true,
                getLinks: [{ name: 'link', get: 'href', nodes: [{ selector: '.section a', type: 'all' }], }],
                getDetails: [{ name: 'category_path', get: 'html', nodes: [{ selector: '.search_h1 span font font', type: 'all' }] }]
            },
            {
                level: 3,
                prefix: 'panasonic',
                code: code,
                type: 'list',
                useFarmer: true,
                getLinks: [{ name: 'link', get: 'href', nodes: [{ selector: '#category_tree05 a', type: 'all' }] }],
                getDetails: [{ name: 'category_name', get: 'text', nodes: [{ selector: '#category_tree04 a', type: 'all' }] }]
            },
            {
                level: 4,
                prefix: 'panasonic',
                code: code,
                type: 'list',
                useFarmer: true,
                getLinks: [{ name: 'link', get: 'href', nodes: [{ selector: '#category_tree06 a,.font_hinban a', type: 'all' }] }],
                getDetails: [{ name: 'category_name', get: 'text', nodes: [{ selector: '#category_tree05 a', type: 'all' }] }]
            },
            {
                level: 5,
                prefix: 'panasonic',
                code: code,
                type: 'mix',
                useFarmer: true,
                getLinks: [{ name: 'link', get: 'href', nodes: [{ selector: '#category_tree07 a,.font_hinban a', type: 'all' }] }],
                getDetails: [{ name: 'category_name', get: 'text', nodes: [{ selector: '#category_tree07 a', type: 'all' }] }],
                getItems: [
                    {
                        name: 'product_path',
                        get: 'html',
                        nodes: [{ type: 'all', selector: '.ga2012_breadcrumbs p', }]
                    },
                    {
                        name: 'product_code',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'h1.search_h1', }]
                    },
                    {
                        name: 'product_price',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'font[color="#0089C7"]', }]
                    },
                    {
                        name: 'product_date',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'font[color="#FF0000"]', }]
                    },
                    {
                        name: 'product_image',
                        get: 'src',
                        nodes: [{ type: 'all', selector: '#thumbnail_area img', }]
                    },
                    {
                        name: 'product_details',
                        get: 'html',
                        nodes: [{ type: 'all', selector: '.tableH2' }]
                    }
                ],
            },
            {
                level: 6,
                prefix: 'panasonic',
                code: code,
                type: 'mix',
                useFarmer: true,
                getLinks: [{
                    name: 'link',
                    get: 'href',
                    nodes: [{ selector: '.font_hinban a', type: 'all' }]
                }],
                getDetails: [],
                getItems: [
                    {
                        name: 'product_path',
                        get: 'html',
                        nodes: [{ type: 'all', selector: '.ga2012_breadcrumbs p', }]
                    },
                    {
                        name: 'product_code',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'h1.search_h1', }]
                    },
                    {
                        name: 'product_price',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'font[color="#0089C7"]', }]
                    },
                    {
                        name: 'product_date',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'font[color="#FF0000"]', }]
                    },
                    {
                        name: 'product_image',
                        get: 'src',
                        nodes: [{ type: 'all', selector: '#thumbnail_area img', }]
                    },
                    {
                        name: 'product_details',
                        get: 'html',
                        nodes: [{ type: 'all', selector: '.tableH2' }]
                    }
                ],
            },
            {
                level: 7,
                prefix: 'panasonic',
                code: 'panasonic-level6',
                type: 'item',
                useFarmer: true,
                getLinks: [],
                getDetails: [],
                getItems: [
                    {
                        name: 'product_path',
                        get: 'html',
                        nodes: [{ type: 'all', selector: '.ga2012_breadcrumbs p', }]
                    },
                    {
                        name: 'product_code',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'h1.search_h1', }]
                    },
                    {
                        name: 'product_price',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'font[color="#0089C7"]', }]
                    },
                    {
                        name: 'product_date',
                        get: 'text',
                        nodes: [{ type: 'all', selector: 'font[color="#FF0000"]', }]
                    },
                    {
                        name: 'product_image',
                        get: 'src',
                        nodes: [{ type: 'all', selector: '#thumbnail_area img', }]
                    },
                    {
                        name: 'product_details',
                        get: 'html',
                        nodes: [{ type: 'all', selector: '.tableH2' }]
                    }
                ],
            },
        ]
    },
}

const options4 = {
    site: 'mitsubishielectric',
    isProxy: false,
    maxConnection: 10,
    rateLimit: 2000,
    loadImages: false,
    timeout: 20000,
    url: ' http://www.mitsubishielectric.co.jp',
    settings: {
        isCreateUpdate: true,
        beginLevel: 0,
        amount: 2,
    },
    querys: {
        number: 7,
        levels: [
            { level: 1, prefix: 'mitsubishielectric', code: code, rootUrl: 'http://www.mitsubishielectric.co.jp/ldg/wink/lnaviCategory.do?ccd=&dispSpecLink=true&_=1489666781426', type: 'list' },
            {
                level: 2,
                prefix: 'mitsubishielectric',
                code: code,
                type: 'list',
                useFarmer: true,
                getLinks: [{ name: 'linkCode', get: 'ccd', nodes: [{ selector: 'a.bullet_link', type: 'all' }] }],
                getDetails: [],
            },
            {
                level: 3,
                prefix: 'mitsubishielectric',
                code: code,
                type: 'list',
                useFarmer: true,
                getLinks: [{ name: 'linkCode', get: 'ccd', nodes: [{ selector: '.side_list_lv3 .bullet_link', type: 'all' }] }],
                getDetails: [],
            },
            {
                level: 4,
                prefix: 'mitsubishielectric',
                code: code,
                type: 'list',
                useFarmer: true,
                getLinks: [{ name: 'linkCode', get: 'ccd', nodes: [{ selector: '.side_list_lv3 .bullet_link', type: 'all' }] }],
            },
            {
                level: 5,
                prefix: 'mitsubishielectric',
                code: code,
                useFarmer: true,
                type: 'list',
                getLinks: [{ name: 'linkPage', get: 'text', nodes: [{ selector: '.sec_search_results .ib:nth-child(2)', type: 'all' }] }],
            },
            {
                level: 6,
                prefix: 'mitsubishielectric',
                code: code,
                useFarmer: true,
                type: 'list',
                getLinks: [{ name: 'link', get: 'href', nodes: [{ selector: '.sec_product_detail a.bullet_link', type: 'all' }] }],
            },
            {
                level: 7,
                prefix: 'mitsubishielectric',
                code: code,
                type: 'item',
                useFarmer: true,
                getLinks: [],
                getItems: [{
                    name: 'image_feature',
                    get: 'src',
                    nodes: [{ type: 'all', selector: '.thumbnail_area', }]
                },
                {
                    name: 'product_details',
                    get: 'html',
                    nodes: [{ type: 'all', selector: '.tableH2' }]
                }
                ]
            },
        ]
    },
}

module.exports = { taroto: options1, daizen: options2, panasonic: options3, misubishi: options4 };