import { STOCKSLIST_WINDOW_UUID, DETAILS_WINDOW_TOPIC, DETAILS_WINDOW_TOPIC_IND } from '../../js/constants.js';

var stockDetails;
const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
const _stockNameWrapper = document.querySelector("#stock-name");
const _symbolDropdownWrapper = document.querySelector("#dropdown-container");

const initInterAppBus = () => {  
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    // Default Subscriber When Coming from Watchlist
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        DETAILS_WINDOW_TOPIC,
        function (message, uuid) {
            console.log(message)
            _loader.style.display = 'none';
            _mainContainer.style.display = 'block';
            _stockNameWrapper.innerHTML = message[0].symbol;
            document.title = message[0].symbol;
            updateData(message[0]);
            _symbolDropdownWrapper.appendChild(createSelect(message));   
        }
    );
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        DETAILS_WINDOW_TOPIC_IND,
        function (message, uuid) {
            _stockNameWrapper.innerHTML = message.symbol;
            document.title = message.symbol;
            document.getElementById('stock-dropdown').value = message.symbol;
            updateData(message);
        }
    );
    // Subscriber when coming from Java
    // fin.desktop.InterApplicationBus.subscribe(
    //     'MPH_POC_PLTFORM_UUID',
    //     DETAILS_WINDOW_TOPIC,
    //     function (message, uuid) {
    //         console.log(message)
    //         _loader.style.display = 'none';
    //         _mainContainer.style.display = 'block';
    //         _stockNameWrapper.innerHTML = message.symbol;
    //         updateData(message);
    //     }
    // );
};

function createSelect(message) {
    var selectEle = document.createElement("select");
    selectEle.id="stock-dropdown";
    for (const val of message) {
        var option = document.createElement("option");
        option.value = val.symbol;
        option.text = val.symbol;
        selectEle.appendChild(option);
    }

    selectEle.addEventListener('change', function(e) {
        changeSymbol(e);
    })
    return selectEle;
}

function changeSymbol(e) {
    console.log(e.target.value)
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

var data = {
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

function updateData(res){
    console.log(res)
    document.getElementById("prevClose").innerText = `${res.lastPrice}`;
    // document.getElementById("open").innerText = `${res.o}`;
    // document.getElementById("dayRange").innerText = `${res.l} - ${res.h}`;
    // document.getElementById("weekRange").innerText = data.weekRange;
    document.getElementById("marketCap").innerText = `${res.marketCap}`;
    // document.getElementById("beta5YMonthly").innerText = data.beta5YMonthly;
    // document.getElementById("peRatio").innerText = data.peRatio;
    // document.getElementById("eps").innerText = data.eps;
    // document.getElementById("earningDate").innerText = data.earningDate;
}

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        init();
    });
}());