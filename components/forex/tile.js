import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { addCurrency } from './forex.js';

export const fxTile = ({fxSymbols})  => {
    const currencyPairs = [
        'USD/CAD', 'USD/CNY', 'USD/CHF', 'USD/HKD', 'EUR/GBP', 'USD/KRW'
    ]

    return html`
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                ${fxSymbols.map((item, index) => {
                    return currencyTab(item, index)
                })}
            </div>
            <div class="button-add-fx" id="btn-add-fx" @click=${showCurrencyOptions}>
                <div class="currency-selector" id="currency-selector" style="display:none">
                    <ul>
                        ${currencyPairs.map(currency => {
                            return html`
                                <li @click=${() => addCurrency(currency)}>${currency}</li>
                            `
                        })}
                    </ul>
                </div>
            </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
            ${fxSymbols.map((item, index) => {
                const activeClass = index === 0 ? 'active' : '';
                const id = item.join('').toLowerCase();
                return html`
                    <div class="tab-pane fade show ${activeClass}" 
                        id="nav-${id}" 
                        role="tabpanel" 
                        aria-labelledby="nav-${id}-tab">
                        ${curencyChartContainer(id)}
                    </div>
                `
            })}
        </div>
    `
}

const curencyChartContainer = (id) => html`
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
                                <span>1.07</span>
                            </div>
                            <div class="price">96</div>
                        </div>
                        <div class="price-wrapper">
                            <div class="sell-buy">
                                <span class="label">BUY</span>
                                <span>1.07</span>
                            </div>
                            <div class="price">96</div>
                        </div>
                    </div>
                </div>
            </div>
            `

const currencyTab = (item, index) => {
    const id = item.join('').toLowerCase();
    const activeClass = index === 0 ? 'active' : '';
    return html`
        <a class="nav-item nav-link ${activeClass}" 
            id="nav-${id}-tab" 
            data-toggle="tab" 
            href="#nav-${id}" 
            role="tab" 
            aria-controls="nav-${id}" 
            aria-selected="true">${item[0]}/${item[1]}</a>
    `
}

function showCurrencyOptions() {
    const _currencySelector = document.querySelector("#currency-selector");
    _currencySelector.style.display = _currencySelector.style.display === 'none' ? '' : 'none';
}