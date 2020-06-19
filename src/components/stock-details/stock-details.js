import { STOCKSLIST_WINDOW_UUID } from '../../js/constants.js';

var stockDetails;

const getData = function (url) {
    axios.get(url).then(function (res) {
        updateDate(res.data);
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
}

const initInterApp = () => {
    const _stockNameWrapper = document.querySelector("#stock-name")
  
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    fin.desktop.InterApplicationBus.subscribe(
        STOCKSLIST_WINDOW_UUID,
        fin.me.identity.uuid,
        function (message, uuid) {
            // const url = 'https://finnhub.io/api/v1/quote?symbol='+message.symbol+'&token=brgslqnrh5r9t6gjebng';
            // getData(url);
            updateData(message);
            _stockNameWrapper.innerHTML = message.symbol;
        }
    );
};

const initNoOpenFin = () => {
    alert("OpenFin is not available - you are probably running in a browser.");
}

const initWithOpenFin = () => {
    initInterApp();
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