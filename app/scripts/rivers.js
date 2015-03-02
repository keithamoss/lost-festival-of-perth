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
      "route1": rivers_duration,
      "route2": rivers_duration,
      "route3": rivers_duration,
      "route4": rivers_duration,
      "route5": rivers_duration
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
          var bounds = d3path.bounds(collection),
              topLeft = bounds[0],
              bottomRight = bounds[1];

          rivers_bucket.forEach(function(item, idx) {
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

          item["marker"]
            .style("opacity", 0)
              .transition()
                .style("opacity", 1)
                .delay(0)
                .duration(2000);

          item["linePath"]
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
              .duration(route_durations[item["name"]])
              .delay(1700)
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

              /* Show the stuff on the map */
              fade_in_map_els();
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
  var y = d.geometry.coordinates[1]
  var x = d.geometry.coordinates[0]
  return map.latLngToLayerPoint(new L.LatLng(y, x))
}

function fade_in_map_els() {
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
  d3.selectAll(".wetland-clickable")
    .attr("class", "wetland clicky")
    .style("opacity", 0)
    .transition()
      .style("opacity", 1)
      .duration(2000);
  d3.selectAll(".wetland-not-clickable")
    .attr("class", "wetland")
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
  // d3.select("#links")
  //   .transition()
  //     .delay(5000)
  //     .duration(2000)
  //     .style("opacity", 0.95)
  //     .style("display", "block");

  // Fade out the skip button
  d3.select("#skip_narrative")
    .transition()
      .delay(5000)
      .duration(2000)
      .style("opacity", 0);

  enable_map_interaction();
}

function show_map_els() {
  // Fade in Leaflet controls
  d3.select(".leaflet-control-container")
    .style("opacity", 1);

  // Fade out background rect
  d3.select("#background-rect")
    .style("opacity", 0);
  d3.select("#background-rect").remove();
  svg_rivers.remove();

  // Begin fading in wetlands
  d3.selectAll(".wetland-clickable")
    .attr("class", "wetland clicky")
    .style("opacity", 1);

  d3.selectAll(".wetland-not-clickable")
    .attr("class", "wetland")
    .style("opacity", 1);

  // Begin fading in venues
  d3.selectAll(".venue")
    .interrupt()
    .style("opacity", 1);

  // Fade in links bar
  d3.select("#links")
    .style("opacity", 0.95)
    .style("display", "block");

  enable_map_interaction();
}
