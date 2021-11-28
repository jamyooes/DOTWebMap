/*
Author: James Yoo
*/

//set view to NYC and zoom level (13)
var map = L.map("map").setView([40.7128, -74.006], 13);
//stores the datapoints on bike parking from the csv data file
const dataPoints = [];

//Creates the map and streets for the world
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



//async and await to grab the data from bicycle parking csv
const fetchText = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

//Layer to store all points
var pointGroup = L.layerGroup();
//Clean the data to get coordinates and other information from the asset csv file
fetchText("data/BicycleParking.csv").then((text) => {
  const data = d3.csvParse(text);
  //console.log(data[0]);
  for (var i = 0; i < data.length; i++) {
    data[i].the_geom = data[i].the_geom.split(" ");
    y = data[i].the_geom[1].substr(1);
    x = data[i].the_geom[2].substr(0, data[i].the_geom[2].length - 1);
    assetType = data[i].ASSETSUBTY;
    //consider when assetType is empty
    assemblyNum = data[i].AssemDist;
    communityNum = data[i].BoroCD;
    boroughCode = data[i].BoroCode;
    boroughName = data[i].BoroName;
    congressionalNum = data[i].CongDist;
    cityCouncilNum = data[i].CounDist;
    senateNum = data[i].StSenDist;
    internalID = data[i].INTERNALID;
    flood = data[i].FEMAFldT;
    installed = data[i].DATE_INST;
    address = data[i].IFOADDRESS;
    program = data[i].PROGRAM;
    street = data[i].STREETON;
    dataPoints.push([
      //ADD MORE*****************************
      x,
      y,
      assetType,
      assemblyNum,
      communityNum,
      boroughCode,
      boroughName,
      congressionalNum,
      cityCouncilNum,
      senateNum,
      internalID,
      flood,
      installed,
      address,
      program,
      street,
    ]);
    //console.log(cityCouncilNum);
    //console.log(x, y);
    //console.log(i);
    L.circleMarker([x, y])
      .setRadius(4)
      .bindPopup(
        "<p> Latitude: " +
          x +
          "<br>" +
          "Longitude: " +
          y +
          "<br>" +
          "Asset Type: " +
          assetType +
          "<br>" +
          "Assembly District Number: " +
          assemblyNum +
          "<br>" +
          "Community District Number: " +
          communityNum +
          "<br>" +
          "Borough Code: " +
          boroughCode +
          "<br>" +
          "Borough Name: " +
          boroughName +
          "<br>" +
          "Congressional District Number: " +
          congressionalNum +
          "<br>" +
          "City Council District Number: " +
          cityCouncilNum +
          "<br>" +
          "Senate District Number: " +
          senateNum +
          "<br>" +
          "Internal ID: " +
          internalID +
          "<br>" +
          "Flood Hazard: " +
          flood +
          "<br>" +
          "Installed on: " +
          installed +
          "<br>" +
          "Program: " +
          program +
          "<br>" +
          "Street: " +
          street +
          "<br>" +
          "Address: " +
          address +
          "</p>"
      )
      .addTo(pointGroup);
  }
  pointGroup.addTo(map);
  // console.log(dataPoints[1]);
});

//This is to create a toggle for districts layers
//reference
// https://leafletjs.com/examples/layers-control/
//https://leafletjs.com/examples/geojson/
//https://gis.stackexchange.com/questions/229723/displaying-properties-of-geojson-in-popup-on-leaflet

