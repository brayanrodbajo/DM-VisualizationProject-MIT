
console.log(dataset);
var ageRangeDS = [
    {
        "title": "1-25",
        "value": 0,
        "color": "#cc0000"
    },
    {
        "title": "25-50",
        "value": 0,
        "color": "#6666c1"
    },
    {
        "title": "50-75",
        "value": 0,
        "color": "#f2de15"
    },
    {
        "title": "75+",
        "value": 0,
        "color": "#458b00"
    }
];


var userTypeDS = [
    {
        "title": "Cotizante",
        "value": 0,
        "color": "#cc0000"
    },
    {
        "title": "Beneficiario",
        "value": 0,
        "color": "#d63232"
    },
    {
        "title": "Cotizante",
        "value": 0,
        "color": "#6666c1"
    },
    {
        "title": "Beneficiario",
        "value": 0,
        "color": "#8484cd"
    },
    {
        "title": "Cotizante",
        "value": 0,
        "color": "#f2de15"
    },
    {
        "title": "Beneficiario",
        "value": 0,
        "color": "#f4e443"
    },
    {
        "title": "Cotizante",
        "value": 0,
        "color": "#458b00"
    },
    {
        "title": "Beneficiario",
        "value": 0,
        "color": "#6aa232"
    }
];

var sexDS = [
    {
        "title": "M",
        "value": 0,
        "color": "#cc0000"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#d11919"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#d63232"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#db4c4c"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#6666c1"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#7575c7"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#8484cd"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#9393d3"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#f2de15"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#f3e12c"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#f4e443"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#f5e75b"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#458b00"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#579619"
    },
    {
        "title": "M",
        "value": 0,
        "color": "#6aa232"
    },
    {
        "title": "F",
        "value": 0,
        "color": "#7cad4c"
    }
];

function updateData(dataset) {
    //initializing values to 0
    ageRangeDS.map(a => a["value"]=0);
    userTypeDS.map(a => a["value"]=0);
    sexDS.map(a => a["value"]=0);

    dataset.map(function (a) {
        if (a[1] == "1-25") {
            ageRangeDS[0]["value"] += a[2];
            if (a[0] == "cotizante") {
                userTypeDS[0]["value"] += a[2];
                sexDS[0]["value"] += a[3];
                sexDS[1]["value"] += a[4];
            } else {
                userTypeDS[1]["value"] += a[2];
                sexDS[2]["value"] += a[3];
                sexDS[3]["value"] += a[4];
            }
        } else if (a[1] == "25-50") {
            ageRangeDS[1]["value"] += a[2];
            if (a[0] == "cotizante") {
                userTypeDS[2]["value"] += a[2];
                sexDS[4]["value"] += a[3];
                sexDS[5]["value"] += a[4];
            } else {
                userTypeDS[3]["value"] += a[2];
                sexDS[6]["value"] += a[3];
                sexDS[7]["value"] += a[4];
            }
        } else if (a[1] == "50-75") {
            ageRangeDS[2]["value"] += a[2];
            if (a[0] == "cotizante") {
                userTypeDS[4]["value"] += a[2];
                sexDS[8]["value"] += a[3];
                sexDS[9]["value"] += a[4];
            } else {
                userTypeDS[5]["value"] += a[2];
                sexDS[10]["value"] += a[3];
                sexDS[11]["value"] += a[4];
            }
        } else {
            ageRangeDS[3]["value"] += a[2];
            if (a[0] == "cotizante") {
                userTypeDS[6]["value"] += a[2];
                sexDS[12]["value"] += a[3];
                sexDS[13]["value"] += a[4];
            } else {
                userTypeDS[7]["value"] += a[2];
                sexDS[14]["value"] += a[3];
                sexDS[15]["value"] += a[4];
            }
        }
    });
}

function updateChart(dataset) {
    updateData(dataset);
    chart2.dataProvider = ageRangeDS;
    chart2.validateData();
    chart3.dataProvider = userTypeDS;
    chart3.validateData();
    chart4.dataProvider = sexDS;
    chart4.validateData();

}

updateData(dataset);

console.log(userTypeDS, ageRangeDS, sexDS);

var suma= 0;
dataset.map(a => suma+=a[3]);
/**
 * Plugin: Manipulate z-index of the chart
 */
