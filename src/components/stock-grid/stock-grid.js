import { detailsAppConfigs } from '../../js/configuration.js';
import { open } from '../../js/util.js';
import { 
    DETAILS_WINDOW_UUID, 
    DETAILS_WINDOW_TOPIC, 
    JAVA_NATIVE_UUID, 
    JAVA_NATIVE_TOPIC,
    JAVA_NATIVE_TO_HTML_UUID,
    JAVA_NATIVE_TO_HTML_TOPIC } from '../../js/constants.js';
import { sendToUnNamedMessage, sendMessage } from '../../js/messaging.js';

var detailsData;
let gridOptions = {
    rowHeight: 32,
    headerHeight: 40,
    rowSelection: 'multiple',
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
    initInterApp();
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

function getStockData(detailsAppConfigs, data) {
    sendToUnNamedMessage(
        JAVA_NATIVE_UUID, 
        JAVA_NATIVE_TOPIC, 
        data.symbol
    );
    ManageOpen(detailsAppConfigs);
}

function getLink(params) {
    const link = document.createElement('a')
    link.innerHTML = params.value;
    link.href = 'javascript:void(0)'
    link.addEventListener('click', function(){
        const symbol = params.data.symbol;
        detailsAppConfigs.uuid = DETAILS_WINDOW_UUID+symbol;
        detailsAppConfigs.name = DETAILS_WINDOW_UUID+symbol;
        getStockData(detailsAppConfigs, params.data)
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
                headerCheckboxSelection: e==='symbol' ? true : undefined,
                headerCheckboxSelectionFilteredOnly: e==='symbol' ? true: undefined,
                checkboxSelection: e==='symbol' ? true : undefined,
                width: e==='symbol' ? 140 : undefined
            }
        )
    });
    return cols;
}

const getGridData = function (data) {
    gridOptions.api.setRowData(data);
    gridOptions.api.setColumnDefs(createColumnDefs(data));
    gridOptions.api.sizeColumnsToFit();
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

function initInterApp(){
    const grid_data = [
        {"symbol":"AAPL","marketCap":"1490968","change":"7.199999999999989","changePercent":"0","currency":"USD","marketTime":"22:41:59","lastPrice":"342.99"},
        {"symbol":"JPM","marketCap":"336817.9","change":"1.3799999999999955","changePercent":"0","currency":"USD","marketTime":"22:42:00","lastPrice":"101.25"},
        {"symbol":"MPHASIS.NS","marketCap":"165380.4","change":"-0.9500000000000455","changePercent":"0","currency":"USD","marketTime":"22:42:02","lastPrice":"857.75"},
        {"symbol":"Wells","marketCap":"165380.4","change":"-0.9500000000000455","changePercent":"0","currency":"USD","marketTime":"22:42:02","lastPrice":"857.75"}
    ]

    getGridData(grid_data);
    var i = 0;
    for (const app of grid_data) {
        const winLoc = {
            left: i,
            top: 0
        }
        detailsAppConfigs.uuid = DETAILS_WINDOW_UUID+app.symbol;
        detailsAppConfigs.name = DETAILS_WINDOW_UUID+app.symbol;
        ManageOpen(detailsAppConfigs, winLoc, app)
        i+=500;
    }
    fin.desktop.InterApplicationBus.subscribe(
        JAVA_NATIVE_TO_HTML_UUID,
        JAVA_NATIVE_TO_HTML_TOPIC,
        function (message, uuid) {
            getGridData(message);
        }
    );
};