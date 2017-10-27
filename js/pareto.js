//Defining the array for the scatterplot that gets drawn in blue points
var scatter = [];
//Defining the colour arrays
var HH_Array = [];
var HL_Array = [];
var LH_Array = [];
var LL_Array = [];

// Bitmask flags
HH = 1
HL = 2
LH = 4
LL = 8

google.charts.load('current', { 'packages': ['corechart'] });

window.onload = function() {
    scatter20();
    HighHigh();
}

function drawChart() {
    var data = new google.visualization.DataTable();
    //Xvalue
    data.addColumn('number', 'X');
    //Colored points
    data.addColumn('number', 'Data');
    data.addColumn('number', 'High u High v');
    data.addColumn('number', 'Low u High v');
    data.addColumn('number', 'Low u Low v');
    data.addColumn('number', 'High u Low v');
    //Taking the scatter and adding it as blue pointsto the Googlechart
    for (var i = 0; i < (scatter.length); ++i) {
        //even numbers are the x values, odd numbers are the y values
        data.addRow([scatter[i][0], scatter[i][1], null, null, null, null]);

    }
    //Red points for High High Pareto dominance
    for (var r = 0; r < HH_Array.length; ++r) {
        //even numbers are the x values, odd numbers are the y values
        data.addRow([HH_Array[r][0], null, HH_Array[r][1], null, null, null]);

    }
    //Orange points for Low High Pareto dominance
    for (var o = 0; o < LH_Array.length; ++o) {
        data.addRow([LH_Array[o][0], null, null, LH_Array[o][1], null, null]);

    }
    //Green points for Low Low Pareto dominance
    for (var g = 0; g < LL_Array.length; ++g) {
        data.addRow([LL_Array[g][0], null, null, null, LL_Array[g][1], null]);

    }
    //Purple points for Low Low Pareto dominance
    for (var p = 0; p < HL_Array.length; ++p) {
        data.addRow([HL_Array[p][0], null, null, null, null, HL_Array[p][1]]);

    }
    //Drawing the Graph
    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    chart.draw(data, {
        height: 800,
        width: 1200,
        title: 'Pareto Dominance Algorithm Visualization',
        'vAxis': { 'title': 'Objective V' },
        'hAxis': { 'title': 'Objective U' },
        //Connecting the dots
        series: {
            //Blue points
            0: {

                lineWidth: 0
            },
            //Red Points 
            1: {
                lineWidth: 1
            },
            //Orange
            2: {
                lineWidth: 1
            },
            //Green
            3: {
                lineWidth: 1
            },
            //Purple
            4: {
                lineWidth: 1
            }
        }
    });
}
google.load('visualization', '1', { packages: ['corechart'], callback: drawChart });

//Button Functions
//Makes a random Scatter plot with 20 points
function scatter20() {
    make_scatter(20, 30);
    drawChart();
}

function make_scatter(n, r) {
    HH_Array = [];
    HL_Array = [];
    LH_Array = [];
    LL_Array = [];
    scatter = [];
    while (n--) {
        scatter[n] = get_random_point(r);
    }
}

function scatter100() {
    make_scatter(100, 100);
    drawChart();
}

function scatter9999() {
    make_scatter(9999, 100000);
    drawChart();
}


function HighHigh() {
    pareto_draw(HH);
}

function LowHigh() {
    pareto_draw(LH);
}

function LowLow() {
    pareto_draw(LL);
}

function HighLow() {
    //Clearing the arrays, but not clearing the blue points
    pareto_draw(HL);
}
//Draw all the Pareto Dominances at one time
function All() {
    //@Anthony just add the correct pareto dominance co-ords into the array below
    //remember arrays format is like ths [x1,y1,x2,y2...]
    pareto_draw(HH | LH | LL | HL);
}

function pareto_draw(front) {
    // Goals
    var minX = function(a, b) { return a[0] - b[0] };
    var maxX = function(a, b) { return b[0] - a[0] };
    var maxY = function(a, b) { return a >= b };
    var minY = function(a, b) { return a <= b };

    // Find the pareto frontier for the desired fronts
    HH_Array = (front & HH ? pareto_frontier(maxX, maxY) : []);
    LH_Array = (front & LH ? pareto_frontier(minX, maxY) : []);
    LL_Array = (front & LL ? pareto_frontier(minX, minY) : []);
    HL_Array = (front & HL ? pareto_frontier(maxX, minY) : []);

    drawChart();

}

function pareto_frontier(goalA, goalB) {
    scatter.sort(goalA);
    var pareto_front = [scatter[0]];

    for (var i = 1; i < scatter.length; ++i) {
        if (goalB(scatter[i][1], pareto_front[pareto_front.length - 1][1]))
            pareto_front.push(scatter[i]);
    }
    return pareto_front;
}


function get_random_point(r) {
    while (true) {
        x = Math.random() * 2 * r - r;
        y = Math.random() * 2 * r - r;
        if (Math.sqrt(x * x + y * y) < r) {
            return [x, y];
        }
    }
}


function benchmark(n, decrement) {
    var n = n || 1000;
    var decrement = decrement || function(n) {return --n};
    var results = [];
    var t0, t1;
    var maxX = function(a, b) { return b[0] - a[0] };
    var maxY = function(a, b) { return a >= b };
    for (; n > 1; n = decrement(n)) {
        make_scatter(n, n);
        t0 = performance.now();
        pareto_frontier(maxX, maxY);
        t1 = performance.now();
        results.push([n, t1-t0]);
    }
    scatter = [];
    scatter = results;
    drawChart();
}