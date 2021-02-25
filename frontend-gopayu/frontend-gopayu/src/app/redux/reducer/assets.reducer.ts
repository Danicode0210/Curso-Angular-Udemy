import * as fromAssets from '../actions/assets.actions';

export interface State {
    files: Array<Object>;
    logoSidebar: Object;
    logoHeader: Object;
    terms: Object;
    texts: Object;
    localTexts: Object;
    i18n: Object;
    registerConfig: Object;
    disposableDomains: Object;
}

const initState: State = {
    files:[ 
        { 
           "_id":"5cf7ee29544cfa5a18c05fd6",
           "name":"Kambi Operator T&C v1.6 – Spanish",
           "date":"2019-06-05T16:30:33.447Z",
           "fileCode":"KAMBI_ROULES",
           "path":"https://apicrm.betplay.com.co/pdf/1559752233418KAMBI_ROULES.pdf"
        },
        { 
           "_id":"5cf7f0a2544cfa5a18c05fda",
           "name":"Acuerdo 05",
           "date":"2019-06-05T16:41:06.756Z",
           "fileCode":"AC_05",
           "path":"https://apicrm.betplay.com.co/pdf/1559752866744AC_05.pdf"
        },
        { 
           "_id":"5cf7ff534e980262a6703484",
           "name":"Acuerdo 04",
           "date":"2019-06-05T17:43:47.273Z",
           "fileCode":"AC_04",
           "path":"https://apicrm.betplay.com.co/pdf/1559756627216AC_04.pdf"
        },
        { 
           "_id":"5cfe962a4e980262a67034a9",
           "name":"FORMATO DE SOLICITUDES",
           "date":"2019-06-10T17:40:58.418Z",
           "fileCode":"FMT_01",
           "path":"https://apicrm.betplay.com.co/pdf/1560188458408FMT_01.pdf"
        },
        { 
           "_id":"5d55d01bdb41bc2aa0139aa6",
           "name":"Acuerdo 02",
           "date":"2019-08-15T21:35:23.420Z",
           "fileCode":"AC_02",
           "path":"https://apicrm.betplay.com.co/pdf/1565904923413AC_02.pdf"
        }
    ],
    logoHeader:{ 
        "type":1,
        "date":"2019-05-02T13:44:22.046Z",
        "isCurrent":true,
        "_id":"5ccaf436c053411a627e53e0",
        "__v":0,
        "path":"https://apicrm.betplay.com.co/logos/5ccaf436c053411a627e53e0.png"
    },
    logoSidebar:{ 
        "type":2,
        "date":"2019-04-24T17:46:33.728Z",
        "isCurrent":true,
        "_id":"5cc0a0f9c053411a627e53c2",
        "__v":0,
        "path":"https://apicrm.betplay.com.co/logos/5cc0a0f9c053411a627e53c2.png"
    }, 
    terms:{ 
        "date":"2019-09-06T23:18:54.079Z",
        "isCurrent":true,
        "_id":"5d72e95edb41bc2aa0139b55",
        "__v":0,
        "path":"https://apicrm.betplay.com.co/terms/Terminos y condiciones 201909.pdf"
    },
    texts:require('../../../assets/i18n/es.json'),
    localTexts:require('../../../assets/i18n/es.json'),
    i18n:require('../../../assets/i18n/es.json'),
    registerConfig: require('../../../../i18n/register-config.json'),
    disposableDomains:require('../../../../i18n/domains.json')
};

export function assetsReducer( state = initState, action: fromAssets.actions ): State {

    switch ( action.type ) {
        case fromAssets.SET_ASSETS:
            return {
                ...state,
                files:action.assets.files,
                logoHeader:action.assets.logoHeader,
                logoSidebar:action.assets.logoSidebar,
                terms:action.assets.terms,
                texts:JSON.parse(action.assets['texts']['json'])
            };
        case fromAssets.SET_I18N:
            return {
                ...state,
                i18n:action.i18n
            } 
        default:
            return state;
    }
}
