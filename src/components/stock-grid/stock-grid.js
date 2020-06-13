var apps = [];
var detailsData;

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
    // alert("OpenFin is available");
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    initInterApp();
    getGridData();
    // getRealTimeData();
}

let columnDefs = [
    {headerName: 'Symbol', field: 'symbol', cellRenderer: (params) => {
        return getLink(params)
    }},
    {headerName: 'Display Symbol', field: 'displaySymbol'},
    {headerName: 'Description', field: 'description'}
    // {headerName: 'Chg %', field: 'Chg %'},
    // {headerName: 'Currency', field: 'Currency'},
    // {headerName: 'Market Time', field: 'Market Time'},
    // {headerName: 'Volume', field: 'Volume'}
];

// let columnDefs = [
//     {headerName: 'Symbol', field: 's', cellRenderer: function(params) {
//         return this.getLink(params)
//     }},
//     {headerName: 'Last Price', field: 'p', type: 'measure'},
//     {headerName: 'Volume', field: 'v', type: 'measure'}
// ]


function initNewApp(CHILD_UUID){
    return new Promise(function(resolve, reject){
        var SpawnedApplication = new fin.desktop.Application({
            name: 'New OpenFin Application',
            uuid: CHILD_UUID,
            url: "http://localhost:8080/components/stock-details/index.html",
            mainWindowOptions: {
                name: 'OpenFin Application',
                autoShow: true,
                defaultCentered: false,
                alwaysOnTop: false,
                saveWindowState: true,
                icon: "favicon.ico",
                maxHeight: 600,
                defaultHeight: 600,
                minHeight: 600,
                maxWidth: 1100,
                minWidth: 1100,
                defaultWidth: 1100
            }
        }, function () {
            // Ensure the spawned application are closed when the main application is closed.
            console.log("running");
            SpawnedApplication.run();
            resolve(SpawnedApplication)
        });
    })
}

function sendMessage(uuid, topic, data) {
    var _random = Math.random() * 300;

    var successCallback = function (e) {
        console.log("SUCCESSFULLY SENT");
    };

    var errorCallback = function (e) {
        console.log("ERROR MESSAGE ", e);
    };
    console.log(uuid, topic, data)
    fin.desktop.InterApplicationBus.send(uuid, topic, data, successCallback, errorCallback);
}

// function sendToNamedMessage(CHILD_UUID) {
//     console.log(CHILD_UUID)
//     fin.desktop.InterApplicationBus.send({
//             uuid: CHILD_UUID,
//             name: CHILD_UUID,
//             topic: 'send-to-named',
//             message: {text:'message', name:'name'},
//             cache: 'until-delivered'
//         },
//         function () {
//             console.log('sendToNamedMessage worked')
//         },
//         function (err) {
//             console.log("sendToNamedMessage failed: ", err)
//         });
// }

// Start The Application
async function start(symbol) {
    return fin.Application.start({
        name: 'New OpenFin Application',
        uuid: 'mph-stock-details-poc-'+symbol,
        url: "http://localhost:8080/components/stock-details/index.html",
        mainWindowOptions: {
            name: 'OpenFin Application',
            autoShow: true,
            defaultCentered: false,
            alwaysOnTop: false,
            saveWindowState: true,
            icon: "favicon.ico",
            maxHeight: 600,
            defaultHeight: 600,
            minHeight: 600,
            maxWidth: 1100,
            minWidth: 1100,
            defaultWidth: 1100
        }
    });
}

async function createOrBringToFrontOpenFinApplication(symbol) {
    return start(symbol)
}

function handleApplication(symbol) {
    return createOrBringToFrontOpenFinApplication(symbol)
}

async function open(symbol) {
    return handleApplication(symbol)
}

