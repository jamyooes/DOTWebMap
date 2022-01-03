/*
Author: James Yoo
*/

//set view to NYC coordinates and zoom level (13), a larger number will zoom in more
var map = L.map("map").setView([40.7128, -74.006], 13);

//stores the datapoints on bike parking from the csv data file
const dataPoints = [];

//Overlays leaflet maps onto the map and credits to leaflet
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//async and await to grab the data from bicycle parking csv
const fetchText = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

//Layer to store all points this will enable the option to turn off the points later
var pointGroup = L.layerGroup();

//Clean the data to get coordinates and other information from the asset csv file
//One thing to consider is for empty fields
fetchText("data/BicycleParking.csv").then((text) => {
  //Hold the data in a variable to process
  const data = d3.csvParse(text);
  //Loop through the data to clean
  for (var i = 0; i < data.length; i++) {
    //The split will help for getting Longitude and Latitude data
    data[i].the_geom = data[i].the_geom.split(" ");

    //Longitude
    y = data[i].the_geom[1].substr(1);

    //Latitude
    x = data[i].the_geom[2].substr(0, data[i].the_geom[2].length - 1);

    //Get the asset type like (Wave Rack, small hoop etc)
    assetType = data[i].ASSETSUBTY;

    //Get the assembly district number
    assemblyNum = data[i].AssemDist;

    //Get the community district number
    communityNum = data[i].BoroCD;

    /*Get the borough code (1-5)
    1 is Manhattan
    2 is Bronx
    3 is Brooklyn
    4 is Queens
    5 is Staten Island
    */
    boroughCode = data[i].BoroCode;

    //Borough Names
    boroughName = data[i].BoroName;

    //Congressional District Number
    congressionalNum = data[i].CongDist;

    //City Council Number
    cityCouncilNum = data[i].CounDist;

    //Senate District Number
    senateNum = data[i].StSenDist;

    //Internal ID number for the asset
    internalID = data[i].INTERNALID;

    //Flood information such as "Area of Minimal Flood Hazard" and Flood Zone
    flood = data[i].FEMAFldT;

    //This holds the data installed date. Time is omitted because they're all defaulted to midnight
    installed = data[i].DATE_INST.substr(0, 10);

    //Address for asset
    address = data[i].IFOADDRESS;

    //Program name
    program = data[i].PROGRAM;

    //Street for asset
    street = data[i].STREETON;

    //Saves data on the asset
    dataPoints.push([
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

    //This will set add the asset in a layer and includes asset information when clicking on the marker
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
  //After all the data has been scraped then the assets will be added on the map as a layer
  pointGroup.addTo(map);
});

//This is to create a toggle for districts layers
//reference
// https://leafletjs.com/examples/layers-control/
//https://leafletjs.com/examples/geojson/
//https://gis.stackexchange.com/questions/229723/displaying-properties-of-geojson-in-popup-on-leaflet

//Setting up Assembly District popup layer
//I got assembly data into a json files from NYC Open Data and renamed it as a javascript file and created a variable
//in StateAssemblyDistricts.js called var AssemblyBound before the {
//There is also a onlick method that will activate when the assembly layer is clicked on
assemblyDist = L.geoJSON(assemblyBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" + "Assembly District: " + feature.properties.assem_dist + "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Borough District layer same idea as the assembly district
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

//Setting up Community District layer same idea as the assembly district
communityDist = L.geoJSON(cdBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" + "Community District: " + feature.properties.boro_cd + "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Senate District layer same idea as the assembly district
senateDist = L.geoJSON(senateBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" + "Senate District: " + feature.properties.st_sen_dist + "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up Congressional District layer same idea as the assembly district
congDist = L.geoJSON(congBound, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<h2>" +
        "Congressional District: " +
        feature.properties.cong_dist +
        "</h2>"
    );
    layer.on("click", onClickDistrict);
  },
});

//Setting up City Council District layer same idea as the assembly district
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
cityCouncilDist.setStyle({ color: "black" });

//Create a layer group for control on the map in order to toggle the layers off and on
var boroLayer = L.layerGroup([boroDist]);
var communityLayer = L.layerGroup([communityDist]);
var assemblyLayer = L.layerGroup([assemblyDist]);
var senateLayer = L.layerGroup([senateDist]);
var congLayer = L.layerGroup([congDist]);
var cityLayer = L.layerGroup([cityCouncilDist]);

//Reference if you want to remove layers or add layers
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
Side bar. The side bar will show the asset data. Clicking on the text will move the user to the 
asset and zoomed in with a distinct marker
*/
var layerGroup = L.layerGroup().addTo(map); //this is to hold the marker to indicate which point is selected from the side bar

//This is a function to move to a point that is on the side bar
function moveToPoint(e) {
  layerGroup.clearLayers(); //This removes previously clicked on point indicator from the side bar
  splits = e.target.innerText.split(/[: \n]/); //Splits the data to get the coordinates frm the side bar
  lat = splits[2]; //Latitude
  long = splits[5]; //Longitude
  map.setView(new L.LatLng(lat, long), 19); //Move to the selected point from the map and zoom in
  L.marker([lat, long]).addTo(layerGroup); //Create a marker to differeniate among the many points
}

//handle onclick data for districts
function onClickDistrict(e) {
  //map.removeLayer(pointGroup); //When the user selects a layer then points will be updated on the map so the user can clcik on the points on top of the layer
  //map.addLayer(pointGroup);
  //the array wil hold data points on a selectedd layer
  let arr = [];
  //This is to keep track of the clicked layer
  let currLayer = 0;
  //This is used as a index to reach the data in the dataPoints array which will have various fields of data
  let selectDistrict = 0;
  //This will be used for the charts later on and will reset on each click
  let objects = [];
  //stores dates for layers
  const datesLayer = [];

  /*
  This part will check the layer clicked and update the selectDistrict variable that match 
  the clicked layer and will be used to index into the array
  if selectDistrict becomes 4 it will give the index to community district
  if selectDistrict becomes 3 it will give the index to assembly district
  if selectDistrict becomes 5 it will give the index to borough code
  if selectDistrict becomes 7 it will give the index to congressional district
  if selectDistrict becomes 8 it will give the index to city council district
  if selectDistrict becomes 9 it will give the index to senate district
  */
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
  //This will loop through the array and put asset points into an array that match the clicked layer
  for (var i = 0; i < dataPoints.length; i++) {
    if (dataPoints[i][selectDistrict] == currLayer) {
      arr.push(dataPoints[i]);
    }
  }
  //Calls the DOM to get the sidebar
  const myNode = document.getElementById("sidebar");
  //Reset the DOM when user clicks on a different layer district or differnt istrict
  myNode.innerHTML = "";
  //This will be for the side bar and will put the asset information on the sidebar and the user can click on it to move to the point
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
    //This part will help organize the dates for the charts. The chart will show data on assets installed over time
    dates = arr[i][12].replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
    //This tracks whether the point is a match in case of duplicate dates.
    var tracker = false;
    //This will loop through the selected layer district that has all points that are in the select district
    for (var j = 0; j < datesLayer.length; j++) {
      //if there is a duplicate then mark the tracker as true to indicate a duplicate
      if (datesLayer[j][0] == dates) {
        //increase the number of assets installed by 1
        datesLayer[j][1] += 1;
        //Indicate there's a duplicate
        tracker = true;
      }
    }
    //If this is a unique asset point and has a date then save the data
    if (!tracker && dates != "") {
      datesLayer.push([dates, 1]);
    }
  }
  //Sort the data
  datesLayer.sort();
  //Parse the dates(the type was a string) and set it as a date
  for (var k = 0; k < datesLayer.length; k++) {
    var parseTime = d3.timeParse("%Y-%m-%d");
    date_assets = parseTime(datesLayer[k][0]);
    count_assets = datesLayer[k][1];
    //This will be used to help plot the points on the chart
    objects.push({ dates: date_assets, value: count_assets });
  }

  /*
  Charts and Time Slider
  */
  //Useful resource http://www.d3noob.org/2016/08/changing-number-of-ticks-on-axis-in.html
  //Sets up the margins, width, and height for the chart
  var margin = { top: 40, left: 45, bottom: 40, right: 10 };
  var width = 1200 - margin.left - margin.right;
  var height = 230 - margin.top - margin.bottom;
  //reset the charts when clicking on a new layer or district
  d3.selectAll("#chart").remove();
  //Sets up the x and y ranges for the chart
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  //guides the line for plotting
  var valueline = d3
    .line()
    .x(function (d) {
      return x(d.dates);
    })
    .y(function (d) {
      return y(d.value);
    });
  //Sets the style to see the chart on the page
  var styles = "position: absolute; bottom:20;";
  //Puts the chart into the DOM and sets up the size and margins
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "chart")
    .attr("style", styles)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  //sets the domain for the x
  x.domain(
    d3.extent(objects, function (d) {
      return d.dates;
    })
  );
  //sets the y domain
  y.domain([
    0,
    d3.max(objects, function (d) {
      return d.value;
    }),
  ]);
  //Draws the line
  svg
    .append("path")
    .data([objects])
    .attr("class", "line")
    .attr("d", valueline)
    .attr("fill", "none")
    .attr("stroke", "steelblue");

  // Adding X Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top) + ")"
    )
    .style("text-anchor", "middle")
    .text("Date Asset Installed");

  //Adding Y Axis
  svg.append("g").call(d3.axisLeft(y));
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Assets Installed");
  // adding title for chart
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Asset Installed");
}
