export function showChart(data) {
    console.log(data)
    // console.log("Data: " + data[1]);
    // Create the chart
    Highcharts.stockChart('container', {
        // title: {
        //     text: 'AAPL stock price by minute'
        // },
        // subtitle: {
        //     text: 'Using ordinal X axis'
        // },
        chart: {
            backgroundColor: '#25262A',
            height: 315,
            // borderWidth: 1,
            // borderColor: '#333333'
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
            lineColor: '#153259',
            minorGridLineColor: '#505053',
            tickColor: '#424346',
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        // xAxis: {
        //     gapGridLineWidth: 0,
        //     plotBands: {
        //         borderWidth: 1,
        //         borderColor: '#424346'
        //     },
        //     crosshair: {
        //         color: '#cccccc',
        //         dashStyle: 'Solid',
        //         snap: true,
        //         width: 1,
        //         zIndex: 2
        //     }
        // },
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
        // yAxis: {
        //     plotBands: {
        //         borderWidth: 1,
        //         borderColor: '#424346'
        //     },
        //     // left: '30',
        //     lineColor: '#424346',
        //     lineWidth: 1,
        //     crosshair: {
        //         className:undefined,
        //         color: '#cccccc',
        //         dashStyle: 'Solid',
        //         snap: true,
        //         width: 1,
        //         zIndex: 2
        //     }
        // },
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
                // marker: {
                //     lineColor: '#333'
                // }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
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
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            buttonTheme: {
                fill: 'none',
                // stroke: '#000000',
                style: {
                    color: '#4CD2D4',
                    // innerWidth: 100
                },
                states: {
                    hover: {
                        fill: '#707073',
                        // stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#494D52',
                        // stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            // buttons: [
            // // {
            // //     type: 'hour',
            // //     count: 1,
            // //     text: '1h'
            // // }, 
            // {
            //     type: 'day',
            //     text: '1D'
            // },
            // // {
            // //     type: '5day',
            // //     count: 1,
            // //     text: '5D'
            // // }, 
            // // {
            // //     type: '1month',
            // //     count: 1,
            // //     text: '1M'
            // // }, {
            // //     type: '6month',
            // //     count: 1,
            // //     text: '6M'
            // // }, {
            // //     type: 'YTD',
            // //     count: 1,
            // //     text: 'YTD'
            // // }, {
            // //     type: '1year',
            // //     count: 1,
            // //     text: '1Y'
            // // }, {
            // //     type: '5year',
            // //     count: 1,
            // //     text: '5Y'
            // // }, 
            // {
            //     type: 'all',
            //     text: 'MAX'
            // }],
            selected: 1,
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
            type: 'area',
            data: data,
            gapSize: 5,
            color: '#11407F',
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
                    [1, '#11407F'],
                    [1, '#283B53']
                ]
            },
            opacity: 0.6,
            threshold: null
        }],
        credits: {
            enabled: false
        },
    });
}

// function showChart(data){
//     // Create the chart
//     Highcharts.stockChart('container', {
//         rangeSelector: {
//             selected: 1
//         },
//         title: {
//             text: 'Stock Price'
//         },
//         navigator: {
//             enabled: false
//         },
//         series: [{
//             name: 'AAPL Stock Price',
//             data: data,
//             tooltip: {
//                 valueDecimals: 2
//             }
//         }]
//     });
// }

// Highcharts.chart('container', {
//   chart: {
//     type: 'area'
//   },
//   accessibility: {
//     description: 'Image description: An area chart compares the nuclear stockpiles of the USA and the USSR/Russia between 1945 and 2017. The number of nuclear weapons is plotted on the Y-axis and the years on the X-axis. The chart is interactive, and the year-on-year stockpile levels can be traced for each country. The US has a stockpile of 6 nuclear weapons at the dawn of the nuclear age in 1945. This number has gradually increased to 369 by 1950 when the USSR enters the arms race with 6 weapons. At this point, the US starts to rapidly build its stockpile culminating in 32,040 warheads by 1966 compared to the USSR’s 7,089. From this peak in 1966, the US stockpile gradually decreases as the USSR’s stockpile expands. By 1978 the USSR has closed the nuclear gap at 25,393. The USSR stockpile continues to grow until it reaches a peak of 45,000 in 1986 compared to the US arsenal of 24,401. From 1986, the nuclear stockpiles of both countries start to fall. By 2000, the numbers have fallen to 10,577 and 21,000 for the US and Russia, respectively. The decreases continue until 2017 at which point the US holds 4,018 weapons compared to Russia’s 4,500.'
//   },
//   title: {
//     text: 'US and USSR nuclear stockpiles'
//   },
//   subtitle: {
//     text: 'Sources: <a href="https://thebulletin.org/2006/july/global-nuclear-stockpiles-1945-2006">' +
//       'thebulletin.org</a> &amp; <a href="https://www.armscontrol.org/factsheets/Nuclearweaponswhohaswhat">' +
//       'armscontrol.org</a>'
//   },
//   xAxis: {
//     allowDecimals: false,
//     labels: {
//       formatter: function() {
//         return this.value; // clean, unformatted number for year
//       }
//     },
//     accessibility: {
//       rangeDescription: 'Range: 1940 to 2017.'
//     }
//   },
//   yAxis: {
//     title: {
//       text: 'Nuclear weapon states'
//     },
//     labels: {
//       formatter: function() {
//         return this.value / 1000 + 'k';
//       }
//     }
//   },
//   tooltip: {
//     pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
//   },
//   plotOptions: {
//     area: {
//       pointStart: 1940,
//       marker: {
//         enabled: false,
//         symbol: 'circle',
//         radius: 2,
//         states: {
//           hover: {
//             enabled: true
//           }
//         }
//       }
//     }
//   },
//   series: [{
//     name: 'USA',
//     data: [
//       null, null, null, null, null, 6, 11, 32, 110, 235,
//       369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
//       20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
//       26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
//       24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
//       21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
//       10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
//       5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
//     ]
//   }]
// });