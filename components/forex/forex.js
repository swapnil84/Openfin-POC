import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { JAVA_NATIVE_TO_HTML_TOPIC__FOREX, WILDCARD_UUID, ENTRYPOINT } from '../../js/constants.js';
import { publishMessage } from '../../js/messaging.js'
import { fxTile } from './tile.js';
const _mainContainer = document.querySelector("#main-container");
const _loader = document.querySelector("#loader");
const _currencyContainer = document.querySelector("#currency-container");
const fxDataUrl = '../../api/fx.json';
const fxDataUrl1 = '../../api/fx1.json';
let entryPoint = ENTRYPOINT;
var chart;
var markers = [];
var fxSymbols;
var chartBusData;

const initInterAppBus = () => {
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        'TOPIC_FX_CONTAINER',
        function (message, uuid) {
            createCurrencyChart(message);
        }
    );
};

const initNoOpenFin = () => {
    alert("OpenFin is not available - you are probably running in a browser.");
}

const initWithOpenFin = () => {
    initInterAppBus();
}

function init(){
    try{
        fin.desktop.main(function(){
            initWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

function renderNewFX(fxSymbols) {
    render(fxTile({fxSymbols}), document.getElementById('main-container'))
}

function createCurrencyChart(data) {
    const fxKeys = Object.keys(data.quote);
    fxSymbols = fxKeys.map(i => i.split(':')).map(j => j[1].split('_'));
    renderNewFX(fxSymbols)
    fxKeys.forEach(key => {
        const fxSymbol = key.split(':')[1].split('_').join('').toLowerCase();
        createFXChart(data, fxSymbol, key);
    })
}

// async function loadCurrChartData(id, key) {
//     _mainContainer.style.display = 'block';
//     _loader.style.display = 'none';
//     fin.desktop.InterApplicationBus.subscribe(
//         'MPH_POC_PLTFORM_UUID',
//         'TOPIC_FXCHART',
//         function (message, uuid) {
//             const [date, value] = message.quote[key][0];
//             // console.log(markers[id+'_chart'])
//             const point = [new Date(date).getTime(), value];
//             const series = markers[id+'_chart'].series[0],
//                 shift = series.data.length > 20; // shift if the series is longer than 20
//             // add the point
//             markers[id+'_chart'].series[0].addPoint(point, true, shift);
//         }
//     );
    
// }

// function loadChartData(id, key) {
//     fin.desktop.InterApplicationBus.subscribe(
//         'MPH_POC_PLTFORM_UUID',
//         'TOPIC_FXCHART1',
//         function (message, uuid) {
//             console.log(message)
//             markers[id+'_chart'].series[0].setData(message.quote[key], true)
//             _mainContainer.style.display = 'block';
//             _loader.style.display = 'none';
//         }
//     );
// }

fin.desktop.InterApplicationBus.subscribe(
    'MPH_POC_PLTFORM_UUID',
    'TOPIC_FXCHART1',
    function (message, uuid) {
        console.log(message)
        const fxKeys = Object.keys(message.quote);
        fxKeys.forEach(key => {
            const fxSymbol = key.split(':')[1].split('_').join('').toLowerCase();
            markers[fxSymbol+'_chart'].series[0].setData(message.quote[key], true)
        })
    }
);

function createFXChart(data, symbol, key) {
    console.log(data)
    markers[symbol+'_chart'] = new Highcharts.stockChart({
        chart: {
            renderTo: `currency-chart-container-${symbol}`,
            height: 150,
            backgroundColor: '#25262A',
            // events: {
            //     load: loadChartData(symbol, key)
            // }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        series: [{
            data: data.quote[key],
            tooltip: {
                valueDecimals: 2
            },
            color: '#3f7482'
        }],
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false,
        },
        exporting: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    })
    _mainContainer.style.display = 'block';
    _loader.style.display = 'none';
}

export function addCurrency(symbol) {
    publishMessage('JAVA_NATIVE_TOPIC_ADD_CURRENCY', symbol);
    addCurrencyChart(symbol)
}

function generateNewChart(data, symbol) {
    const fxKeys = Object.keys(data.quote);
    fxSymbols.push(symbol.split('/'));
    renderNewFX(fxSymbols)
    fxKeys.forEach(key => {
        const fxSymbol = key.split(':')[1].split('_').join('').toLowerCase();
        createFXChart(data, fxSymbol, key);
    })
}

function addCurrencyChart(symbol) {
    // For UI Side Testing
    Highcharts.getJSON(fxDataUrl1, function (data) {
        generateNewChart(data, symbol);
    });
    // For JAVA Implementation
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        'JAVA_NATIVE_TOPIC_NEW_FX_DATA',
        function (message, uuid) {
            generateNewChart(message, symbol);
        }
    );
}

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        init();
    });
}());