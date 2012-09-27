
var w = 940,
    h = 300,
    pad = 20,
    x_pad = 100;

var svg = d3.select("#punchcard")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

var x = d3.scale.linear().domain([0, 23]).range([x_pad, w-pad]),
    y = d3.scale.linear().domain([0, 6]).range([pad, h-pad*2]);

var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(24)
        .tickFormat(function (d, i) {
            var m = (d > 12) ? "p" : "a";
            return (d%12 == 0) ? 12+m :  d%12+m;
        }),
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(7)
        .tickFormat(function (d, i) {
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
        });

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+(x_pad-pad)+", 0)")
    .call(yAxis);


d3.json(Data_url, function (punchcard_data) {
    var max_r = _.max(_.map(punchcard_data,
                      function (d) { return d[2]; })),
        r = d3.scale.linear()
            .domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
            .range([0, 12]);

    svg.selectAll("circle")
        .data(punchcard_data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) { return x(d[1]); })
        .attr("cy", function (d) { return y(d[0]); })
        .attr("r", function (d) { return 0; })
        .transition()
        .duration(800)
        .attr("r", function (d) { return r(d[2]); });
});
