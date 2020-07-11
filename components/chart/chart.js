export function showChart(data) {
    Highcharts.setOptions({
        lang:{
            rangeSelectorZoom: ''
        }
    });
    Highcharts.stockChart('container', {
        chart: {
            backgroundColor: '#25262A',
            height: 315,
            style: {
                fontFamily: '\'Myriad\', sans-serif',
                fontSize: 12
            },
        },
        xAxis: {
            gridLineColor: '#424346',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#153156',
            minorGridLineColor: '#505053',
            tickColor: '#424346',
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        yAxis: {
            gridLineColor: '#424346',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#424346',
            minorGridLineColor: '#505053',
            tickColor: '#424346',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#F0F0F3',
                    style: {
                        fontSize: '13px'
                    }
                },
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            },
            line: {
                dashStyle: 'ShortDot'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },        
        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 1,
                text: '1D'
            },
            {
                type: 'day',
                count: 5,
                text: '5D'
            },
            {
                type: 'month',
                count: 1,
                text: '1M'
            },
             {
                type: 'all',
                text: 'MAX'
            }    
            ],
            buttonTheme: {
                states: {
                    hover: {
                        fill: '#707073',
                        style: {
                            color: '#ffffff'
                        }
                    },
                    select: {
                        fill: '#494D52',
                        style: {
                            color: '#ffffff'
                        }
                    }
                }
            },
            selected: 0,
            inputEnabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false,
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'AAPL',
            // type: 'area',
            type: 'line',
            data: data,
            gapSize: 5,
            color: '#e18d20',
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                 linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, '#11407F'],
                    [1, Highcharts.color('#11407F').setOpacity(0).get('rgba')]
                ]
            },
            threshold: null
        }],
        credits: {
            enabled: false
        },
    });
}