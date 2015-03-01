var wetlandImgScaleFactor = 0.2785;
var mapOriginalZoom = 14;
var queryDivIcon = null;
var marker = null;
var ending = false;
var debug = (window.location.search.indexOf("test=1") === 1) ? true : false;
var map = new L.Map("map", {center: new L.LatLng(-31.947, 115.85), zoom: 14, maxZoom: 16, minZoom: 14});
// var map = new L.Map("map", {center: new L.LatLng(-31.920805, 115.805032), zoom: 14, maxZoom: 16});

// https://snazzymaps.com/
var googleLayer = new L.Google('ROADMAP', {},
  [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"gamma":0.01},{"lightness":20}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"saturation":-31},{"lightness":-33},{"weight":2},{"gamma":0.8}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#050505"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#fef3f3"},{"weight":"3.01"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#0a0a0a"},{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#fffbfb"},{"weight":"3.01"},{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":30},{"saturation":30}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":20}]},{"featureType":"poi.attraction","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"lightness":20},{"saturation":-20}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":10},{"saturation":-30}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"saturation":25},{"lightness":25}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#a1a1a1"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#292929"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#202020"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"visibility":"simplified"},{"hue":"#0006ff"},{"saturation":"-100"},{"lightness":"13"},{"gamma":"0.00"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#686868"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#8d8d8d"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#353535"},{"lightness":"6"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":"3.45"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#d0d0d0"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"lightness":"2"},{"visibility":"on"},{"color":"#999898"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#383838"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"color":"#faf8f8"}]},{"featureType":"water","elementType":"all","stylers":[{"lightness":-20}]}]
);
map.addLayer(googleLayer);

// Hide Leaflet controls during intro animation
d3.select(".leaflet-control-container").style("opacity", 0);

/* Initialize the SVG layer */
// map._initPathRoot()

/* We simply pick up the SVG from the map object */
// var svg = d3.select("#map").select("svg");
// var g = svg.append("g");

var svg = d3.select(map.getPanes().overlayPane).append("svg");
// initial SVG setup: it should be exactly on top of the map (same size and position)
var map_size = d3.select("#map").node().getBoundingClientRect();

svg.attr("width", map_size.width)
   .attr("height", map_size.height)
   .style("left", "0px")
   .style("top", "0px");
// console.log(map_size);
var g = svg.append("g");

g.append("rect")
  .attr("id", "background-rect")
  .attr("class", "background")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 960)
  .attr("height", 500)
  // .style("fill", "#F2F2F2")
  .style("fill", "#FFF");

/* Force Directed Labels */
/*
var width = 906;
var height = 500;

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

d3.json("graph.json", function(error, json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});
*/

// var mySquare = svg.append("rect")
//   .attr("x",250)
//   .attr("y",250)
//   .attr("width",10)
//   .attr("height",10)
//   .on("mouseover", function() {
//     radial_tree(d3.event.pageX, d3.event.pageY);
//   })
//   .on("mouseout", function() {
//     kill_radial_tree();
//   });

/* Radial Tree */
var radial_tree_obj = null;
function kill_radial_tree() {
  d3.select("#radial").remove();
};