// async function createWin(symbol) {
//     const app = await fin.Application.start({
//         name: 'mph-stock-details-poc-'+symbol,
//         uuid: 'mph-stock-details-poc-'+symbol,
//         url: 'http://localhost:8080/components/stock-details/index.html',
//         autoShow: true,
//         saveWindowState: true,
//         maxHeight: 200,
//         defaultHeight: 200,
//         minHeight: 200
//     });
//     return await app.getWindow();
// }

// async function setAsForeground(symbol) {
//     const win = await createWin(symbol);
//     return await win.setAsForeground()
// }

// async function BringWindowToFront() {
//     const app = fin.Application.start({
//         name: 'MphasisStockDetails',
//         uuid: 'mph-stock-details-poc',
//         url: 'http://localhost:8080/components/stock-details/index.html',
//         autoShow: true
//     });
//     const win = app.getWindow();
//     return win.bringToFront();
// }

function getLink(params) {
    const link = document.createElement('a')
    link.innerHTML = params.value;
    link.href = 'javascript:void(0)'
    link.addEventListener('click', function(){
        // const CHILD_UUID = 'mph-stocks-list-poc-'+params.data.symbol;
        const symbol = params.data.symbol;
        open(symbol)
        .then((app) => {
            // console.log(params.data)
            // this.detailsData = params.data;
            console.log(app, 'Application is running')
        })
        .catch(err => console.log(err));

        // initNewApp(CHILD_UUID).then(function(value){
        //     this.detailsData = params.data;
        //     apps.push(value);
        // });
        // const currentApplication = fin.desktop.Application.wrap("mph-stock-details-poc-"+params.data.symbol);
        // currentApplication.isRunning(function (running) {
        //     if (running) {
        //         // alert('Application Is Already Running');
        //         currentApplication.getWindow().setAsForeground();
        //     } else {
        //         start(params.data.symbol)
        //         // fin.Application.startFromManifest('http://localhost:8080/stock-details.json')
        //         .then((app) => {
        //             console.log(app, 'App is running')
        //             fin.InterApplicationBus.send(fin.me, 'topic', 'Hello there!')
        //             .then(() => console.log('Message sent'))
        //             .catch(err => console.log(err));
        //             // publishData(app.identity, params.data)
        //         })
        //         .catch(err => console.log(err))
        //     }
        // })

    })
    return link;
}

const createRowData = (data) => {
    let rowData = []
    data.data.forEach(item => {
        rowData.push(item)
    })
    return rowData;
}

const getGridData = function () {
    const url = 'https://finnhub.io/api/v1/stock/symbol?exchange=US&token=brgslqnrh5r9t6gjebng';
    axios.get(url).then(function (response) {
        gridOptions.api.setRowData(response.data);
        // gridOptions.api.setColumnDefs(this.getColumns(response.data));
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
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

function getColumns(data) {
    const cols = [];
    Object.keys(data[0]).forEach(e => {
        cols.push(
            {
                headerName: e,
                field: e
            }
        )
    });
    return cols;
}

let gridOptions = {
    columnDefs: columnDefs,
    enableSorting: true,
    enableColResize: true,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    }
};

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

// function subscribeWithName(id, name){
//     var onSuccess = function(){
//             console.log("1. subscribeWithName -> UUID: " + id + " Name: " +name )
//         },
//         onFail = function(){
//             console.log("subscribeWithName subscription FAIL")
//         };

//     fin.desktop.InterApplicationBus.subscribe(id,
//         name,
//         "send-to-named",
//         function (message, uuid) {
//             console.log(message);
//             var _message = "The application " + uuid + " send this message " + message;
//             _namedSendResult.innerHTML = "Topic: send-to-named, text: " + message.text +", name:"+ message.name;
//         },onSuccess,onFail);
// };

function initInterApp(){
    console.log("Init with interapp called");
    _interAppMessageField = document.querySelector("#inter-app-message")
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        sendMessage(uuid, topic, { description: "ALCOA CORP",
        displaySymbol: "AA",
        symbol: "AA" })
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
};