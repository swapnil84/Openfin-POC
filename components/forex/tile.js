import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { addNewCurrency } from './forex.js';

export const fxTile = (data)  => {
    const currencyPairs = [
        'USD/CAD', 'USD/CNY', 'USD/CHF', 'USD/HKD', 'EUR/GBP', 'USD/KRW'
    ]
    const fxKeys = Object.keys(data.bidask);
    return html`
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                ${fxKeys.map((fxKey, index) => {
                    return currencyTab(fxKey, index)
                })}
            </div>
            <div class="button-add-fx" id="btn-add-fx" @click=${showCurrencyOptions}>
                <div class="currency-selector" id="currency-selector" style="display:none">
                    <ul>
                        ${currencyPairs.map(currency => {
                            return html`
                                <li @click=${() => addNewCurrency(currency)}>${currency}</li>
                            `
                        })}
                    </ul>
                </div>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            ${fxKeys.map((fxKey, index) => {
                const activeClass = index === 0 ? 'active' : '';
                const fxSymbol = fxKey.split(':')[1].split('_');
                const id = fxSymbol.join('').toLowerCase();
                return html`
                    <div class="tab-pane fade show ${activeClass}" 
                        id="nav-${id}" 
                        role="tabpanel" 
                        aria-labelledby="nav-${id}-tab">
                        ${curencyChartContainer(id, fxKey, data)}
                    </div>
                `
            })}
        </div>
    `
}

const curencyChartContainer = (id, fxKey, data) => {
return html`
            <div class="forex-tile">
                <div class="currency-wrapper">
                    <span class="currency"></span>
                    <span class="date">SPT(28May)</span>
                </div>
                <div class="currency-chart-wrapper">
                    <div class="currency-chart">
                        <div id="currency-chart-container-${id}" style="width: 100%;"></div>
                    </div>
                    <div class="up-down-indicator">
                        <span class="down">0.6</span>
                    </div>
                    <div class="price-container">
                        <div class="price-wrapper">
                            <div class="sell-buy">
                                <span class="label">SELL</span>
                                <span id="sell_${fxKey}">${data.bidask[fxKey][0][0]}</span>
                            </div>
                        </div>
                        <div class="price-wrapper">
                            <div class="sell-buy">
                                <span class="label">BUY</span>
                                <span id="buy_${fxKey}">${data.bidask[fxKey][0][1]}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="currency-value"><span class="label">EUR</span><span>1,000,000</span></div>
            </div>
            `
    }
const currencyTab = (fxKey, index) => {
    const fxSymbol = fxKey.split(':')[1].split('_');
    const id = fxSymbol.join('').toLowerCase();
    const activeClass = index === 0 ? 'active' : '';
    return html`
        <a class="nav-item nav-link ${activeClass}" 
            id="nav-${id}-tab" 
            data-toggle="tab" 
            href="#nav-${id}" 
            role="tab" 
            aria-controls="nav-${id}" 
            aria-selected="true">${fxSymbol[0]}/${fxSymbol[1]}</a>
    `
}

function showCurrencyOptions() {
    const _currencySelector = document.querySelector("#currency-selector");
    _currencySelector.style.display = _currencySelector.style.display === 'none' ? '' : 'none';
}