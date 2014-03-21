(function(window, document, undefined){

	var dataVisualisation = function(){

		var margin = {top: 4, right: 5, bottom: 4, left: 5},
    pad = {top: 42, right: 12, bottom: 12, left: 4},
    width = 670 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom,
    padding = 0;

    var rMin = 4,
    rMax = 48;	

    var svg = d3.select("#viz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('class', 'svg')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");





    
    function colorScale(data){

      return d3.scale.ordinal()
      .domain(["male", "female", "both"])
      .range(["#97BF3F", "#F2ECD8", "#FF4500"]);
    }

    function addDollar(data){
      return "$" + data;
    }

    function radiusScale(data, expo){
      return d3.scale.pow().exponent(expo).domain([0, d3.max(data, function(d){return d.price;})]).range([rMin, rMax]);
    }

    d3.json('data/human.json', function(error, data) {

      if (error) { 
    console.log("there is an error " + error); //Log the error.
  } 
  else {

    var color = colorScale(data);

    radius = radiusScale(data, 0.8);

    var index_num = 0;

    var nodes = d3.range(data.length).map(function() {

      var currentIndex = data[index_num];
      index_num++;
      return {
        radius: radius(currentIndex.price),
        color: color(currentIndex.gender),
        price: addDollar(currentIndex.price),
        detail: currentIndex.detail,
        age: currentIndex.age,
        date: currentIndex.date,
        gender: currentIndex.gender,
        decades: currentIndex.decades,
        cx: width / 2,
        cy: height / 2

      };
    });

    makeBubble(nodes);
    goOver(nodes);

  }

  function makeBubble(nodes){

    var arrayGender = [["both",120], ["female", 320], ["male", 550]],
    arrayDate = [["not specified", 40], ["-500 - 0", 145], ["1650", 250],["1855", 350],["2004 - 2012", 550]],
    arrayAge = [["baby", 30], ["child", 155],["adult", 345],["not specified", 610]];

        var xG = d3.scale.ordinal()
          .domain([arrayGender[0][0], arrayGender[1][0], arrayGender[2][0]])
          .range([arrayGender[0][1], arrayGender[1][1], arrayGender[2][1]]);


          var xA = d3.scale.ordinal()
          .domain([arrayAge[0][0], arrayAge[1][0], arrayAge[2][0], arrayAge[3][0]])
          .range([arrayAge[0][1], arrayAge[1][1], arrayAge[2][1], arrayAge[3][1]]);


          var xD = d3.scale.ordinal()
          .domain([arrayDate[0][0], arrayDate[1][0], arrayDate[2][0], arrayDate[3][0], arrayDate[4][0]])
          .range([arrayDate[0][1], arrayDate[1][1], arrayDate[2][1], arrayDate[3][1], arrayDate[4][1]]);


      var xAxisG = d3.svg.axis()
      .scale(xG)
      .orient("bottom")
      .ticks(5);

      var xAxisA = d3.svg.axis()
      .scale(xA)
      .orient("bottom")
      .ticks(5);

      var xAxisD = d3.svg.axis()
      .scale(xD)
      .orient("bottom")
      .ticks(5);

    var force = forceNodes(nodes);

    var circle = svg.selectAll("circle")
    .data(nodes);

    circle.enter().append("circle");

    circle.attr("r", function(d) {return d.radius; })
      .style("fill", function(d){ return d.color; })
      .attr('class', 'bubbles')
      .call(force.drag);


    svg.append("g")
      // .data(currentPicked)
      .attr("class", "x axis axisGender")
      .attr("transform", "translate(0, 280)")
      // .attr("transform", "translate(0," + height + ")")
      .call(xAxisG);
      // .append("text")

      svg.append("g")
      // .data(nodes)
      .attr("class", "x axis axisAge")
      .attr("transform", "translate(0, 280)")
      // .attr("transform", "translate(0," + height + ")")
      .call(xAxisA);
      // .append("text")

svg.append("g")
      // .data(nodes)
      .attr("class", "x axis axisDate")
      .attr("transform", "translate(0, 280)")
      // .attr("transform", "translate(0," + height + ")")
      .call(xAxisD);
      // .append("text")

    function tick(e) {
      circle
        .each(gravity(0.2 * e.alpha))
        .each(collide(0.5, nodes))
        .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)); }) //Bubbles can't go outside bounding box
        .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min((height - 25) - d.radius, d.y)); }); //Bubbles can't go outside bounding box
    }

    function forceNodes(nodes){
      return d3.layout.force()
      .stop()
      .nodes(nodes)
      .size([width, height])
      .friction(0.8)
      .gravity(0)
      .charge(-10)
      .on("tick", tick)
      .start();
    }



  $( "#sort" ).on( "click", function() {
          $('.axisGender').hide();
      $('.axisAge').hide();
       $('.axisDate').hide();
    for(var i = 0; i < nodes.length; i++){
      nodes[i].cx = 330;
    }
    var force = forceNodes(nodes);
      circle.call(force.drag);
  });

    $( "#sort_age" ).on( "click", function() {
        $('.axisGender').hide();
        $('.axisAge').show();
        $('.axisDate').hide();

    for(var i = 0; i < nodes.length; i++){
      if (nodes[i].age === 'baby'){
        nodes[i].cx = arrayAge[0][1];
      } else if (nodes[i].age === 'child'){
        nodes[i].cx = arrayAge[1][1];
      }else if (nodes[i].age === 'adult'){
        nodes[i].cx = arrayAge[2][1];
      }else if (nodes[i].age === 'ns'){
        nodes[i].cx = arrayAge[3][1];
      }
    }
   var force = forceNodes(nodes);

      circle.call(force.drag);
  });





    $( "#sort_gender" ).on( "click", function() {
            $('.axisGender').show();
      $('.axisAge').hide();
       $('.axisDate').hide();
     
    for(var i = 0; i < nodes.length; i++){
      if (nodes[i].gender === 'both'){
        nodes[i].cx = arrayGender[0][1];
      } else if (nodes[i].gender === 'female'){
        nodes[i].cx = arrayGender[1][1];
      }else if (nodes[i].gender === 'male'){
        nodes[i].cx = arrayGender[2][1];
      }
    }
   var force = forceNodes(nodes);

      circle.call(force.drag);
  });


    // var arrayGender = [["both",120], ["female", 320], ["male", 550]],
    // arrayDate = [["not specified", 40], ["-500 - 0", 140], ["1650", 250],["1855", 350],["2004 - 2012", 550]],
    // arrayAge = [["baby", 20], ["child", 180],["adult", 360],["not specified", 630]];

      $( "#sort_date" ).on( "click", function() {
            $('.axisGender').hide();
      $('.axisAge').hide();
      $('.axisDate').show();
     
    for(var i = 0; i < nodes.length; i++){
      if (nodes[i].decades === 'ns'){
        nodes[i].cx = arrayDate[0][1];
      } else if (nodes[i].decades === 'bce'){
        nodes[i].cx = arrayDate[1][1];
      } else if (nodes[i].decades === 'early_modern'){
        nodes[i].cx = arrayDate[2][1];
      }else if (nodes[i].decades === 'eighteen'){
        nodes[i].cx = arrayDate[3][1];
      }else if (nodes[i].decades === 'present'){
        nodes[i].cx = arrayDate[4][1];
      }
    }
   var force = forceNodes(nodes);

      circle.call(force.drag);
  });

    circle.exit().remove();

}//END OF MAKE BUBBLE


