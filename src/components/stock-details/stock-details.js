var stockDetails;

// const httpGetAsync = (theUrl, callback) => {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
//             callback(xmlHttp.responseText);
//     }
//     xmlHttp.open("GET", theUrl, true); // true for asynchronous 
//     xmlHttp.send(null);
// }

const getData = function (url) {
    axios.get(url).then(function (res) {
        console.log("url: " + url + "res.data" + res.data);
        const listItem = `<ul>
            <li>Previous Close - ${res.data.pc}</li>
            <li>Open - ${res.data.o}</li>
            <li>Day's Range - ${res.data.l} - ${res.data.h}</li>
        </ul>`
        _stockDetailsWrapper.innerHTML = listItem
        // updateDate(data);
        // gridOptions.api.setColumnDefs(this.getColumns(response.data));
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
}

const initInterApp = () => {
  _stockNameWrapper = document.querySelector("#stock-name-wrapper")
  _stockDetailsWrapper = document.querySelector("#stock-details-wrapper")
  
  fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
      console.log("The application " + uuid + " has subscribed to " + topic);
  });

  fin.desktop.InterApplicationBus.subscribe("mph-stocks-list-poc",
      "child-message",
      function (message, uuid) {
        const url = 'https://finnhub.io/api/v1/quote?symbol='+message.symbol+'&token=brgslqnrh5r9t6gjebng';
        getData(url);
        // httpGetAsync(url, function(response){
        //     console.log(response);
        //     const res = JSON.parse(response);
        //     const listItem = '<ul><li>Open - '+res.o+'</li></ul>'
        //     _stockDetailsWrapper.innerHTML = listItem
        //     // document.getElementById('stock-details-wrapper').appendChild(listItem);
        // })
        _stockNameWrapper.innerHTML = message.description+' ('+message.symbol+')';
      });
};

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

function updateDate(data){
    document.getElementById("prevClose").innerText = data.prevClose;
    document.getElementById("open").innerText = data.open;
    document.getElementById("dayRange").innerText = data.dayRange;
    document.getElementById("weekRange").innerText = data.weekRange;
    document.getElementById("marketCap").innerText = data.marketCap;
    document.getElementById("beta5YMonthly").innerText = data.beta5YMonthly;
    document.getElementById("peRatio").innerText = data.peRatio;
    document.getElementById("eps").innerText = data.eps;
    document.getElementById("earningDate").innerText = data.earningDate;
}

(function () {
    'use strict';
    document.addEventListener("DOMContentLoaded", function(){
        init();
    });
}());