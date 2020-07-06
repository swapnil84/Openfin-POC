import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';
import { getTime } from '../../js/util.js';

export const newsTiles = ({newsList})  => {

    return html`
        ${newsList.map((news) => {
            const timestamp = getTime(news.datetime);
            return html`
                <li class="news">
                    <span class="date">
                        <span class="day">${timestamp.date}<span class="dot"></span></span>
                        <span class="month">${timestamp.month.toUpperCase()}</span>
                    </span>
                    <span class="headline">${news.headline}
                        <span class="time">${timestamp.time}</span>
                    </span>
                </li>
            `
        })}
    `
}
