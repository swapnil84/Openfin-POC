import { detailsAppConfigs } from '../../js/configuration.js';
import { open } from '../../js/util.js';
import { sendToUnNamedMessage } from '../../js/messaging.js';

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
    getGridData();
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

function getLink(params) {
    const link = document.createElement('a')
    link.innerHTML = params.value;
    link.href = 'javascript:void(0)'
    link.addEventListener('click', function(){
        const symbol = params.data.symbol;
        detailsAppConfigs.uuid = 'MPH_POC_'+symbol;
        detailsAppConfigs.name = 'MPH_POC_'+symbol;
        handleOpen(detailsAppConfigs, params.data);
    })
    return link;
}

const getGridData = function () {
    const gridData = [
        {
          "symbol":"aapl",
          "change":"0.0",
          "changePercent":"0",
          "currency":"USD",
          "marketTime":"14:13:28 -0400",
          "lastPrice":"0",
          "marketCap":"1490968",
        },
        {
            "symbol":"BABA",
            "change":"0.0",
            "changePercent":"0",
            "currency":"USD",
            "marketTime":"14:13:28 -0400",
            "lastPrice":"0",
            "marketCap":"1490968",
          }
    ];
    gridOptions.api.setRowData(gridData);
    gridOptions.api.setColumnDefs(createColumnDefs(gridData));
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

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

function initInterApp(){
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        sendToUnNamedMessage(uuid, topic, detailsData);
        console.log("The application " + uuid + " has subscribed to " + topic);
    });

    fin.desktop.InterApplicationBus.subscribe(
        "mph-stocks-wishlist",
        "Stocks List",
        function (message, uuid) {
            // getGridData();
        }
    );
};