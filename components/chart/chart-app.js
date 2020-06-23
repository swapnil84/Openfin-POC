import { DETAILS_WINDOW_TOPIC, DETAILS_WINDOW_TOPIC_IND } from '../../js/constants.js';

const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
const _symbolDropdownWrapper = document.querySelector("#dropdown-container");

const initInterApp = () => {
    fin.desktop.InterApplicationBus.addSubscribeListener(function (uuid, topic) {
        console.log("The application " + uuid + " has subscribed to " + topic);
    });
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        DETAILS_WINDOW_TOPIC,
        function (message, uuid) {
            console.log(message)
            _loader.style.display = 'none';
            _mainContainer.style.display = 'block';
            document.title = message[0].symbol;
            _symbolDropdownWrapper.appendChild(createSelect(message)); 
        }
    );
    fin.desktop.InterApplicationBus.subscribe(
        'MPH_POC_PLTFORM_UUID',
        DETAILS_WINDOW_TOPIC_IND,
        function (message, uuid) {
            document.title = message.symbol;
            document.getElementById('stock-dropdown').value = message.symbol;
        }
    );
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