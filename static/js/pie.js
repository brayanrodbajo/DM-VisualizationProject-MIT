// define data
/*var dataset = [
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
];*/

var dates = dataset.map( a=> a.date);
dates.sort();

var dateFrom = dates[0];
var dateTo = dates[dates.length-1];

document.getElementById("fromDateId").value = dateFrom;
document.getElementById("toDateId").value = dateTo;

var canvas = document.getElementById('myChart');


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
var data = {
    datasets: [{
        data: dataset.map(a => a.value),
        backgroundColor: palette('mpn65', dataset.length).map(function(hex) {
            return '#' + hex;
        })
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: dataset.map(a => a.label)
};

function update(filteredDS){
    data.datasets[0].data = filteredDS.map(a => a.value);
    // These labels appear in the legend and in the tooltips when hovering different arcs
    data.labels= filteredDS.map(a => a.label)
    myPieChart.update();
}
// For a pie chart
var myPieChart = new Chart(canvas,{
    type: 'pie',
    data: data
});
