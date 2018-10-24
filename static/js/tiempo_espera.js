
var table_Props = {
    col_1: "select",
    col_0: "none",
    col_3: "none",
    display_all_text: "Todos",
    sort_select: true
};
var tf2 = setFilterGrid("table", table_Props);

/*update table after dates change and request received*/
function updateTable(dataset) {
    var tbdy = document.getElementById('myTable');
    while (tbdy.firstChild) {
        tbdy.removeChild(tbdy.firstChild);
    }
    for (var i = 0; i < dataset.length; i++) {
        var tr = document.createElement('tr');

        var td = document.createElement('td');
        td.innerHTML = (i+1).toString();
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = dataset[i][0];
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = dataset[i][1];
        tr.appendChild(td);

        var td = document.createElement('td');
        td.innerHTML = dataset[i][2];
        tr.appendChild(td);

        tbdy.appendChild(tr);
    }

}

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
    format: 'yyyy-dd-mm'
});

$('#toDateId').datepicker({
    uiLibrary: 'bootstrap4',
    minDate: function () {
        return $('#fromDateId').val();
    },
    format: 'yyyy-dd-mm'
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
        url: "/tiempo_espera",
        type: "POST",
        data: JSON.stringify({date_from: dateFrom.replace(/\//g, '-'), date_to: dateTo.replace(/\//g, '-')}),
        contentType: "application/json; charset=utf-8",
        success: function(dat) { console.log(JSON.parse(dat)); updateTable(JSON.parse(dat)["dataset"]); }
    });
}