function radial_tree(x, y) {
  // console.log(x, y);
  var diameter = 950;

  radial_tree_obj = d3.layout.tree()
      .size([130, 100])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg_local = svg.append("svg")
      .attr("id", "radial")
      .attr("width", diameter)
      .attr("height", diameter - 150)
    .append("g")
      .attr("transform", "translate(" + x + "," + y + ")");

  d3.json("flare.json", function(error, root) {
    var nodes = radial_tree_obj.nodes(root),
        links = radial_tree_obj.links(nodes);

    var link = svg_local.selectAll(".link")
        .data(links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal)
        .attr("opacity", 0)
        .transition()
          .attr("opacity", 1)
          .duration(700);

    var node = svg_local.selectAll(".node")
        .data(nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

    node.append("circle")
        .attr("r", 4.5)
        .attr("opacity", 0)
        .transition()
          .attr("opacity", 1)
          .duration(700);

    node.append("text")
        // .attr("dx", function(d) { return d.depth == 0 ? "-40px" : "0" })
        .attr("dy", function(d) { return d.depth == 0 ? "2em" : ".31em" })
        .attr("text-anchor", function(d) {
          if(d.depth == 0) {
            return "middle";
          }
          return d.x < 180 ? "start" : "end";
        })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .style("font-weight", function(d) {
          return d.depth == 0 ? "bold" : "normal"; // Bad!
        })
        .text(function(d) { return d.name; })
        .attr("opacity", 0)
        .transition()
          .attr("opacity", 1)
          .duration(700);
  });

  d3.select(self.frameElement).style("height", diameter - 150 + "px");
}


// svg.append("text")
//   .classed('data', true)
//   .attr("x", 480)
//   .attr("y", 250)
//   .style("text-anchor", "middle")
//   .attr("fill","#fff")
//   .style("stroke-width", 1)
//   .style("stroke", "#000000")
//   .style("fill", "#000000")
//   .style({"font-size": "18px", "z-index": "999999999"})
//   .style("text-anchor", "middle")
//   .style("opacity", 1)
//   .text("Hi")
//   .on('mouseover', tip.show)
//   .on('mouseout', tip.hide);

// svg.append("div")
//   .attr("id", "#container")
//   .selectAll("text")
//   .data(["Text"])
//   .enter()
//   .append("text")
//   .text(function(content) { console.log(content); return content })
//   .append("br")
//   .style("stroke-width", 1)
//   .style("stroke", "#000000")
//   .style("fill", "#000000")
//   .style({"font-size": "18px", "z-index": "999999999"});


// g.append("text")
//   .classed('data', true)
//   .attr("x", 480)
//   .attr("y", 250)
//   .style("text-anchor", "middle")
//   .attr("fill","#fff")
//   .style("stroke-width", 1)
//   .style("stroke", "#000000")
//   .style("fill", "#000000")
//   .style({"font-size": "18px", "z-index": "999999999"})
//   .style("text-anchor", "middle")
//   .style("opacity", 0)
//   .text("Ahoy")
//   .transition()
//     .style("opacity", 1)
//     .duration(2000)
//     .delay(2000)
//   .transition()
//     .style("opacity", 0)
//     .duration(2000)
//   .remove();

/*
var svg = d3.select(map.getPanes().overlayPane)
  .append("svg")
  .attr("width", 960)
  .attr("height", 500);

// Line animation test
var data = d3.range(11).map(function(){return Math.random()*10})
    var x = d3.scale.linear().domain([0, 10]).range([0, 700]);
    var y = d3.scale.linear().domain([0, 10]).range([10, 290]);

    var line = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d,i) {return x(i);})
      .y(function(d) {return y(d);})

var path = svg.append("path")
  .attr("d", line(data))
  .attr("stroke", "red")
  .attr("stroke-width", "2")
  .attr("fill", "none");

var totalLength = path.node().getTotalLength();

path
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
    .duration(5000)
    .attr("stroke", "red")
    .ease("linear")
    .attr("stroke-dashoffset", 0);


// Image overlay test
var imgs = svg
  .append("svg:image")
  .attr("xlink:href", "http://www.sisteminterattivi.org/demos/SlidigButtonsBar/css/images/pint1.png")
  .attr("x", "120")
  .attr("y", "120")
  .attr("width", "336")
  .attr("height", "386")
  .on("click", function(d, i) { alert("Hello world"); });


// Text overlay test
svg.append("text")
  .classed('data', true)
  .attr("x", 450)
  .attr("y", 275)
  // .attr("y", function(d) { return (y(d.y1) + y(d.y0)) / 2; }) // Center text
  .attr("fill","#fff")
  .style("stroke-width", 1)
  .style("stroke", "#000000")
  .style("fill", "#000000")
  .style({"font-size": "18px", "z-index": "999999999"})
  .style("text-anchor", "middle")
  .text(function(d) { return "Hi, I'm some placeholder text!"; });
*/


/*map.on("viewreset", reset);

reset();

// fit the SVG element to leaflet's map layer
function reset() {
  console.log("reset");

  bounds = path.bounds(geoShape);

  var topLeft = bounds[0],
  bottomRight = bounds[1];

  svg.attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", topLeft[0] + "px")
    .style("top", topLeft[1] + "px");

  g.attr("transform", "translate(" + -topLeft[0] + ","
                                   + -topLeft[1] + ")");

  // initialize the path data
  d3_features.attr("d", path)
    .style("fill-opacity", 0.7)
    .attr('fill','blue');
}

// Use Leaflet to implement a D3 geometric transformation.
// function projectPoint(x, y) {
//  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
//  this.stream.point(point.x, point.y);
// }
*/

// map.on("movened", function() {
//   console.log("moveend");
// });

/* Rivers */
// http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/


var svg_rivers = d3.select(map.getPanes().overlayPane).append("svg");
var g_rivers = svg_rivers.append("g");

function rivers() {
  //read in the GeoJSON. This function is asynchronous so
  // anything that needs the json file should be within
  d3.json("rivers.geojson", function(collection) {
    /*
    route1: Herdsman to Claisebrook
    route2: Walters Brook
    route3: Stone's Lake to Claisebrook
    route4: Hyde Park to Stone's Lake
    route5: Three Island Lake to Stone's Lake
    */
    var routes = ["route1", "route2", "route3", "route4", "route5"];
    var route_durations = {
      "route1": 2000,
      "route2": 2000,
      "route3": 2000,
      "route4": 2000,
      "route5": 2000
    }

    collection.features.forEach(function(item, idx) {
      item.properties = {
        "latitude": item.geometry.coordinates[1],
        "longitude": item.geometry.coordinates[0],
        "time": idx + 1,
        "id": item.properties["id"],
        "name":"Foo"
      }
    });
    // console.log(collection.features);

      // this is not needed right now, but for future we may need
      // to implement some filtering. This uses the d3 filter function
      // featuresdata is an array of point objects

      // var featuresdata = collection.features.filter(function(d) {
      //     return d.properties.id == "route1"
      // })

      //stream transform. transforms geometry before passing it to
      // listener. Can be used in conjunction with d3.geo.path
      // to implement the transform.

      var transform = d3.geo.transform({
          point: projectPoint
      });

      //d3.geo.path translates GeoJSON to SVG path codes.
      //essentially a path generator. In this case it's
      // a path generator referencing our custom "projection"
      // which is the Leaflet method latLngToLayerPoint inside
      // our function called projectPoint
      var d3path = d3.geo.path().projection(transform);


      // Here we're creating a FUNCTION to generate a line
      // from input points. Since input points will be in
      // Lat/Long they need to be converted to map units
      // with applyLatLngToLayer
      var toLine = d3.svg.line()
          .interpolate("linear")
          .x(function(d) {
              return applyLatLngToLayer(d).x
          })
          .y(function(d) {
              return applyLatLngToLayer(d).y
          });

      // var featuresdata, ptFeatures, linePath, marker, originANDdestination, begend;
      var rivers_bucket = [];
      // console.log("rivers_bucket", rivers_bucket, rivers_bucket.length);

      routes.forEach(function(item, idx) {
        // console.log(item);
        river = {
          "name": item
        };

        // this is not needed right now, but for future we may need
        // to implement some filtering. This uses the d3 filter function
        // featuresdata is an array of point objects

        river["featuresdata"] = collection.features.filter(function(d) {
            return d.properties.id == item
        })

        // From now on we are essentially appending our features to the
        // group element. We're adding a class with the line name
        // and we're making them invisible

        // these are the points that make up the path
        // they are unnecessary so I've make them
        // transparent for now
        // console.log("circle.length", g_rivers.selectAll("circle").length);
        river["ptFeatures"] = g_rivers.selectAll("circle.waypoints" + item)
            .data(river["featuresdata"])
            .enter()
            .append("circle")
            .attr("r", 0)
            .attr("class", "waypoints" + item);
        // console.log("circle.length", g_rivers.selectAll("circle"));

        // Here we will make the points into a single
        // line/path. Note that we surround the featuresdata
        // with [] to tell d3 to treat all the points as a
        // single line. For now these are basically points
        // but below we set the "d" attribute using the
        // line creator function from above.
        river["linePath"] = g_rivers.selectAll(".lineConnect" + item)
            .data([river["featuresdata"]])
            .enter()
            .append("path")
            .attr("class", "lineConnect" + item)
            .attr("class", "river");

        // This will be our traveling circle it will
        // travel along our path
        river["marker"] = g_rivers.append("circle")
            .attr("r", 7)
            .attr("id", "marker" + item)
            .attr("class", "travelMarker");


        // For simplicity I hard-coded this! I'm taking
        // the first and the last object (the origin)
        // and destination and adding them separately to
        // better style them. There is probably a better
        // way to do this!
        river["orginANDDestination"] = [river["featuresdata"][0], river["featuresdata"][river["featuresdata"].length - 1]];
        // console.log(originANDdestination);

        river["begend"] = g_rivers.selectAll(".drinks" + item)
            .data(river["orginANDDestination"])
            .enter()
            .append("circle", ".drinks" + item)
            .attr("r", 5)
            // .style("fill", "red")
            .style("fill", "none")
            .style("opacity", "1");

        // I want names for my coffee and beer
        // river["text"] = g_rivers.selectAll("text")
        //     .data(river["orginANDDestination"])
        //     .enter()
        //     .append("text")
        //     .text(function(d) {
        //         return d.properties.name
        //     })
        //     .attr("class", "locnames")
        //     .attr("y", function(d) {
        //         return -10
        //     })

        rivers_bucket.push(river);
      });
      // console.log("rivers_bucket", rivers_bucket);

      // when the user zooms in or out you need to reset
      // the view
      map.on("viewreset", reset);

      // this puts stuff on the map!
      reset();
      transition();

      // Reposition the SVG to cover the features.
      function reset() {
        // console.log("viewreset, reset");
          var bounds = d3path.bounds(collection),
              topLeft = bounds[0],
              bottomRight = bounds[1];

          // console.log("rivers_bucket", rivers_bucket);
          rivers_bucket.forEach(function(item, idx) {
            // console.log("reset", item);

            // here you're setting some styles, width, heigh etc
            // to the SVG. Note that we're adding a little height and
            // width because otherwise the bounding box would perfectly
            // cover our features BUT... since you might be using a big
            // circle to represent a 1 dimensional point, the circle
            // might get cut off.

            // item["text"].attr("transform",
            //     function(d) {
            //         return "translate(" +
            //             applyLatLngToLayer(d).x + "," +
            //             applyLatLngToLayer(d).y + ")";
            //     });


            // for the points we need to convert from latlong
            // to map units
            item["begend"].attr("transform",
                function(d) {
                    return "translate(" +
                        applyLatLngToLayer(d).x + "," +
                        applyLatLngToLayer(d).y + ")";
                });

            item["ptFeatures"].attr("transform",
                function(d) {
                    return "translate(" +
                        applyLatLngToLayer(d).x + "," +
                        applyLatLngToLayer(d).y + ")";
                });

            // again, not best practice, but I'm harding coding
            // the starting point

            item["marker"].attr("transform",
                function() {
                    var y = item["featuresdata"][0].geometry.coordinates[1]
                    var x = item["featuresdata"][0].geometry.coordinates[0]
                    return "translate(" +
                        map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                        map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
                });


            // Setting the size and location of the overall SVG container
            svg_rivers.attr("width", bottomRight[0] - topLeft[0] + 120)
                .attr("height", bottomRight[1] - topLeft[1] + 120)
                .style("left", topLeft[0] - 50 + "px")
                .style("top", topLeft[1] - 50 + "px");


            // linePath.attr("d", d3path);
            item["linePath"].attr("d", toLine)
            // ptPath.attr("d", d3path);
            g_rivers.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");
          });

      } // end reset

      // the transition function could have been done above using
      // chaining but it's cleaner to have a separate function.
      // the transition. Dash array expects "500, 30" where
      // 500 is the length of the "dash" 30 is the length of the
      // gap. So if you had a line that is 500 long and you used
      // "500, 0" you would have a solid line. If you had "500,500"
      // you would have a 500px line followed by a 500px gap. This
      // can be manipulated by starting with a complete gap "0,500"
      // then a small line "1,500" then bigger line "2,500" and so
      // on. The values themselves ("0,500", "1,500" etc) are being
      // fed to the attrTween operator
      function transition() {
          rivers_bucket.forEach(function(item, idx) {
            var totalLength = item["linePath"].node().getTotalLength();

            item["linePath"]
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
                .duration(route_durations[item["name"]])
                .ease("linear")
                .attr("stroke-dashoffset", 0)
              .each("end", function() {
                item["linePath"]
                  .transition()
                    .style("opacity", 0)
                    .delay(1500)
                    .duration(2000);

                item["marker"]
                  .transition()
                    .style("opacity", 0)
                    .delay(1500)
                    .duration(2000);

                // Only end once for fading the map in
                if(ending === true) {
                  return;
                }
                ending = true;

                // Fade in Leaflet controls
                d3.select(".leaflet-control-container")
                  .transition()
                    .style("opacity", 1)
                    .delay(3500)
                    .duration(2000);

                // Fade out background rect
                d3.select("#background-rect")
                  .style("opacity", 1)
                  .transition()
                    .style("opacity", 0)
                    .delay(3500)
                    .duration(2000)
                  .each("end", function() {
                    d3.select("#background-rect").remove();
                    svg_rivers.remove();
                  });

                // Begin fading in wetlands
                d3.selectAll(".wetland")
                  .style("opacity", 0)
                  .transition()
                    .style("opacity", 1)
                    .duration(2000);

                // Begin fading in venues
                d3.selectAll(".venue")
                  .style("opacity", 0)
                  .transition()
                    .style("opacity", 1)
                    .delay(5000)
                    .duration(2000);

                // Fade in links bar
                d3.select("#links")
                  .transition()
                    .delay(5000)
                    .duration(2000)
                    .style("opacity", 0.95)
                    .style("display", "block");
              });

            // item["linePath"].transition()
            //     .duration(7500)
            //     .attrTween("stroke-dasharray", tweenDash)
            //     .each("end", function() {
            //         // d3.select(this).call(transition);// infinite loop
            //     });
            });
      } //end transition

      // this function feeds the attrTween operator above with the
      // stroke and dash lengths
      function tweenDash() {
          return function(t) {
              rivers_bucket.forEach(function(item, idx) {
                // console.log("tweenDash", item);
                // console.log(item["linePath"]);

                //total length of path (single value)
                var l = item["linePath"].node().getTotalLength();

                // this is creating a function called interpolate which takes
                // as input a single value 0-1. The function will interpolate
                // between the numbers embedded in a string. An example might
                // be interpolatString("0,500", "500,500") in which case
                // the first number would interpolate through 0-500 and the
                // second number through 500-500 (always 500). So, then
                // if you used interpolate(0.5) you would get "250, 500"
                // when input into the attrTween above this means give me
                // a line of length 250 followed by a gap of 500. Since the
                // total line length, though is only 500 to begin with this
                // essentially says give me a line of 250px followed by a gap
                // of 250px.
                interpolate = d3.interpolateString("0," + l, l + "," + l);
                //t is fraction of time 0-1 since transition began
                var marker = d3.select("#marker" + item["name"]);

                // p is the point on the line (coordinates) at a given length
                // along the line. In this case if l=50 and we're midway through
                // the time then this would 25.
                var p = item["linePath"].node().getPointAtLength(t * l);

                //Move the marker to that point
                marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
                // console.log(interpolate(t))
                return interpolate(t);
              });
          }
      } //end tweenDash

      // Use Leaflet to implement a D3 geometric transformation.
      // the latLngToLayerPoint is a Leaflet conversion method:
      //Returns the map layer point that corresponds to the given geographical
      // coordinates (useful for placing overlays on the map).
      function projectPoint(x, y) {
          var point = map.latLngToLayerPoint(new L.LatLng(y, x));
          this.stream.point(point.x, point.y);
      } //end projectPoint
  });
} //end rivers

// similar to projectPoint this function converts lat/long to
// svg coordinates except that it accepts a point from our
// GeoJSON

function applyLatLngToLayer(d) {
  // console.log(d);
    var y = d.geometry.coordinates[1]
    var x = d.geometry.coordinates[0]
    return map.latLngToLayerPoint(new L.LatLng(y, x))


}



// Website
// d3.select(".leaflet-popup-pane")
//   .append("div")
//     .attr("id", "links")
//     .html("<a href='#' class='project link'>Project</a> | <a href='#' class='credits link'>Credits</a> | <a href='#' class='references link'>References</a>")
//     .style("width", "960px")
//     .style("height", "25px")
//     .style("padding-left", "42px")
//     .style("opacity", 0)
//     // .style("opacity", 0.95)
//     .style("background-color", "white");

d3.selectAll(".link")
  .on("click", function() {
    console.log(this.className, this.className.split(" ")[0]);
    var content = d3.select("#" + this.className.split(" ")[0]);

    // console.log(content.attr("on"));
    if(content.attr("on") == "true") {
      // console.log("off");
      content.style("opacity", 0).style("display", "none").attr("on", false);
    } else {
      // console.log("on");
      content.style("opacity", 0.95).style("display", "block").attr("on", true);
    }
    // console.log("click about", this.className, this, content.attr("on"));
    // content.style("opacity", 1).attr("on", true);
  });


  var credits = "<div class='content'><h3>Credits</h3><br>" +

  "Keith Moss is our digital mapping guy.<br>" +
  "Helen Ensikat is our research ninja, artist, and photographer.<br><br>" +

  "Many thanks to Dr Nandi Chinna for allowing us to reuse snippets of beautiful poetry about the lost wetlands, from her book 'Swamp', Mei Saraswati for offering lyrics from her song 'Swamp Gospel', also inspired by the wetlands, and Dr Danielle Brady for access to her reference materials.<br><br>" +

  "A special thank you to the wonderful Perth photographers who published wetland and venue images under a Creative Commons License:   Grahame Bowland, Clare Snow, PurpleLorikeet, Joyce Seitzinger, Rohyt Maurya, Indulis Bernsteins, Stu Rapley, Anthony Hevron, Choo Yut Sing, Jason Meaden, Matthew Perkins, thechancepassenger, Kate Raynes-Goldie, Thomas Sutton, Sasha Kelley, Purple Wyrm, and Ron & Beth of ron_n_beths pics.  Your sharing makes the world go 'round!<br><br>" +

  "And finally, thank you to our friends, Dr Lise Summers, whose love for the history of this city brought us both to the story of Perth's Lost Wetlands, and Margaret Dunlop, for stories of what lies beneath.</div>";

  d3.select(".leaflet-popup-pane")
    .append("div")
      .attr("id", "credits")
      .html(credits)
      .style("width", "910px")
      .style("height", "460px")
      // .style("margin-top", "-505px")
      .style("padding-left", "50px")
      .style("padding-top", "20px")
      .style("opacity", 0)
      .style("display", "none")
      .style("background-color", "white");




var project = "<I>The Lost Festival is a digital illustration project for Hack the Festival 2015.</I><br><br><h3>The Project</h3><br>The Festival sits on a city of lost wetlands.  It floats above a string of lakes, the majority of which endure in drains, in the waters just beneath the City Link, and in memory.<br><br>The maps, names, and stories of the wetlands have been dispersed across Government records, theses, local narratives.<br><br>This project takes the Festival as an anchor for understanding this hidden landscape, using this moment in art and time to animate and describe what has been erased.<br><br>At the same time, it draws on local arts - particularly photography and poetry - to illustrate the city's lost wetlands.<br><br><h4>Technical specifications</h4><br>The project uses D3 and Leaflet to animate the form and flow of the lost wetlands, and the Google Maps API to place the animation in a contemporary map.<br><br>The animation concludes by loading a map that allows the audience to view the intersection of the Festival map and the lost wetlands, placing contemporary venues in the landscape.<br><br>The animation and placement of mapping elements are driven by a live Google Drive spreadsheet, in which the user can change text, images, placement of elements, and effects.<br><br><h4>References and materials</h4><br>The project uses spatial information from Landgate and State Records.  These maps from the archives are used both to generate the texture of wetlands, and to geolocate them, and to outline the ghost of the River's shore.<br><br>It also draws on State and local government records, historical texts, and academic works to identify historical names for the wetlands.<br><br>The composite images that represent the Festival venues incorporate Creative Commons licensed work of local photographers, and the words of Perth poet and wetland researcher, Nandi Chinna, and songwriter Mei Saraswati.<br><br>In these images, the Festival's venues are - quite literally - reflected in images of surviving wetlands on the Swan Coastal Plain.<br><br><h4>Audience</h4><br>The Lost Festival has been created to give Festival-goers a richer and more complex understanding of the city, and provides a full reference list help others who would like to learn more about the lost wetlands.<br><br>The project is also a gift to the people who have treasured the wetlands and their stories - the traditional owners, public servants, academics, activists, artists, writers, scientists, and local historians who have kept their memory alive.<br><br><h4>Potential for expansion</h4><br>The Lost Festival is a tiny representation of something much larger and more complex, and provides the basic infrastructure for more complex storytelling.<br><br>For example, we have repeatedly encountered Whadjuk stories in our research, but did not wish to appoint ourselves as storytellers for another culture.<br><br>However, there is clearly an opportunity to collaborate with traditional owners, finding ways to let the platform tell the story of their country.<br><br>Similarly, there are others - the scientists and historians mentioned - who also have another layer of the narrative to share.<br><br>As it stands, the next step is to integrate more markers into the landscape, beyond the initial cluster in the city centre, intersecting with larger chain of lakes, and to provide a more elegant and mobile-device friendly user experience.<br><br>As a larger project, there may be merit in splitting the work into two parts - an animated short film, complemented a more interactive and informative map.<br><br>There is also scope to expand into other art forms, in particular, using 2D-barcodes and technology such as Oculus Rift to bring the project to the walker.<br><br>Finally, as the platform is location-agnostic, and geolocates material using a live spreadsheet, it would be relatively simple to develop it into a tool for users to visualise other landscapes, both lost and imagined.<br><br><br><I>(All original components of thelostfestival.org are Attribution-NonCommercial CC BY-NC works; adapted code, photographs, lyrics, and writings retain their original copyright.)</I><br><br>";

d3.select(".leaflet-popup-pane")
  .append("div")
    .attr("id", "project")
    .html(project)
    .style("width", "910px")
    .style("height", "460px")
    // .style("margin-top", "-505px")
    .style("padding-left", "50px")
    .style("padding-top", "20px")
    .style("opacity", 0)
    .style("display", "none")
    .style("background-color", "white");




var references = "<h3>References</h3><br>Bekle, H. (1981). The wetlands lost: Drainage of the Perth lake systems. <I>Western Geographer</I>, 6, 21-44.<br><br>Chinna, N. (2014). <I>Swamp: Walking the Wetlands of the Swan Coastal Plain</I>. Fremantle, Australia: Fremantle Press.<br><br>Chinna, N. (2015). Swamp. <I>Griffith Review 47 'Looking West’</I>. Retrieved from https://griffithreview.com/articles/swamp/<br><br>Collard, L., Rooney, A., & Stocker, L. (2013). <I>Mooro Nyungar Katitjin Bidi - (Mooro People’s Knowledge Trail)</I>. Literature Review<br><br>Department of Lands and Surveys. Plans (various) of City of Perth. Consignment 3850; Consignment 3868.<br><br>Environmental Protection Authority & Water Authority of Western Australia. (1990). <I>Jenny Arnold's Perth Wetlands Research Book</I>. Bulletin 266.<br><br>Giblet, R. (2013). <I>Black Swan Lake: Life of a Wetland</I>. Bristol, United Kingdom: Intellect Ltd.<br><br>Horwitz, P., Sommer, B., & Hewitt, P. (2009).  Wetlands - Changes, Losses and Gains. In B. Wilson & L. Valentine (Eds.), <I>Biodiversity values and threatening processes of the Gnangara groundwater system</I>. Perth Australia: Centre for Ecosystem Management, Edith Cowan University.<br><br>Hughes-Hallet, D. (2010). <I>Indigenous history of the Swan and Canning rivers</I>. Perth, Australia: Swan River Trust.<br><br>Lund, M.A. (1992). <I>Aspects of the ecology of a degraded Perth wetland (Lake Monger, Western Australia) and implications for biomanipulation and other restoration techniques</I>. Ph.D. Thesis.  Murdoch University, Western Australia.<br><br>McDonald, E., Coldrick, B., & Villiers, L. (2005). <I>Study of groundwater-related Aborignal cultural values on the Gnangara Mound</I>. Perth, Australia: Department of Environment.<br><br>Morel-EdnieBrown, F. (2009). Layered Landscape: The Swamps of Colonial Northbridge. <I>Social Science Computer Review</I>, 27, 390.<br><br>Morel-EdnieBrown, F. (2008). <I>Tethered Antipodes: Imperial Impress in Central Perth</I>, Western Australia. Melbourne, Australia: Monash University ePress.<br><br>Summers, L. (2011, November). <I>Reclamation for Recreation</I>. Paper presented at More Than Grass: Exploring the Esplanade.<br><br>Western Australia Eighty Years Ago. (1928, July 8). <I>Sunday Times (Perth)</I>, p. 40.<br><br>";

d3.select(".leaflet-popup-pane")
  .append("div")
    .attr("id", "references")
    .html(references)
    .style("width", "910px")
    .style("height", "460px")
    // .style("margin-top", "-505px")
    .style("padding-left", "50px")
    .style("padding-top", "20px")
    .style("opacity", 0)
    .style("display", "none")
    .style("background-color", "white");