// function createList(d){

//   var lists = $('<li></li>');
//   lists.empty();

//    var listLabels = [["Price", "price"],
//   ["Detail","detail"],
//   ["Date", "date"]];

//   listLabels.forEach(function(entry){



//     var  col1 = $('<span></span>').addClass('label').text(entry[0] + ": ");
//     var col2 = $('<span></span>').addClass('item-info').text(d[entry[1]]).append('<br />');
//     col1.append(col2);
//     lists.append(col1);


//   })

//   var col3 = $('<span></span>').addClass('item-star').text("All Prices are in U.S. Dollars and adjusted for inflation").append('<br />');
//   lists.append(col3);

//   return lists;
// }


function goOver(nodes){
 
  d3.selectAll("circle")
  .on("mouseover", function(d) {

    //Get this bar's x/y values, then augment for the tooltip
    var xPosition = parseFloat(d.px);
    var yPosition = parseFloat(d.py);

            //Update the tooltip position and value
            d3.select("#tooltip")
            // .style("left", xPosition + "px")
            // .style("top", yPosition + "px")  
            .style("left", pad.left + "px")
            .style("top", pad.top + "px")    
            .select("#value")
            .text(d.price);
            d3.select("#detail")
            .text(d.detail);    
            d3.select("#age")
            .text(d.age); 
            d3.select("#date")
            .text(d.date);   
            d3.select("#gender")
            .text(d.gender);         
            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);

    // var lists = createList(d);
    // $("#country-info ul").html(lists).show();
    
    d3.select(this)
    .style("stroke-width", '4')
    .style("stroke", "#292B25");

  })
  .on("mouseout", function() {

    d3.select("#tooltip").classed("hidden", true);
    d3.select(this)
    .style("stroke-width", "1.5");

    // $('#country-info ul').hide();
  });
}

function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

function collide(alpha, nodes) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + radius.domain()[1] + padding,
    nx1 = d.x - r,
    nx2 = d.x + r,
    ny1 = d.y - r,
    ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
        y = d.y - quad.point.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
      || x2 < nx1
      || y1 > ny2
      || y2 < ny1;
    });

  };
}

var numberWithCommas = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}


});//END OF IMPORT JSON

};
dataVisualisation();
})(this, document);