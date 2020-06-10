var stockDetails;

async function initWithOpenFin(){
    fin.desktop.main(function() {
        fin.desktop.InterApplicationBus.subscribe("mph-stocks-list-poc", "stock selected", function (message, uuid, name) {
            this.stockDetails = message.symbol;
            document.getElementById("parentName").innerText = message.symbol;
        });
    });
}

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
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