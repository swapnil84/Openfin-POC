import { STOCKSLIST_WINDOW_UUID } from '../../js/constants.js';

const initInterApp = () => { 
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'MPH_STOCK_DETAILS_POC_TOPIC',
        function (message, uuid) {
            console.log(message)
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