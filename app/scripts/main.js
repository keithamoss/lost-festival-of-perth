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
  // .style("fill", "#F2F2F2")
  .style("fill", "#FFF");

/* Website */
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
