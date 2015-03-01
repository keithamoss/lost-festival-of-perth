var wetlandImgScaleFactor = 0.2785;
var mapOriginalZoom = 14;
var queryDivIcon = null;
var marker = null;
var ending = false;
var debug = (window.location.search.indexOf("test=1") === 1) ? true : false;
var rivers_duration = (debug) ? 2000 : 10000;
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
  .style("fill", "#FFF");

/* Project About Content */
d3.selectAll(".link")
  .on("click", function() {
    d3.event.preventDefault();

    var content = d3.select("#" + this.className.split(" ")[0]);
    if(content.attr("on") === "true") {
      content.style("opacity", 0).style("display", "none").attr("on", false);
    } else {
      content.style("opacity", 0.95).style("display", "block").attr("on", true);
    }
  });
