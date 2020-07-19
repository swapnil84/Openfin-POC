import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { 
    TOPIC__DROPDOWN,
    TOPIC__SYMBOL_CHANGE,
    JAVA_NATIVE_TOPIC,
    ENTRYPOINT,
 } from '../../js/constants.js';
import { publishMessage } from '../../js/messaging.js';
import { getDate } from '../../js/util.js';
import { newsTiles } from './news-list.js';

const _loader = document.querySelector("#loader");
const _mainContainer = document.querySelector("#main-container");
const _symbolDropdownWrapper = document.querySelector("#dropdown-container");
const entryPoint = ENTRYPOINT;

document.addEventListener("DOMContentLoaded", function(){
    initNews();
});

function initNews(){
    try{
        fin.desktop.main(function(){
            initNewsWithOpenFin();
        })
    }catch(err){
        initNoOpenFin();
    }
};

function initNoOpenFin(){
    alert("OpenFin is not available - you are probably running in a browser.");
}

function initNewsWithOpenFin(){
    initInterAppBus();
}

async function getNews(symbol) {
    const dateRange = `from=${getDate(1)}&to=${getDate(0)}`;
    const result = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&${dateRange}&token=brgslqnrh5r9t6gjebng`);
    if(result.ok) {
        const newsList = await result.json();
        render(newsTiles({newsList}), document.getElementById('news-container'))
        _loader.style.display = 'none';
        _mainContainer.style.display = 'block';
    }
}

function changeSymbol() {
    const ddValue = document.getElementById('stock-dropdown').value;
    publishMessage(TOPIC__SYMBOL_CHANGE, ddValue);
    publishMessage(JAVA_NATIVE_TOPIC, ddValue);
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

function initInterAppBus() {
    if (entryPoint === 'HTML') {
        // Symbol will be published from Grid window bydefault
        fin.desktop.InterApplicationBus.subscribe(
            'MPH_POC_PLTFORM_UUID',
            TOPIC__DROPDOWN,
            function (message, uuid) {
                _loader.style.display = 'none';
                _mainContainer.style.display = 'block';
                createDropdownComponent(message);
                getNews(message[0].symbol);
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
        // Data will be published from Grid window on link click or dropdown select from chart window
        fin.desktop.InterApplicationBus.subscribe(
            'MPH_POC_PLTFORM_UUID',
            TOPIC__SYMBOL_CHANGE,
            function (message, uuid) {
                getNews(message);
            }
        );
    } else {
    }
};