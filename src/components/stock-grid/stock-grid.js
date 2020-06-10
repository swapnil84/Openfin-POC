var externalApp;
var detailApplication;
var appRunning = false;

async function initWithOpenFin(){
    alert("OpenFin is available");
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    // fin.desktop.System.registerExternalConnection("ag-grid-simple", function() {
    //     console.log(arguments);
    // });

    // detailApplication = await fin.ExternalApplication.wrap("ag-grid-simple");


    // externalApp = fin.desktop.ExternalApplication.wrap('mph-stock-details-poc');
    // console.log(externalApp);
    // externalApp.addEventListener('connected', () => {
    //     console.log('external app connected');
    //     setDetailAppStatus(true);
    // }, () => {
    //     console.log('The registration was successful');
    //     setDetailAppStatus(true);
    // }, (reason, err) => {
    //     console.log(`Error Message: ${err.message} Error Stack: ${err.stack}`);
    // });


    // detailApplication.on("connected", function (event) {
    //     console.log('Connected')
    //     setDetailAppStatus(true);
    // });
    // detailApplication.on("disconnected", function (event) {
    //     console.log('closed')
    //     setDetailAppStatus(false);
    // });

    detailApplication = fin.desktop.Application.wrap("mph-stock-details-poc");
    detailApplication.addEventListener("connected", function (event) {
        setDetailAppStatus(true);
    });
    detailApplication.addEventListener("closed", function (event) {
        appRunning = false;
        setDetailAppStatus(false);
    });

    getGridData();
    // getRealTimeData();
}

let columnDefs = [
    {headerName: 'Symbol', field: 'symbol', cellRenderer: function(params) {
        return this.getLink(params)
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

const publishData = (data) => {
    fin.desktop.InterApplicationBus.publish("stock selected", data)
}

async function createWin() {
    const app = await fin.Application.start({
        name: 'MphasisStockDetails',
        uuid: 'mph-stock-details-poc',
        url: 'http://localhost:8080/components/stock-details/index.html',
        autoShow: true
    });
    return await app.getWindow();
}

async function setAsForeground() {
    const win = await createWin();
    return await win.setAsForeground()
}

async function BringWindowToFront() {
    const app = fin.Application.start({
        name: 'MphasisStockDetails',
        uuid: 'mph-stock-details-poc',
        url: 'http://localhost:8080/components/stock-details/index.html',
        autoShow: true
    });
    const win = app.getWindow();
    return win.bringToFront();
}

async function createWindow() {
    const winOption = {
        name:'child',
        defaultWidth: 300,
        defaultHeight: 300,
        url: 'http://localhost:8080/components/stock-details/index.html',
        frame: true,
        autoShow: true
    };
    return await fin.Window.create(winOption);
}

function getLink(params) {
    const link = document.createElement('a')
    link.innerHTML = params.value;
    link.href = 'javascript:void(0)'
    link.addEventListener('click', function() {
        // fin.Application.startFromManifest('http://localhost:8080/stock-details.json')
        createWindow()
        .then(app => {
            console.log('App is running')
            publishData(params.data)
        })
        .catch(err => console.log(err))
        // detailApplication.isRunning(function (running) {
        //     if (running) {
        //         this.publishData(params.data)
        //     } else {
        //         fin.Application.startFromManifest('http://localhost:8080/stock-details.json')
        //         // setAsForeground()
        //         .then(app => {
        //             console.log('App is running')
        //             this.publishData(params.data)
        //         })
        //         .catch(err => console.log(err))
        //     }
        // });
    })
    return link;
}

const setDetailAppStatus = function (running) {
    document.getElementById("detailStatus").innerText = running ? "Available!" : "Not Available.";
};

const createRowData = (data) => {
    let rowData = []
    data.data.forEach(item => {
        rowData.push(item)
    })
    return rowData;
}

const getGridData = function () {
    const url = 'https://finnhub.io/api/v1/stock/symbol?exchange=US&token=brfi21vrh5raper7as70';
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

const getRealTimeData = function() {
    const socket = new WebSocket('wss://ws.finnhub.io?token=brfi21vrh5raper7as70');
    const messages = [
        {'type':'subscribe', 'symbol': 'AAPL'},
        {'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'},
        {'type':'subscribe', 'symbol': 'IC MARKETS:1'}
    ]
    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'},))
        // for (message in messages) {
        //     socket.send(JSON.stringify(message))
        // }
        // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
    });

    // Listen for messages
    socket.addEventListener('message', function (e) {
        const socketData = JSON.parse(e.data);
        switch (socketData.type) {
            case 'trade':
                gridOptions.api.setRowData(createRowData(socketData));
                break;
            default:
                console.log('unrecognised event type ' + e.type);
        }
    });

    // Unsubscribe
    var unsubscribe = function(symbol) {
        socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
    }
}

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
    console.log(cols);
    return cols;
}

let gridOptions = {
    columnTypes: {
        measure: {
            width: 150,
            enableValue: true,
            cellClass: 'number',
            // valueFormatter: numberCellFormatter,
            cellRenderer:'agAnimateShowChangeCellRenderer'
        }
    },
    columnDefs: columnDefs,
    enableSorting: true,
    enableColResize: true,
    rowSelection: 'multiple',
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    }
};

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
    // Your browser-only specific code to go here...
}

function init(){
/* Code common to both OpenFin and browser to go above.
    Then the specific code for OpenFin and browser only to be
    targeted in the try/catch block below. 
*/
    try{
        fin.desktop.main(function(){
            initWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        init();
    });
}());