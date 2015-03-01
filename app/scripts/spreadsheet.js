// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
// https://developers.google.com/chart/interactive/docs/reference#DataTable
// https://developers.google.com/chart/interactive/docs/querylanguage

/* Narrative Sheet */
google.setOnLoadCallback(function() {
  if(debug) {
    return;
  }

  var query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=1BckVEf4kcxBbzGZPzFpgIYGXFeHNRiEqeVidcZiZxZU&gid=1577171681');
  query.send(function(response) {
    if(response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }

    var data = response.getDataTable();
    var narrative_end_ms = 0; /* ms since load at which the narrative ends */

    for(y = 0; y < data.getNumberOfRows(); y++) {
      var item = {};
      for(x = 0; x < data.getNumberOfColumns(); x++) {
        var col_name = data.getColumnLabel(x).toLowerCase().replace(/ /g, "_");
        if(col_name !== "") {
          item[col_name] = data.getValue(y, x);
        }
      }

      g.append("text")
        .classed('data', true)
        .attr("class", "narrative-text")
        .attr("x", 480)
        .attr("y", 250 + item.y_offset)
        .text(item.text)
        .transition()
          .style("opacity", 1)
          .duration(item.fade_in_duration)
          .delay(item.fade_in_time)
        .transition()
          .style("opacity", 0)
          .duration(item.fade_out_duration)
          .delay(item.fade_out_time)
        .remove();

      narrative_end_ms = item.fade_out_delay + item.fade_out_duration;
    }

    g.select(".background")
      .transition()
        .delay(narrative_end_ms)
      .each("end", function() {
        rivers();
      });
  })
});

/* Features Sheet */
google.setOnLoadCallback(function() {
  var query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=1BckVEf4kcxBbzGZPzFpgIYGXFeHNRiEqeVidcZiZxZU#gid=0');
  query.send(function(response) {
    if(response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
      return;
    }

    var data = response.getDataTable();
    var features_by_type = [];

    for(y = 0; y < data.getNumberOfRows(); y++) {
      var item = {};
      for(x = 0; x < data.getNumberOfColumns(); x++) {
        var col_name = data.getColumnLabel(x).toLowerCase().replace(/ /g, "_");
        if(col_name !== "") {
          item[col_name] = data.getValue(y, x);
        }
      }

      item.type = item.type.toLowerCase().replace(/ /g, "_");
      item.image_width *= 2;
      item.image_height *= 2;
      item["LatLng"] = function() {
        // Adjust from centroid lat,long to topleft
        if(item.type === "venue") {
          // return new L.LatLng(lat, long);
          var centroidpoint = map.latLngToLayerPoint(new L.LatLng(item.latitude, item.longitude));
          centroidpoint.x -= item.image_width / 2;
          centroidpoint.y -= item.image_height / 2;
          return map.layerPointToLatLng(centroidpoint);
        }

        var centroidpoint = map.latLngToLayerPoint(new L.LatLng(item.latitude, item.longitude));
        centroidpoint.x -= (item.image_width * wetlandImgScaleFactor) / 2;
        centroidpoint.y -= (item.image_height * wetlandImgScaleFactor) / 2;
        return map.layerPointToLatLng(centroidpoint);
      }();

      if(features_by_type[item.type] === undefined) {
        features_by_type[item.type] = [];
      }
      features_by_type[item.type].push(item);
    }

    /* Containers for the D3 elements */
    var wetland_els = [];
    var venue_els = []

    // draw (but don't position) our D3 shapes
    features_by_type["wetland_feature"].forEach(function(item, idx) {
        wetland_els[idx] = svg.append("g")
          .attr("class", "leaflet-zoom-hide")
          .append("svg:image")
            .attr("class", "wetland clicky")
            .attr("opacity", 0)
            .style("opacity", 0)
            .attr("x", 0)
            .attr("y", 0)
            .attr("xlink:href", function(d) { return item.image_url })
            .attr("width", function(d) { return item.image_width * wetlandImgScaleFactor; })
            .attr("height", function(d) { return item.image_height * wetlandImgScaleFactor; })
            .on("click", function() {
              if(item.feature_name == "Derbarl Yerrigan") {
                return;
              }

              d3.event.stopPropagation();

              // console.log(d3.event.pageX, d3.event.pageY);
              // console.log(map.layerPointToLatLng(L.point(d3.event.pageX, d3.event.pageY)));

              var html = "<h3>" + item.feature_name + "</h3>" + item.alternate_names.split(", ").join("<br>");

              L.popup({
                autoPan: false,
                className: "wetlands-popup"
              })
                .setLatLng(map.layerPointToLatLng(L.point(d3.event.pageX, d3.event.pageY)))
                .setContent(html)
                .openOn(map);
            });

          if(item.feature_name == "Derbarl Yerrigan") {
            wetland_els[idx].attr("class", "wetland");
          }
    });

    // draw (but don't position) our D3 shapes
    features_by_type["venue"].forEach(function(item, idx) {
      venue_els[idx] = svg.append("g")
        .attr("class", "leaflet-zoom-hide")
        .append("svg:image")
          .attr("class", "venue")
          .attr("opacity", 0)
          .style("opacity", 0)
          .attr("x", 0)
          .attr("y", 0)
          .attr("tooltip", item.feature_name)
          .attr("xlink:href", function(d) { return item.image_url })
          .attr("width", function(d) { return item.image_width; })
          .attr("height", function(d) { return item.image_height; })
          .on("click", function() {
            d3.event.stopPropagation();

            var html = "<h3>" + item.feature_name + "</h3>" + item.description;

            // var southwestpoint = map.latLngToLayerPoint(map.getBounds().getSouthWest());
            // console.log(d3.event.pageX, d3.event.pageY);

            L.popup({
              autoPan: false,
              className: "venue-popup"
            })
              .setLatLng(map.layerPointToLatLng(L.point(d3.event.pageX, d3.event.pageY)))
              .setContent(html)
              .openOn(map);
          });
    });

    // define a redraw function
    var resetSVG = function() {
      // console.log("moveend, resetSVG");
      var ctopleft = map.containerPointToLatLng(L.point(0,0));
      var ltopleft = map.latLngToLayerPoint(ctopleft);
      var zoom_level = Math.pow(2, (map.getZoom() - mapOriginalZoom));
      var venue_scale = {
        "1": 22,
        "2": 12,
        "4": 8
      };
      var venue_scale_pos = {
        "1": [-1, 7],
        "2": [-5, -2],
        "4": [-9, -5]
      };

      svg.style("left", ltopleft.x + "px")
         .style("top", ltopleft.y + "px");

      for (var i = 0; i < wetland_els.length; i ++) {
        var centre = map.latLngToContainerPoint(features_by_type["wetland_feature"][i].LatLng);

        wetland_els[i].attr("transform", "scale(" + zoom_level + ")translate(" + (centre.x / zoom_level) + "," + (centre.y / zoom_level) + ")");
      }

       for (var i = 0; i < venue_els.length; i ++) {
         var centre = map.latLngToContainerPoint(features_by_type["venue"][i].LatLng);

         venue_els[i]
          .attr("transform", "scale(" + zoom_level + ")translate(" + ((centre.x / zoom_level) - venue_scale_pos[zoom_level][0]) + "," + ((centre.y / zoom_level) - venue_scale_pos[zoom_level][1]) + ")")
          .attr("width", venue_scale[zoom_level])
          .attr("height", venue_scale[zoom_level]);
       }
    }

    // run it when the map pans/zooms
    map.on("moveend", resetSVG);
    resetSVG();

    if(debug) {
      rivers();
    }
  });
});