AmCharts.addInitHandler(function(chart) {

    // init holder for nested charts
    if (AmCharts.nestedChartHolder === undefined)
        AmCharts.nestedChartHolder = {};

    if (chart.bringToFront === true) {
        chart.addListener("init", function(event) {
            // chart inited
            var chart = event.chart;
            var div = chart.div;
            var parent = div.parentNode;

            // add to holder
            if (AmCharts.nestedChartHolder[parent] === undefined)
                AmCharts.nestedChartHolder[parent] = [];
            AmCharts.nestedChartHolder[parent].push(chart);

            // add mouse mouve event
            chart.div.addEventListener('mousemove', function() {

                // calculate current radius
                var x = Math.abs(chart.mouseX - (chart.realWidth / 2));
                var y = Math.abs(chart.mouseY - (chart.realHeight / 2));
                var r = Math.sqrt(x*x + y*y);

                // check which chart smallest chart still matches this radius
                var smallChart;
                var smallRadius;
                for(var i = 0; i < AmCharts.nestedChartHolder[parent].length; i++) {
                    var checkChart = AmCharts.nestedChartHolder[parent][i];

                    if((checkChart.radiusReal < r) || (smallRadius < checkChart.radiusReal)) {
                        checkChart.div.style.zIndex = 1;
                    }
                    else {
                        if (smallChart !== undefined)
                            smallChart.div.style.zIndex = 1;
                        checkChart.div.style.zIndex = 2;
                        smallChart = checkChart;
                        smallRadius = checkChart.radiusReal;
                    }

                }
            }, false);
        });
    }

}, ["pie"]);

/**
 * Create the charts
 */
var chart1 = AmCharts.makeChart("chart1", {
    "type": "pie",
    "bringToFront": true,
    "dataProvider": [{
        "title": "T",
        "value": suma,
        "color": "#090E0F"
    }],
    "startDuration": 0,
    "pullOutRadius": 0,
    "color": "#fff",
    "fontSize": 20,
    "titleField": "title",
    "valueField": "value",
    "colorField": "color",
    "labelRadius": -25,
    "labelColor": "#fff",
    "radius": 25,
    "innerRadius": 0,
    "labelText": "[[title]]",
    "balloonText": "[[title]]: $[[value]]"
});

var chart2 = AmCharts.makeChart("chart2", {
    "type": "pie",
    "bringToFront": true,
    "dataProvider": ageRangeDS,
    "startDuration": 1,
    "pullOutRadius": 0,
    "color": "#fff",
    "fontSize": 14,
    "titleField": "title",
    "valueField": "value",
    "colorField": "color",
    "labelRadius": -28,
    "labelColor": "#fff",
    "radius": 80,
    "innerRadius": 27,
    "outlineAlpha": 1,
    "outlineThickness": 4,
    "labelText": "[[title]]",
    "balloonText": "[[title]]: $[[value]]"
});

var chart3 = AmCharts.makeChart("chart3", {
    "type": "pie",
    "bringToFront": true,
    "dataProvider": userTypeDS,
    "startDuration": 1,
    "pullOutRadius": 0,
    "color": "#fff",
    "fontSize": 11,
    "titleField": "title",
    "valueField": "value",
    "colorField": "color",
    "labelRadius": -27,
    "labelColor": "#fff",
    "radius": 135,
    "innerRadius": 82,
    "outlineAlpha": 1,
    "outlineThickness": 4,
    "labelText": "[[title]]",
    "balloonText": "[[title]]: $[[value]]"
});

var chart4 = AmCharts.makeChart("chart4", {
    "type": "pie",
    "bringToFront": true,
    "dataProvider": sexDS,
    "startDuration": 1,
    "pullOutRadius": 0,
    "color": "#fff",
    "fontSize": 15,
    "titleField": "title",
    "valueField": "value",
    "colorField": "color",
    "labelRadius": -27,
    "labelColor": "#fff",
    "radius": 190,
    "innerRadius": 137,
    "outlineAlpha": 1,
    "outlineThickness": 4,
    "labelText": "[[title]]",
    "balloonText": "[[title]]: $[[value]]",
    "allLabels": [{
        "text": "",
        "bold": true,
        "size": 18,
        "color": "#404040",
        "x": 0,
        "align": "center",
        "y": 20
    }]
});



/****** DATES **********/

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
}

if(mm<10) {
    mm = '0'+mm
}

var dateFrom= "0001-01-01";
var dateTo= yyyy + '/' + mm + '/' + dd;


$('#fromDateId').datepicker({
    uiLibrary: 'bootstrap4',
    format: 'yyyy-mm-dd'
});

$('#toDateId').datepicker({
    uiLibrary: 'bootstrap4',
    minDate: function () {
        return $('#fromDateId').val();
    },
    format: 'yyyy-mm-dd'
});

/* manage date in date from input on change */
function handlerFrom(e) {
    dateFrom = String(e.target.value);
    console.log(dateFrom, dateTo);
    sendData();
}

/* manage date in date to input on change */
function handlerTo(e) {
    dateTo = String(e.target.value);
    console.log(dateFrom, dateTo);
    sendData();
}


/****** SEND DATA **********/

function sendData(){

    $.ajax({
        url: "/costo_pacientes",
        type: "POST",
        data: JSON.stringify({date_from: dateFrom.replace(/\//g, '-'), date_to: dateTo.replace(/\//g, '-')}),
        contentType: "application/json; charset=utf-8",
        success: function(dat) { console.log(JSON.parse(dat)); updateChart(JSON.parse(dat)["dataset"]); }
    });
}