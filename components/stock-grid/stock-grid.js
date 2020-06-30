import { 
    DETAILS_WINDOW_UUID, 
    DETAILS_WINDOW_TOPIC, 
    JAVA_NATIVE_UUID, 
    JAVA_NATIVE_TOPIC,
    WILDCARD_UUID,
    JAVA_NATIVE_TO_HTML_UUID,
    JAVA_NATIVE_TO_HTML_TOPIC,
    DETAILS_WINDOW_TOPIC_IND,
    ENTRYPOINT,
    TOPIC__DROPDOWN,
    SHOW_ADD_SYMBOL,
    SHOW_ADD_GROUP
 } from '../../js/constants.js';
import { sendToUnNamedMessage, publishMessage } from '../../js/messaging.js';

const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
const _addSymbolContainer = document.querySelector("#add-symbol-container");
const _addGroupButton = document.querySelector("#add-group-button");
const entryPoint = ENTRYPOINT;
let stockSymbol = '';
let gridOptions = {
    rowHeight: 32,
    headerHeight: 40,
    // rowSelection: 'multiple',
    defaultColDef: {
        sortable: true,
        resizable: true,
    },
    isExternalFilterPresent: isExternalFilterPresent,
    doesExternalFilterPass: doesExternalFilterPass,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    }
};

document.addEventListener("DOMContentLoaded", function(){
    _addSymbolContainer.style.display = SHOW_ADD_SYMBOL===false ? 'none' : undefined;
    _addGroupButton.style.display = SHOW_ADD_GROUP===false ? 'none' : undefined;
    document.getElementById('grid-external-filter').addEventListener('keyup', function(e){
        console.log(e)
        stockSymbol = e.target.value;
        gridOptions.api.onFilterChanged();
    })
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

    // getRealTimeData();
}

function sendMessage(data) {
    if (entryPoint === 'HTML') {
        publishMessage(DETAILS_WINDOW_TOPIC_IND, data);
    } else {
        publishMessage(JAVA_NATIVE_TOPIC, data.symbol);
    }

}

function getLink(params) {
    const link = document.createElement('a')
    link.innerHTML = params.value;
    link.href = 'javascript:void(0)'
    link.addEventListener('click', function(){
        params.node.setSelected(true);
        sendMessage(params.data);
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
                valueGetter: (params) => {
                    return e==='lastPrice' ? '$ '+params.data[e] : params.data[e]
                },
                cellRenderer: e==='symbol' ? (params) => {
                    return getLink(params)
                } : undefined,
                cellClass: e==='symbol' ? 'symbol-column' : undefined,
                headerClass: e==='symbol' ? 'symbol-header-column' : undefined,
                headerCheckboxSelection: e==='symbol' ?   true : undefined,
                headerCheckboxSelectionFilteredOnly: e==='symbol' ? true: undefined,
                checkboxSelection: e==='symbol' ? true : undefined,
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
        publishMessage(TOPIC__DROPDOWN, data);
    }, 1000);    
}

function isExternalFilterPresent() {
    return stockSymbol != '';
}

function doesExternalFilterPass(params) {
    var filterTextLowerCase = stockSymbol.toString().toLowerCase();
    var valueLowerCase = params.data.symbol.toLowerCase();

    console.log(filterTextLowerCase, valueLowerCase)
    return valueLowerCase.indexOf(filterTextLowerCase) >= 0;
}

const getRealTimeData = function() {
    const socket = new WebSocket('wss://ws.finnhub.io?token=brgslqnrh5r9t6gjebng');
    // Connection opened -> Subscribe
    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    // Unsubscribe
    var unsubscribe = function(symbol) {
        socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
    }
}

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

// function ManageOpen(appConfig, winLoc, data) {
//     open(appConfig, winLoc)
//     .then(app => {
//         // detailsData = data;        
//         const DETAILS_UUID = DETAILS_WINDOW_UUID+data.symbol
//         const DETAILS_TOPIC = DETAILS_UUID;
//         detailsSubscribeListner(DETAILS_UUID, DETAILS_TOPIC, data)
//         console.log('Application is running')
//     // if (!opened) return

//     // const currentApp = opened as Application
//     // currentApp.addListener('closed', () => removeFromOpenedList(app.name))
//     // addToOpenedList(app.name)
//     })
//     .catch(err => {
//         console.warn('Application already opened')
//     // addToOpenedList(app.name)
//     })
// }

// function detailsSubscribeListner(uuid, topic, data) {
//     const DETAILS_PAGE_UUID = uuid;
//     const DETAILS_PAGE_TOPIC = topic;
//     const DETAILS_DATA = data;
//     fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
//         sendToUnNamedMessage(
//             DETAILS_PAGE_UUID, 
//             DETAILS_PAGE_TOPIC, 
//             DETAILS_DATA
//         );
//         console.log("The application " + uuid + " has subscribed to " + topic);
//     });
// }

function initInterAppBus() {
    if (entryPoint === 'HTML') {
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
    } else {
        subscribeToJavaData()
    }
};

function subscribeToJavaData() {
    fin.desktop.InterApplicationBus.subscribe(
        WILDCARD_UUID,
        JAVA_NATIVE_TO_HTML_TOPIC,
        function (message, uuid) {
            // For message format please refer "grid_data" above.
            getGridData(message);
        }
    );
}