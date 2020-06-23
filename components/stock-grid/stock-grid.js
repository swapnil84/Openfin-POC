import { detailsAppConfigs } from '../../js/configuration.js';
import { open } from '../../js/util.js';
import { 
    DETAILS_WINDOW_UUID, 
    DETAILS_WINDOW_TOPIC, 
    JAVA_NATIVE_UUID, 
    JAVA_NATIVE_TOPIC,
    JAVA_NATIVE_TO_HTML_UUID,
    JAVA_NATIVE_TO_HTML_TOPIC,
    DETAILS_WINDOW_TOPIC_IND } from '../../js/constants.js';
import { sendToUnNamedMessage, sendMessage, publishMessage } from '../../js/messaging.js';

const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
var detailsData;
let gridOptions = {
    rowHeight: 32,
    headerHeight: 40,
    // rowSelection: 'multiple',
    defaultColDef: {
        sortable: true,
        resizable: true,
    },
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    }
};

document.addEventListener("DOMContentLoaded", function(){
    initStockList();
});

function initStockList(){
    try{
        fin.desktop.main(function(){
            initStockListWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

function initStockListWithOpenFin(){
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    initInterAppBus();
    fin.desktop.System.getProcessList(function (list) {
        list.forEach(function (process) {
            console.log("UUID: " + process.uuid + ", Application Name: " + process.name);
        });
    });
    // getGridData();
    // getRealTimeData();
}

function handleOpen (detailsAppConfigs, data) {
    open(detailsAppConfigs)
      .then(app => {
        detailsData = data;
        console.log('Application is running')
        // if (!opened) return

        // const currentApp = opened as Application
        // currentApp.addListener('closed', () => removeFromOpenedList(app.name))
        // addToOpenedList(app.name)
      })
      .catch(err => {
        console.warn('Application already opened')
        // addToOpenedList(app.name)
      })
  }

function getStockData(data) {
    sendToUnNamedMessage(
        JAVA_NATIVE_UUID, 
        JAVA_NATIVE_TOPIC, 
        data.symbol
    );
    // ManageOpen(detailsAppConfigs);
}

function getLink(params) {
    const link = document.createElement('a')
    link.innerHTML = params.value;
    link.href = 'javascript:void(0)'
    link.addEventListener('click', function(){
        // const symbol = params.data.symbol;
        // detailsAppConfigs.uuid = DETAILS_WINDOW_UUID+symbol;
        // detailsAppConfigs.name = DETAILS_WINDOW_UUID+symbol;
        // getStockData(detailsAppConfigs, params.data)
        publishMessage(DETAILS_WINDOW_TOPIC_IND, params.data);
    })
    return link;
}

const createColumnDefs = (data) => {
    const headerMapping = {
        'symbol': 'Symbol',
        'lastPrice': 'Last Price',
        'change': 'Change',
        'changePercent': 'Chg %',
        'currency': 'Currency',
        'marketTime': 'Market Time',
        'marketCap': 'Market Cap',
    }
    const cols = [];
    Object.keys(data[0]).forEach(e => {
        cols.push(
            {
                headerName: headerMapping[e],
                field: e,
                cellRenderer: e==='symbol' ? (params) => {
                    return getLink(params)
                } : undefined,
                cellClass: e==='symbol' ? 'symbol-column' : undefined,
                // headerCheckboxSelection: e==='symbol' ? true : undefined,
                // headerCheckboxSelectionFilteredOnly: e==='symbol' ? true: undefined,
                // checkboxSelection: e==='symbol' ? true : undefined,
                width: e==='symbol' ? 180 : undefined
            }
        )
    });
    return cols;
}

const getGridData = function (data) {
    gridOptions.api.setRowData(data);
    gridOptions.api.setColumnDefs(createColumnDefs(data));
    gridOptions.api.sizeColumnsToFit();
    _mainContainer.style.display = 'block';
    _loader.style.display = 'none';
    setTimeout(() => {
        // publishMessage(DETAILS_WINDOW_TOPIC, data[0]);
        sendToUnNamedMessage(
            'MPH_POC_PLTFORM_UUID', 
            DETAILS_WINDOW_TOPIC,
            data
        );
    }, 1000);    
}

// const getRealTimeData = function() {
//     const socket = new WebSocket('wss://ws.finnhub.io?token=brfi21vrh5raper7as70');
//     const messages = [
//         {'type':'subscribe', 'symbol': 'AAPL'},
//         {'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'},
//         {'type':'subscribe', 'symbol': 'IC MARKETS:1'}
//     ]
//     // Connection opened -> Subscribe
//     socket.addEventListener('open', function (event) {
//         socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'},))
//         // for (message in messages) {
//         //     socket.send(JSON.stringify(message))
//         // }
//         // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
//     });

//     // Listen for messages
//     socket.addEventListener('message', function (e) {
//         const socketData = JSON.parse(e.data);
//         switch (socketData.type) {
//             case 'trade':
//                 gridOptions.api.setRowData(createRowData(socketData));
//                 break;
//             default:
//                 console.log('unrecognised event type ' + e.type);
//         }
//     });

//     // Unsubscribe
//     var unsubscribe = function(symbol) {
//         socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
//     }
// }

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

function ManageOpen(appConfig, winLoc, data) {
    open(appConfig, winLoc)
    .then(app => {
        // detailsData = data;        
        const DETAILS_UUID = DETAILS_WINDOW_UUID+data.symbol
        const DETAILS_TOPIC = DETAILS_UUID;
        detailsSubscribeListner(DETAILS_UUID, DETAILS_TOPIC, data)
        console.log('Application is running')
    // if (!opened) return

    // const currentApp = opened as Application
    // currentApp.addListener('closed', () => removeFromOpenedList(app.name))
    // addToOpenedList(app.name)
    })
    .catch(err => {
        console.warn('Application already opened')
    // addToOpenedList(app.name)
    })
}


function detailsSubscribeListner(uuid, topic, data) {
    const DETAILS_PAGE_UUID = uuid;
    const DETAILS_PAGE_TOPIC = topic;
    const DETAILS_DATA = data;
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        sendToUnNamedMessage(
            DETAILS_PAGE_UUID, 
            DETAILS_PAGE_TOPIC, 
            DETAILS_DATA
        );
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
}

async function addPlatformView(name, url, data) {
    let windowIdentity;
    if (fin.me.isWindow) {
        windowIdentity = fin.me.identity;
    } else if (fin.me.isView) {
    windowIdentity = (await fin.me.getCurrentWindow()).identity;
    } else {
        throw new Error('Not running in a platform View or Window');
    }

    const platform = fin.Platform.getCurrentSync();
    console.log(windowIdentity, platform)

    platform.createView({
        name: name,
        url: url // The URL of the View
    }, windowIdentity).then(view => {
            console.log(view, 'View Created')
            subcriberAdded();
            publishMessage(DETAILS_WINDOW_TOPIC, data)
        } 
    );
}

function initInterAppBus(){
    const grid_data = [
        {
            "symbol":"AAPL",
            "lastPrice":"342.99",
            "change":"7.19",
            "changePercent":"0",
            "marketTime":"22:41:59",
            "marketCap":"1490968",
            "currency":"USD"            
        },
        {
            "symbol":"JPM",
            "lastPrice":"101.25",
            "change":"1.38",
            "changePercent":"0",
            "marketTime":"22:42:00",
            "marketCap":"336817.9",
            "currency":"USD"            
        },
        {
            "symbol":"MPHASIS.NS",
            "lastPrice":"857.75",
            "change":"-0.95",
            "changePercent":"0",
            "marketTime":"22:42:02",
            "marketCap":"165380.4",
            "currency":"USD",
        },
        {
            "symbol":"WFS",
            "lastPrice":"857.75",
            "change":"1.80",
            "changePercent":"0",
            "marketTime":"22:42:02",
            "marketCap":"165380.4",
            "currency":"USD"
        }
    ]

    getGridData(grid_data);

    // console.log(fin);
    // fin.View.getCurrent()
    // .then(view => console.log('current view', view))
    // .catch(err => console.log(err));

    // fin.View.wrap({ uuid: 'testViewUuid', name: 'testViewName' })
    // .then(view => console.log('wrapped view', view))
    // .catch(err => console.log(err));

    // fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
    //     console.log("The application " + uuid + " has subscribed to " + topic);
    // });

    // reload().then(() => {
    //     console.log('Reloaded view', grid_data);
    //     publishMessage(DETAILS_WINDOW_TOPIC, grid_data[0]);
    // })
    // .catch(err => console.log(err));
    //       const winLoc = {
    //         left: 300,
    //         top: 0
    //     }
    //     detailsAppConfigs.uuid = DETAILS_WINDOW_UUID;
    //     detailsAppConfigs.name = DETAILS_WINDOW_UUID;
    // ManageOpen(detailsAppConfigs, winLoc, grid_data[0])

    // addPlatformView(
    //     'component_A2', 
    //     'http://localhost:8083/components/stock-details/index.html',
    //     grid_data[0]
    // );
    // var i = 0;
    // for (const app of grid_data) {
    //     const winLoc = {
    //         left: i,
    //         top: 0
    //     }
    //     detailsAppConfigs.uuid = DETAILS_WINDOW_UUID+app.symbol;
    //     detailsAppConfigs.name = DETAILS_WINDOW_UUID+app.symbol;
    //     ManageOpen(detailsAppConfigs, winLoc, app)
    //     i+=500;
    // }



    // fin.desktop.InterApplicationBus.subscribe(
    //     JAVA_NATIVE_TO_HTML_UUID,
    //     JAVA_NATIVE_TO_HTML_TOPIC,
    //     function (message, uuid) {
    //         getGridData(message);
    //     }
    // );
};