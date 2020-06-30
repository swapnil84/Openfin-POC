import { JAVA_NATIVE_TO_HTML_TOPIC__FOREX, WILDCARD_UUID } from '../../js/constants.js';
const _mainContainer = document.querySelector("#main-container");

const initInterAppBus = () => {
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    subscribeToJavaData();
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
    if (_mainContainer.childNodes.length > 0) {
        createCurrencyChart();
    }
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

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        init();
    });
}());

function createCurrencyChart() {
    const currencyResponse = {
        "base": "USD",
        "quote": {
            "EUR": 0.91,
            "JPY": 114.583548,
            "GBP": 0.874841,
            "USD": 1,
        }
    }
    Object.keys(currencyResponse.quote).forEach(element => {
        Highcharts.stockChart('currency-chart-container-'+element, {
            chart: {
                height: 150,
                backgroundColor: '#25262A',
                events: {
                    load: function () {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.round(Math.random() * 100);
                            series.addPoint([x, y], true, true);
                        }, 100);
                    }
                }
            },
            xAxis: {
                visible: false
            },
            yAxis: {
                visible: false
            },
            series: [{
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
        
                    for (i = -999; i <= 0; i += 1) {
                        data.push([
                            time + i * 1000,
                            Math.round(Math.random() * 100)
                        ]);
                    }
                    return data;
                }()),
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
        });
    }); 
}