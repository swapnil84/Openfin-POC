import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

class CurrencyTile extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render = async () => {
        const currencyResponse = {
            "base": "USD",
            "quote": {
                "EUR": 0.91,
                "JPY": 114.583548,
                "GBP": 0.874841,
                "USD": 1,
            }
        }
        const currencies = Object.keys(currencyResponse.quote)
        const currencyTile = html`
            <div id="currency-container">
                ${currencies.map((item) => {
                    if (item !== 'USD') {
                        return html`
                            <div class="forex-tile">
                                <div class="currency-wrapper">
                                    <span class="currency">${currencyResponse.base}/${item}</span>
                                    <span class="date">SPT(28May)</span>
                                </div>
                                <div class="currency-chart-wrapper">
                                    <div class="currency-chart">
                                        <div id="currency-chart-container-${item}" style="width: 100%;"></div>
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
                    }
                }
                )}
            </div>
        `;
        return render(currencyTile, this);
    }
}

customElements.define('currency-tile', CurrencyTile);
