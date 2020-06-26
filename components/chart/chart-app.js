import { 
    DETAILS_WINDOW_TOPIC, 
    DETAILS_WINDOW_TOPIC_IND, 
    JAVA_NATIVE_TOPIC,
    JAVA_NATIVE_TO_HTML_TOPIC__CHART,
    ENTRYPOINT
} from '../../js/constants.js';
import { showChart } from './chart.js';

const entryPoint = ENTRYPOINT;
const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
const _symbolDropdownWrapper = document.querySelector("#dropdown-container");
const chartDataUrl = '../../api/new-intraday.json';

const initInterApp = () => {
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    if (entryPoint === 'HTML') {
        // Data will published from GRID page on initialization. Chart data will come from JSON file.
        fin.desktop.InterApplicationBus.subscribe(
            'MPH_POC_PLTFORM_UUID',
            DETAILS_WINDOW_TOPIC,
            function (message, uuid) {
                console.log(message)
                _symbolDropdownWrapper.appendChild(createSelect(message));
                _symbolDropdownWrapper.appendChild(createBtnGo());
                Highcharts.getJSON(chartDataUrl, function (data) {
                    _loader.style.display = 'none';
                    _mainContainer.style.display = 'block';
                    showChart(data)
                });
            }
        );
         // Data will be published from GRID page after grid link onclick
         fin.desktop.InterApplicationBus.subscribe(
            'MPH_POC_PLTFORM_UUID',
            DETAILS_WINDOW_TOPIC_IND,
            function (message, uuid) {
                document.getElementById('stock-dropdown').value = message.symbol;
            }
        );
    } else {
        // Data will published from JAVA
        fin.desktop.InterApplicationBus.subscribe(
            '*',
            JAVA_NATIVE_TO_HTML_TOPIC__CHART,
            function (message, uuid) {
                _loader.style.display = 'none';
                _mainContainer.style.display = 'block';
                // For message format, please refer "new-infraday.json" inside api folder at root level
                showChart(message)
            }
        );
    }
};

function createBtnGo() {
    var buttonGo = document.createElement("button");
    buttonGo.innerText = 'Go';
    buttonGo.className = 'btn-go';
    buttonGo.addEventListener('click', function(e) {
        changeSymbol(e);
    })

    return buttonGo;
}

function createSelect(message) {
    var selectEle = document.createElement("select");
    selectEle.id="stock-dropdown";
    for (const val of message) {
        var option = document.createElement("option");
        option.value = val.symbol;
        option.text = val.symbol;
        selectEle.appendChild(option);
    }

    return selectEle;
}

const initNoOpenFin = () => {
    alert("OpenFin is not available - you are probably running in a browser.");
}

const initWithOpenFin = () => {
    initInterApp();
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