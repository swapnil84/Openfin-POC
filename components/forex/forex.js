import { JAVA_NATIVE_TO_HTML_TOPIC__FOREX, WILDCARD_UUID, ENTRYPOINT } from '../../js/constants.js';
import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { fxTile } from './tile.js';
const _mainContainer = document.querySelector("#main-container");
const _loader = document.querySelector("#loader");
const _currencyContainer = document.querySelector("#currency-container");
const fxDataUrl = '../../api/fx.json';
let entryPoint = ENTRYPOINT;
var chart;
var chartBusData;

const initInterAppBus = () => {
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    // subscribeToJavaData();
};

function subscribeToJavaData() {
    fin.desktop.InterApplicationBus.subscribe(
        WILDCARD_UUID,
        JAVA_NATIVE_TO_HTML_TOPIC__FOREX,
        function (message, uuid) {
            console.log(message)
            _loader.style.display = 'none';
            _mainContainer.style.display = 'block';

            // For message format, please refer "new-infraday.json" inside api folder at root level
            createCurrencyChart(message)
        }
    );
}

const initNoOpenFin = () => {
    alert("OpenFin is not available - you are probably running in a browser.");
}

const initWithOpenFin = () => {
    initInterAppBus();
    if(entryPoint = 'HTML') {
        console.log(_currencyContainer.childNodes.length)
        // createCurrencyChart('Hi');
        // if (_currencyContainer.childNodes.length > 0) {
            // requestLiveData();
            // Highcharts.getJSON(fxDataUrl, function (data) {
            //     console.log(data)
        createCurrencyChart();
            //     // createFXChart(fxSymbols);
            // });
        // }
    } else {
        initInterAppBus();
    }
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

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        init();
    });
}());

function createCurrencyChart() {
    // console.log(data)
    // const fxKeys = Object.keys(data.quote);
    // const fxSymbols = fxKeys.map(i => i.split(':')).map(j => j[1].split('_'));
    // // console.log(fxSymbols)
    const fxSymbols = [["EUR", "USD"]];
    render(fxTile({fxSymbols}), document.getElementById('currency-container'))
    // // console.log(Object.keys(data.quote))
    
    // fxKeys.forEach(key => {
    //     const fxSymbol = key.split(':')[1].split('_').join('');
    //     console.log(fxSymbol)
    //     createFXChart(fxSymbol, data.quote[key]);
    // })
    createFXChart();
    
}

async function loadCurrChartData() {
    _mainContainer.style.display = 'block';
    _loader.style.display = 'none';
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        'TOPIC_FXCHART',
        function (message, uuid) {
            const [date, value] = message[0];
            console.log(message[0])
            const point = [new Date(date).getTime(), value];
            const series = chart.series[0],
                shift = series.data.length > 20; // shift if the series is longer than 20
            // add the point
            chart.series[0].addPoint(point, true, shift);
        }
    );
}

function createFXChart() {
    chart = new Highcharts.stockChart({
        chart: {
            renderTo: `currency-chart-container-EURUSD`,
            height: 150,
            backgroundColor: '#25262A',
            events: {
                load: loadCurrChartData
            }
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        series: [{
            data: [],
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
}

async function requestData() {
    const result = await fetch('https://demo-live-data.highcharts.com/time-rows.json');
    if (result.ok) {
      const data = await result.json();
      const [date, value] = data[0];
      console.log(data[0])
      const point = [new Date(date).getTime(), value];
      const series = chart.series[0],
        shift = series.data.length > 20; // shift if the series is longer than 20
      // add the point
      chart.series[0].addPoint(point, true, shift);
      // call it again after one second
      setTimeout(requestData, 1000);
    }
  }