//Setting up Assembly District popup layer
assemblyDist = L.geoJSON(assemblyBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" + "Assembly District: " + feature.properties.assem_dist + "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Borough District layer
boroDist = L.geoJSON(boroBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" +
        "Borough District: " +
        feature.properties.boro_name +
        "</h2>" +
        "<p>" +
        "Borough Code: " +
        feature.properties.boro_code +
        "</p>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Community District layer
communityDist = L.geoJSON(cdBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" + "Community District: " + feature.properties.boro_cd + "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Senate District layer
senateDist = L.geoJSON(senateBound, {
  onEachFeature: function (feature, layer) {
    //console.log(feature);

    layer.bindPopup(
      "<h2>" + "Senate District: " + feature.properties.st_sen_dist + "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Congressional District layer
congDist = L.geoJSON(congBound, {
  onEachFeature: function (feature, layer) {
    //console.log(feature);

    layer.bindPopup(
      "<h2>" +
        "Congressional District: " +
        feature.properties.cong_dist +
        "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up City Council District layer
cityCouncilDist = L.geoJSON(cityCouncilBound, {
  onEachFeature: function (feature, layer) {
    //console.log(feature);
    layer.bindPopup(
      "<h2>" +
        "City Council District: " +
        feature.properties.coun_dist +
        "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Set Colors for each of the layers
assemblyDist.setStyle({ color: "black" });
boroDist.setStyle({ color: "red" });
communityDist.setStyle({ color: "green" });
senateDist.setStyle({ color: "purple" });
congDist.setStyle({ color: "orange" });
cityCouncilDist.setStyle({ color: "pink" });

//Create a layer group to
var boroLayer = L.layerGroup([boroDist]);
var communityLayer = L.layerGroup([communityDist]);
var assemblyLayer = L.layerGroup([assemblyDist]);
var senateLayer = L.layerGroup([senateDist]);
var congLayer = L.layerGroup([congDist]);
var cityLayer = L.layerGroup([cityCouncilDist]);
// map.removeLayer(boroughs);
// map.addLayer(boroughs);

//Sets up the control for the toggle to layers by referenceing to the layers
var overlayMaps = {
  "Toggle Points": pointGroup,
  "Assembly District": assemblyLayer,
  Borough: boroLayer,
  "City Council District": cityLayer,
  "Community District": communityLayer,
  "Congressional District": congLayer,
  "Senate District": senateLayer,
};
//Add a layer control (allows user to interact with a toggle on and off for the districts)
L.control.layers(null, overlayMaps).addTo(map);

/*
Dashboards
*/
var layerGroup = L.layerGroup().addTo(map); //this is to hold the marker to indicate which point is selected from the dashboard

//This is a function to move to a point that is on the dashboard
function moveToPoint(e) {
  layerGroup.clearLayers(); //This removes previously clicked on point indicator from the dashboard
  splits = e.target.innerText.split(/[: \n]/); //Splits the data to get the coordinates
  lat = splits[2]; //Latitude
  long = splits[5]; //Longitude
  map.setView(new L.LatLng(lat, long), 19); //Move to the selected point from the map and zoom in
  L.marker([lat, long]).addTo(layerGroup); //Create a marker to differeniate among the many points
}

//handle onclick data for districts
function onClickDistrict(e) {
  let arr = [];
  let currLayer = 0;
  let selectDistrict = 0;
  // map.removeLayer(pointGroup);
  // map.addLayer(pointGroup);
  if (e.target.feature.properties.boro_cd != null) {
    currLayer = parseInt(e.target.feature.properties.boro_cd);
    selectDistrict = 4;
  } else if (e.target.feature.properties.assem_dist != null) {
    currLayer = parseInt(e.target.feature.properties.assem_dist);
    selectDistrict = 3;
  } else if (e.target.feature.properties.boro_code != null) {
    currLayer = parseInt(e.target.feature.properties.boro_code);
    selectDistrict = 5;
  } else if (e.target.feature.properties.cong_dist != null) {
    currLayer = parseInt(e.target.feature.properties.cong_dist);
    selectDistrict = 7;
  } else if (e.target.feature.properties.coun_dist != null) {
    currLayer = parseInt(e.target.feature.properties.coun_dist);
    selectDistrict = 8;
  } else if (e.target.feature.properties.st_sen_dist != null) {
    currLayer = parseInt(e.target.feature.properties.st_sen_dist);
    selectDistrict = 9;
  }
  for (var i = 0; i < dataPoints.length; i++) {
    if (dataPoints[i][selectDistrict] == currLayer) {
      arr.push(dataPoints[i]);
    }
  }
  const myNode = document.getElementById("sidebar");
  myNode.innerHTML = "";
  for (var i = 0; i < arr.length; i++) {
    $("#sidebar").append(
      "<p onclick=moveToPoint(event)>" +
        "Latitude: " +
        arr[i][0] +
        "<br>" +
        "Longitude: " +
        arr[i][1] +
        "<br>" +
        "Asset Type: " +
        arr[i][2] +
        "<br>" +
        "Assembly District Number: " +
        arr[i][3] +
        "<br>" +
        "Community District Number: " +
        arr[i][4] +
        "<br>" +
        "Borough Code: " +
        arr[i][5] +
        "<br>" +
        "Borough Name: " +
        arr[i][6] +
        "<br>" +
        "Congressional District Number: " +
        arr[i][7] +
        "<br>" +
        "City Council District Number: " +
        arr[i][8] +
        "<br>" +
        "Senate District Number: " +
        arr[i][9] +
        "<br>" +
        "Internal ID: " +
        arr[i][10] +
        "<br>" +
        "Flood Hazard: " +
        arr[i][11] +
        "<br>" +
        "Installed on: " +
        arr[i][12] +
        "<br>" +
        "Program: " +
        arr[i][14] +
        "<br>" +
        "Street: " +
        arr[i][15] +
        "<br>" +
        "Address: " +
        arr[i][13] +
        "</p>"
    );
  }
}
