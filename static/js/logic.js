// Leaflet - Challenge
// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
// Perform a GET request to the query URL must match with the correct d3 version in html //d3.json(queryUrl).then(function(data) {
d3.json(queryUrl, function(data) {
  console.log(data.features);
 
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}<hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} </h3>`);
  }

  function getColor(depth) {

        if (depth >= 90.0) {
          return "Red";
        } 
        else if (depth >= 15) {
          return "OrangeRed"; 
        } 
        else if (depth >= 9.0) {
          return "Tomato"; 
        } 
        else if (depth >= 5.0) {
          return "Coral";        
        }
        else if (depth >= 2.0) {
            return "DarkOrange"; 
        }
        else {
            return "Orange"; 
        }

  }  
        
   var earthquakes = L.geoJSON(data.features, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: function(feature) {
      return {
        "color": "black",
        "fillOpacity": 1,
        "fillColor": getColor(feature.geometry.coordinates[2]),  
        "weight": 2,
        "radius": feature.properties.mag * 5,
        "opacity": 0.65    
      }
    }  
  })
    

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    "Earthquakes": earthquakes
  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes] //default map opens
  });

  // Create a layer control containing our baseMaps

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [90, 15, 9, 5, 2, -10];
    var colors = ["Red", "OrangeRed", "Tomato", "Coral", "DarkOrange", "Orange"];
    var labels = [];


    // Add min & max
    var legendInfo = "<h1>Earthquake Depth</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

 });
