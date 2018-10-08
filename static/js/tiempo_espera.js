// define data
var dataset = [
    {label: "Assamese", value: 13, date: "1999-10-12"},
    {label: "Bengali", value: 83, date: "1999-01-12"},
    {label: "Bodo", value: 1.4, date: "2000-03-12"},
    {label: "Dogri", value: 2.3, date: "2000-05-12"},
    {label: "Gujarati", value: 46, date: "2000-07-12"},
    {label: "Hindi", value: 300, date: "2000-09-12"},
    {label: "Kannada", value: 38, date: "2000-11-12"},
    {label: "Kashmiri", value: 5.5, date: "2001-01-12"},
    {label: "Konkani", value: 5, date: "1999-03-12"},
    {label: "Maithili", value: 20, date: "1999-05-12"},
    {label: "Malayalam", value: 33, date: "1999-07-12"},
    {label: "Manipuri", value: 1.5, date: "1999-09-12"},
    {label: "Marathi", value: 72, date: "1999-11-12"},
    {label: "Nepali", value: 2.9, date: "2000-01-12"},
    {label: "Oriya", value: 33, date: "2001-03-12"},
    {label: "Punjabi", value: 29, date: "2001-05-12"},
    {label: "Sanskrit", value: 0.01, date: "2001-07-12"},
    {label: "Santhali", value: 6.5, date: "2001-09-12"},
    {label: "Sindhi", value: 2.5, date: "2001-11-12"},
    {label: "Tamil", value: 61, date: "2001-01-12"},
    {label: "Telugu", value: 74, date: "2002-03-12"},
    {label: "Urdu", value: 52, date: "2002-10-12"}
];

var dates = dataset.map( a=> a.date);
dates.sort();

var dateFrom = dates[0];
var dateTo = dates[dates.length-1];

document.getElementById("fromDateId").value = dateFrom;
document.getElementById("toDateId").value = dateTo;


function filterData() {
    //split dateFrom and dateTo for formatting them into a Date object and compare them with date chosen by the user
    var dateTmp = dateFrom.split("-");
    var dateFromFormat = new Date(dateTmp[0], dateTmp[1] - 1, dateTmp[2]);
    var dateTmp = dateTo.split("-");
    var dateToFormat = new Date(dateTmp[0], dateTmp[1] - 1, dateTmp[2]);
    return dataset.filter(function (el) {
        var dateTmp = el.date.split("-");
        var dateEl = new Date(dateTmp[0], dateTmp[1] - 1, dateTmp[2]); //formatting date chosen by the user
        return dateEl >= dateFromFormat && dateEl <= dateToFormat; // if  dateEl (chosen by the user) is between dateFrom and dateTo
    });
}

function handlerFrom(e) {
    dateFrom = String(e.target.value);
    console.log(dateFrom, dateTo);
    var filteredDS = filterData();
    console.log(filteredDS);
    update(filteredDS);
}

function handlerTo(e) {
    dateTo = String(e.target.value);
    console.log(dateTo, dateFrom);
    var filteredDS = filterData();
    console.log(filteredDS);
    update(filteredDS);
}


var keys = [
    "White"
    , "Unknown"
    , "Black or African American"
    , "American Indian or Alaska Native"
    , "Asian"
    , "Native Hawaiian or Other Pacific Islander"
];

var width = 250,
    height = 250,
    radius = Math.min(width, height) / 2;

var svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("g").attr("class", "slices");
svg.append("g").attr("class", "labels");
svg.append("g").attr("class", "lines");


var pie = d3.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

var arc = d3.arc()
    .outerRadius(radius * 1.0)
    .innerRadius(radius * 0.0);

var outerArc = d3.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 1);

var key = function(d) { return d.data.label; };

var color = d3.scaleOrdinal(d3.schemePastel1)
    .domain(dataset.map(a => a.label));



function mergeWithFirstEqualZero(first, second){

    var secondSet = d3.set();

    second.forEach(function(d) { secondSet.add(d.label); });

    var onlyFirst = first
        .filter(function(d){ return !secondSet.has(d.label) })
        .map(function(d) { return {label: d.label, value: 0}; });

    var sortedMerge = d3.merge([ second, onlyFirst ])
        .sort(function(a, b) {
            return d3.ascending(a.label, b.label);
        });

    return sortedMerge;
}

// define tooltip
var tooltip = d3.select('#pie') // select element in the DOM with id 'chart'
    .append('div') // append a div element to the element we've selected
    .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above
    .attr('class', 'label'); // add class 'label' on the selection

tooltip.append('div') // add divs to the tooltip defined above
    .attr('class', 'value'); // add class 'count' on the selection

tooltip.append('div') // add divs to the tooltip defined above
    .attr('class', 'percent'); // add class 'percent' on the selection


var svgLegned3 = d3.select(".legend3").append("svg");


update(dataset);
function update(data) {

    var duration = 500;

    var oldData = svg.select(".slices")
        .selectAll("path")
        .data().map(function(d) { return d.data });

    if (oldData.length == 0) oldData = data;

    var was = mergeWithFirstEqualZero(data, oldData);
    var is = mergeWithFirstEqualZero(oldData, data);

    var slice = svg.select(".slices")
        .selectAll("path")
        .data(pie(was), key);

    slice.enter()
        .insert("path")
        .attr("class", "slice")
        .style("fill", function(d) { return color(d.data.label); })
        .each(function(d) {
            this._current = d;
        });

    slice = svg.select(".slices")
        .selectAll("path")
        .data(pie(is), key);

    /* LEGEND */

    svgLegned3.selectAll('*').remove();

    var legendVals = data.map(a => a.label);

    console.log(legendVals);

    svgLegned3.attr("height", legendVals.length*20);

    var legend3 = svgLegned3.selectAll('.legend3')
        .data(legendVals)
        .enter().append('g')
        .attr("class", "legends3")
        .attr("transform", function (d, i) {
            {
                return "translate(0," + i * 20 + ")"
            }
        });

    //left little square
    legend3.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return color(d);
        });

    legend3.append('text')
        .attr("x", 20)
        .attr("y", 10)
        //.attr("dy", ".35em")
        .text(function (d, i) {
            return d
        })
        .attr("class", "textselected")
        .style("text-anchor", "start")
        .style("font-size", 15);


    /* ------- TOOLTIPS-------*/
    // mouse event handlers are attached to path so they need to come after its definition
    slice.on('mouseover', function(d) {  // when mouse enters div
        var total = d3.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset
            return d.value; // value
        }));
        var percent = Math.round(1000 * d.data.value / total) / 10; // calculate percent
        tooltip.select('.label').html(d.data.label); // set current label
        tooltip.select('.value').html('$' + d.data.value); // set current count
        tooltip.select('.percent').html(percent + '%'); // set percent calculated above
        tooltip.style('display', 'block'); // set display
    });

    slice.on('mouseout', function() { // when mouse leaves div
        tooltip.style('display', 'none'); // hide tooltip for that element
    });

    slice.on('mousemove', function(d) { // when mouse moves
        tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
            .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
    });



    slice.transition()
        .duration(duration)
        .attrTween("d", function(d) {
            var interpolate = d3.interpolate(this._current, d);
            var _this = this;
            return function(t) {
                _this._current = interpolate(t);
                return arc(_this._current);
            };
        });


    slice = svg.select(".slices")
        .selectAll("path")
        .data(pie(data), key);

    slice.exit()
        .transition()
        .delay(duration)
        .duration(0)
        .remove();

}
