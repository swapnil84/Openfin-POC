import { 
    STOCKSLIST_WINDOW_UUID, 
    DETAILS_WINDOW_TOPIC, 
    DETAILS_WINDOW_TOPIC_IND,
    JAVA_NATIVE_TO_HTML_TOPIC__DETAILS,
    ENTRYPOINT,
    WILDCARD_UUID,
    TOPIC__DROPDOWN,
    TOPIC__SYMBOL_CHANGE,
    JAVA_NATIVE_TOPIC,
    SHOW_SELL_SHORT
} from '../../js/constants.js';
import { publishMessage } from '../../js/messaging.js';

const entryPoint = ENTRYPOINT;
const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
const _stockNameWrapper = document.querySelector("#stock-name");
const _symbolDropdownWrapper = document.querySelector("#dropdown-container");
const _sellShortContainer = document.querySelector("#sell-short-container");
const staticData = {
    prevClose: "314.96",
    open: "315.03",
    dayRange: "314.75 - 318.52",
    weekRange: "314.96",
    marketCap: "314.75 - 318.52",
    beta5YMonthly: "314.96",
    peRatio: "314.75 - 318.52",
    eps: "314.75 - 318.52",
    earningDate: "314.75 - 318.52",
}

const initInterAppBus = () => {
    const hasDropDown = document.body.contains(document.getElementById('stock-dropdown'))
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    // Subscriber To Get List of Stock For Dropdown from Grid window
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        TOPIC__DROPDOWN,
        function (message, uuid) {
            createDropdownComponent(message);
        }
    );
    if (entryPoint === 'HTML') {
        // Data will be published from Grid window on load
        fin.desktop.InterApplicationBus.subscribe(
            'MPH_POC_PLTFORM_UUID',
            TOPIC__DROPDOWN,
            function (message, uuid) {
                _loader.style.display = 'none';
                _mainContainer.style.display = 'block';
                _stockNameWrapper.innerHTML = message[0].symbol;
                updateData(staticData);
            }
        );
        // Data will be published from Grid window on link click or dropdown select from chart window
        fin.desktop.InterApplicationBus.subscribe(
            'MPH_POC_PLTFORM_UUID',
            TOPIC__SYMBOL_CHANGE,
            function (message, uuid) {
                _loader.style.display = 'none';
                _mainContainer.style.display = 'block';
                _stockNameWrapper.innerHTML = message;
                document.getElementById('stock-dropdown').value = message;
                updateData(staticData);
            }
        );
    } else {
        //Data will be published from JAVA Onload as well as after receiving symbol from Grid link click
        subscribeToJavaData();
    }
};

function subscribeToJavaData() {
    fin.desktop.InterApplicationBus.subscribe(
        WILDCARD_UUID,
        JAVA_NATIVE_TO_HTML_TOPIC__DETAILS,
        function (message, uuid) {
            if (message !== undefined || message !== 'undefined') {
                _loader.style.display = 'none';
                _mainContainer.style.display = 'block';
                _stockNameWrapper.innerHTML = message.symbol;
                updateData(message);
            }
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
    initInterAppBus();
}

function init(){
    const _currentTimeWrapper = document.querySelector("#current-time");
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    _currentTimeWrapper.innerHTML = time;

    try{
        fin.desktop.main(function(){
            initWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

function updateData(res){
    console.log(res)
    document.getElementById("prevClose").innerText = `$ ${res.lastPrice}`;
    // document.getElementById("open").innerText = `$ ${res.o}`;
    // document.getElementById("dayRange").innerText = `$ ${res.l} - $ ${res.h}`;
    // document.getElementById("weekRange").innerText = data.weekRange;
    document.getElementById("marketCap").innerText = `$ ${res.marketCap}`;
    // document.getElementById("beta5YMonthly").innerText = data.beta5YMonthly;
    // document.getElementById("peRatio").innerText = data.peRatio;
    // document.getElementById("eps").innerText = data.eps;
    // document.getElementById("earningDate").innerText = data.earningDate;
}

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        _sellShortContainer.style.display = SHOW_SELL_SHORT===false ? 'none' : undefined;
        init();
    });
}());