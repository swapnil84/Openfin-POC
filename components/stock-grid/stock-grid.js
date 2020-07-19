import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { 
    DETAILS_WINDOW_UUID, 
    DETAILS_WINDOW_TOPIC, 
    JAVA_NATIVE_UUID, 
    JAVA_NATIVE_TOPIC,
    WILDCARD_UUID,
    JAVA_NATIVE_TO_HTML_UUID,
    JAVA_NATIVE_TO_HTML_TOPIC,
    DETAILS_WINDOW_TOPIC_IND,
    TOPIC__SYMBOL_CHANGE,
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
const _filterSymbolField = document.querySelector("#filter-symbol");
const _filterDropdown = document.querySelector("#filter-dropdown");
const _addSymbolBTN = document.querySelector('#add-symbol-btn');
const _gridExternalFilter = document.querySelector('#grid-external-filter');

const fxDataUrl = '../../api/fx.json';
const fxDataUrl2 = '../../api/fx2.json';
const entryPoint = ENTRYPOINT;
let stockSymbol = '';
var stocksList;
let gridOptions = {
    rowHeight: 32,
    headerHeight: 40,
    // rowSelection: 'multiple',
    defaultColDef: {
        sortable: true,
        resizable: true,
    },
    getRowNodeId: function(data) {
        return data.id;
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
    initStockList();
});

_gridExternalFilter.addEventListener('keyup', function(event){
    stockSymbol = event.target.value;
    gridOptions.api.onFilterChanged();
})

window.addEventListener('click', function(event) {
    _filterDropdown.style.display = 'none';
})

_filterSymbolField.addEventListener('click', function(event) {
    event.stopPropagation();
})

_filterSymbolField.addEventListener('keyup', function(event) {
    _filterDropdown.style.display = 'block';
    const val = event.target.value.toLowerCase();
    filterSymbol(val);
})

_filterSymbolField.addEventListener('focus', function(event) {
    const textVal = event.target.value.toLowerCase();
    if (textVal !== '') {
        _filterDropdown.style.display = 'block';
        filterSymbol(textVal);
    }
    _filterSymbolField.setAttribute('placeholder', '')
})
  
_filterSymbolField.addEventListener('blur', function() {
    _filterSymbolField.setAttribute('placeholder', 'Add Symbol(s)')
})

_addSymbolBTN.addEventListener('click', function() {
    alert(_filterSymbolField.value);
    publishMessage('JAVA_NATIVE_TOPIC_ADD_SYMBOL', _filterSymbolField.value);
})

function selectSymbol(symbol) {
    _filterSymbolField.value = symbol
    _filterDropdown.style.display = 'none';
}

function filterSymbol(value) {
    const filteredList = stocksList.filter(item => {
        const filteredItems = item.description.toLowerCase().indexOf(value.toLowerCase()) >= 0 || item.symbol.toLowerCase().startsWith(value);
        return filteredItems
    });
    const listItem = ({stock})  => html`
                <li class="filter-list-item" @click=${(e) => selectSymbol(stock.symbol)}>
                    <span class="symbol">${stock.symbol}</span>
                    <span class="company">${stock.description}</span>
                </li>
            `
    const updatedList = ({filteredList}) => {
        if (filteredList.length === 0) {
            return html`
                <ul class="filter-list">
                    <li class="filter-list-item">No Symbol Found</li>
                </ul>
            `
        }
        return html`
            <ul class="filter-list">
                ${filteredList.map((stock) => {
                    return listItem({stock})
                })}
            </ul>
        `  
    } 
    render(updatedList({filteredList}), document.getElementById('filter-dropdown'))
}

function initStockList(){
    try{
        fin.desktop.main(function(){
            initStockListWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

async function getSymbols() {
    const stockResult = await fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=brgslqnrh5r9t6gjebng');
    if(stockResult.ok) {
        stocksList = await stockResult.json();
    }
}

function initStockListWithOpenFin(){
    getSymbols();
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    initInterAppBus();
    // fin.desktop.System.getProcessList(function (list) {
    //     list.forEach(function (process) {
    //         console.log("UUID: " + process.uuid + ", Application Name: " + process.name);
    //     });
    // });
}

function sendMessage(data) {
    if (entryPoint === 'HTML') {
        publishMessage(TOPIC__SYMBOL_CHANGE, data.symbol);
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
        'marketTime': 'Market Time',
        'marketCap': 'Market Cap (M)',
    }
    const columnOrder = [
        'symbol',
        'changePercent',
        'marketCap',        
        'marketTime',
        'lastPrice',
        'change'
    ]
    const numberCols = [
        'lastPrice',
        'change'
    ]
    const cols = [];
    Object.keys(data[0]).forEach(e => {
        cols.push(
            {   
                headerName: headerMapping[e],
                field: e,
                valueGetter: (params) => {
                    if (e==='marketTime') {
                        return params.data[e]+' EDT';
                    }
                    if (e==='lastPrice') {
                        return '$ '+params.data[e];
                    }
                    return params.data[e];
                },
                cellRenderer: e==='symbol' ? (params) => {
                    return getLink(params)
                } : undefined,
                cellClass: e==='symbol' ? 'symbol-column' : undefined,
                headerClass: e==='symbol' ? 'symbol-header-column' : undefined,
                cellStyle: numberCols.indexOf(e) >= 0 ? {'text-align': 'right'} : undefined,
                width: e==='symbol' ? 180 : undefined,
                hide: e==='currency' || e === 'id' ? true : undefined
            }
        )
    });
    cols.sort(function (a,b){
        return columnOrder.indexOf(a.field) - columnOrder.indexOf(b.field)
    });
    return cols;
}

function createRowData(data) {
    data.forEach(row => {
        row['id'] = row.symbol;
    })

    return data
}

const getGridData = function (data) {
    gridOptions.api.setRowData(createRowData(data));
    gridOptions.api.setColumnDefs(createColumnDefs(data));
    // var columnDefs = gridOptions.columnApi.columnController.columnDefs;
    // columnDefs.push({ field: 'volume', headerName: 'Volume'});
    // gridOptions.api.setColumnDefs(columnDefs);
    // getStockVolume(data);
    gridOptions.api.sizeColumnsToFit();
    // gridOptions.api.forEachNode(node => node.rowIndex ? 0 : node.setSelected(true));
    _mainContainer.style.display = 'block';
    _loader.style.display = 'none';
    setTimeout(() => {
        publishMessage(TOPIC__DROPDOWN, data);
    }, 1000);
    requestData();
}

function setStockVolume(symbol, data) {
    var rowNode = gridOptions.api.getRowNode(symbol);
    rowNode.setDataValue('volume', data);
  }

function getStockVolume(gridData) {
    const socket = new WebSocket('wss://ws.finnhub.io?token=brgslqnrh5r9t6gjebng');
    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
        gridData.forEach(s => {
            socket.send(JSON.stringify({'type':'subscribe', 'symbol': s.symbol}))
        })
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        if(data.type === 'trade') {
            gridData.forEach(s => {
                const symVolume = data.data[0]
                if (symVolume.s === s.symbol) {
                    setStockVolume(s.symbol, symVolume.v)
                }
            })
        }
    });

    // Unsubscribe
    var unsubscribe = function(symbol) {
        socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
    }
}

async function requestData() {
    const result = await fetch(fxDataUrl)
    if(result.ok) {
        const data = await result.json();
        publishMessage('TOPIC_FX_CONTAINER', data);
        setTimeout(() => {
            publishMessage('TOPIC_FXCHART', data);
        }, 1000);
        // setTimeout(requestData, 10000);
    }
}

document.getElementById('send-to-fx').addEventListener('click', async function() {
    const result = await fetch(fxDataUrl2)
    if(result.ok) {
        const data = await result.json();
        publishMessage('TOPIC_FXCHART1', data);
    }
})

function isExternalFilterPresent() {
    return stockSymbol != '';
}

function doesExternalFilterPass(params) {
    var filterTextLowerCase = stockSymbol.toString().toLowerCase();
    var valueLowerCase = params.data.symbol.toLowerCase();

    return valueLowerCase.indexOf(filterTextLowerCase) >= 0;
}

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

function initInterAppBus() {
    if (entryPoint === 'HTML') {
        const grid_data = [
            // {
            //     "symbol":"BINANCE:BTCUSDT",
            //     "lastPrice":"342.99",
            //     "change":"7.19",
            //     "changePercent":"0",
            //     "marketTime":"22:41:59",
            //     "marketCap":"1490968",
            // },
            // {
            //     "symbol":"BINANCE:BNBBTC",
            //     "lastPrice":"342.99",
            //     "change":"7.19",
            //     "changePercent":"0",
            //     "marketTime":"22:41:59",
            //     "marketCap":"1490968",
            // },
            {
                "symbol":"APPL",
                "lastPrice":"342.99",
                "change":"7.19",
                "changePercent":"0",
                "marketTime":"22:41:59",
                "marketCap":"1490968",
            },
            {
                "symbol":"JPM",
                "lastPrice":"101.25",
                "change":"1.38",
                "changePercent":"0",
                "marketTime":"22:42:00",
                "marketCap":"336817.9",
            },
            {
                "symbol":"MPHASIS.NS",
                "lastPrice":"857.75",
                "change":"-0.95",
                "changePercent":"0",
                "marketTime":"22:42:02",
                "marketCap":"165380.4",
            },
            {
                "symbol":"WFS",
                "lastPrice":"857.75",
                "change":"1.80",
                "changePercent":"0",
                "marketTime":"22:42:02",
                "marketCap":"165380.4",
            }
        ]
        getGridData(grid_data);
    } else {
        subscribeToJavaData()
    }
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        TOPIC__SYMBOL_CHANGE,
        function (message, uuid) {
            gridOptions.api.forEachNode(node => node.data.symbol === message ? node.setSelected(true) : node.setSelected(false));
        }
    );
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
    fin.desktop.InterApplicationBus.subscribe(
        WILDCARD_UUID,
        'JAVA_NATIVE_TOPIC_SYMBOL_ADDED',
        function (message, uuid) {
            gridOptions.api.updateRowData({add: message})
        }
    );
}