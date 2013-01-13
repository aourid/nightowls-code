
var w = 940,
    h = 300,
    pad = 20,
    x_pad = 100;

var svg = d3.select("#histogram")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

var x = d3.scale.ordinal().rangeRoundBands([x_pad, w-pad], 0.1),
    y = d3.scale.linear().range([h-pad, pad]);

var xAxis = d3.svg.axis().scale(x).orient("bottom")
        //.ticks(24)
        .tickFormat(function (d, i) {
            var m = (d > 12) ? "p" : "a";
            return (d%12 == 0) ? 12+m :  d%12+m;
        }),
    yAxis = d3.svg.axis().scale(y).orient("left");

svg.append("text")
    .attr("class", "loading")
    .text("Loading ...")
    .attr("x", function () { return w/2; })
    .attr("y" ,function () { return h/2-5; });


d3.json('/data/histogram-hours.json', function (histogram_data) {
    var data = _.map(_.keys(histogram_data),
                     function (key) {
                         return {hour: parseInt(key, 10),
                                 count: histogram_data[key]};
                     });

    x.domain(data.map(function (d) { return d.hour; }));
    y.domain([0, d3.max(data, function (d) { return d.count; })]);
    
    svg.selectAll(".loading").remove();
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+(x_pad-pad)+", 0)")
        .call(yAxis);
    
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, "+(h-pad)+")")
        .call(xAxis);
    
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) { return x(d.hour); })
        .attr('width', x.rangeBand())//function () { return 10; })
        .attr('y', h-pad)
        .transition()
        .delay(function (d) { return d.hour*20; })
        .duration(800)
        .attr('y', function (d) { return y(d.count); })
        .attr('height', function (d) { return h-pad - y(d.count); });

});
