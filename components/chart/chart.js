export function showChart(data) {
    Highcharts.setOptions({
        lang:{
            rangeSelectorZoom: ''
        }
    });
    var chart = Highcharts.stockChart('container', {
        chart: {
            marginRight: 50,
            backgroundColor: '#353a40',
            height: 300,
            style: {
                fontFamily: '\'Myriad\', sans-serif',
                fontSize: 12
            },
        },
        time: {
            timezone: 'America/New_York'
        },
        xAxis: {
            gridLineColor: '#4e5053',
            labels: {
                style: {
                    color: '#a6a8ab'
                }
            },
            lineWidth: 1,
            lineColor: '#4e5053',
            minorGridLineColor: '#4e5053',
            tickColor: '#4e5053',
            title: {
                style: {
                    color: '#A0A0A3'
                }
            },
            crosshair: true
        },
        yAxis: [
            {
                lineWidth: 1,
                lineColor: '#4e5053',
                opposite: false,
            },
            {
            gridLineColor: '#4e5053',
            lineWidth: 1,
            lineColor: '#4e5053',
            minorGridLineColor: '#505053',
            tickColor: '#4e5053',
            tickWidth: 0,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            },
            opposite: true,
            crosshair: {
                label: {
                    enabled: true,
                    format: '{value:.2f}',
                    style: {
                        color: '#000000',
                        fontWeight: "700", 
                        fontSize: "12px",
                    },
                    shape: 'box'
                }
            },
            labels: {
                style: {
                    color: '#6d7075'
                },
                align: 'left',
                format: '{value:.2f}',
                y: 3,
                x: 10
            }
            }
        ],
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
            x: 150,
            y: 0,
            buttons: [
                {
                    type: 'day',
                    count: 1,
                    text: '1D'
                },
                {
                    type: 'day',
                    count: 5,
                    text: '5D',
                    events: {
                        click: function () {
                            // console.log(chart)
                            renderLabel(chart)
                        }
                    }
                },
                {
                    type: 'month',
                    count: 1,
                    text: '1M'
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
                    },
                    disabled: {
                        fill: '#aaaaaa',
                        style: {
                            color: '#666666'
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
        series: [
            {
                name: 'AAPL',
                // type: 'area',
                type: 'line',
                keys: ['x', 'y', 'id'],
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
                threshold: null,
                yAxis: 1
            }
            // {
            //     type: 'column',
            //     name: 'Volume',
            //     id: 'volume',
            //     data: volume,
            //     // yAxis: 1
            // }
        ],
        // annotations: [{
        //     labels: [{
        //         point: {
        //             x: 600,
        //             y: 35
        //         },
        //         text: '{point.plotX}'
        //     }],
        // }],
        credits: {
            enabled: false
        },
    },
    function (chart) { // on complete
        // renderLabel(chart)
    }
    );

    function getPoint(e) {
        console.log(e)
    }

    function renderLabel(chart) {
        console.log(chart)
        var point = chart.series[0].points[chart.series[0].points.length - 1];
        var pxX = chart.xAxis[0].toPixels(point.x, true);
        var pxY = chart.yAxis[1].toPixels(point.y, true);
        console.log(point.y, pxY, pxX)
        const pointY = Math.round((point.y + Number.EPSILON) * 100) / 100;
        chart.renderer.label(pointY, 607, pxY + 30, 'box', point.plotX + chart.plotLeft, point.plotY + chart.plotTop)
            .css({
                color: '#000000'
            })
            .attr({
                fill: '#e18d20',
                padding: 5,
                r: 5,
                zIndex: 6
            })
            .add();
    }
    // Use the Time object
    console.log(
        'Current time in New York',
        chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
    );
}