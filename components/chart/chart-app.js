import { 
    JAVA_NATIVE_TOPIC,
    JAVA_NATIVE_TO_HTML_TOPIC__CHART,
    WILDCARD_UUID,
    TOPIC__DROPDOWN,
    TOPIC__SYMBOL_CHANGE,
    ENTRYPOINT
} from '../../js/constants.js';
import { publishMessage } from '../../js/messaging.js';
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
    // Subscriber To Get List of Stock For Dropdown from Grid window
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        TOPIC__DROPDOWN,
        function (message, uuid) {
            _loader.style.display = 'none';
            _mainContainer.style.display = 'block';
            createDropdownComponent(message);
        }
    );
    // Data will be published from Grid window on link click or dropdown select from chart window
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        TOPIC__SYMBOL_CHANGE,
        function (message, uuid) {
            document.getElementById('stock-dropdown').value = message;
        }
    );
    if (entryPoint === 'HTML') {
        Highcharts.getJSON(chartDataUrl, function (data) {
            showChart(data)
        });
    } else {
        // Data will published from JAVA
        subscribeToJavaData();
    }
};

function subscribeToJavaData() {
    fin.desktop.InterApplicationBus.subscribe(
        WILDCARD_UUID,
        JAVA_NATIVE_TO_HTML_TOPIC__CHART,
        function (message, uuid) {
            console.log(message)
            _loader.style.display = 'none';
            _mainContainer.style.display = 'block';
            // For message format, please refer "new-infraday.json" inside api folder at root level
            showChart(message)
        }
    );
}

function createBtnGo() {
    var buttonGo = document.createElement("button");
    buttonGo.innerText = 'Go';
    buttonGo.className = 'btn-go';
    buttonGo.addEventListener('click', function(e) {
        changeSymbol();
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

function createDropdownComponent(message) {
    if (_symbolDropdownWrapper.childNodes.length === 0) {
        _symbolDropdownWrapper.appendChild(createSelect(message));
        _symbolDropdownWrapper.appendChild(createBtnGo());
    }
}

function changeSymbol() {
    const ddValue = document.getElementById('stock-dropdown').value;
    publishMessage(TOPIC__SYMBOL_CHANGE, ddValue);
    publishMessage(JAVA_NATIVE_TOPIC, ddValue);
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