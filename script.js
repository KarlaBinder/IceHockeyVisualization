//map chart
d3.xml("map.svg").then(function (svg) {
  document.getElementById("svg-container").appendChild(svg.documentElement);

  var teamColors = {
    "US-CA": { color: "#F47A38", team: "Anaheim Ducks" },
    "US-AZ": { color: "#8C2633", team: "Arizona Coyotes" },
    "US-MA": { color: "#FFB81C", team: "Boston Bruins" },
    "US-NY": {
      color: "#0038A8",
      team: ["Buffalo Sabres", "New York Islanders", "New York Rangers"],
    },
    "CA-AB": { color: "#D2001C", team: ["Calgary Flames", "Edmonton Oilers"] },
    "US-NC": { color: "#CE1126", team: "Carolina Hurricanes" },
    "US-IL": { color: "#CF0A2C", team: "Chicago Blackhawks" },
    "US-CO": { color: "#6F263D", team: "Colorado Avalanche" },
    "US-OH": { color: "#002654", team: "Columbus Blue Jackets" },
    "US-TX": { color: "#006847", team: "Dallas Stars" },
    "US-MI": { color: "#ce1126", team: "Detroit Red Wings" },
    "US-FL": {
      color: "#041E42",
      team: ["Florida Panthers", "Tampa Bay Lightning"],
    },
    "US-MN": { color: "#154734", team: "Minnesota Wild" },
    "CA-QC": { color: "#AF1E2D", team: "Montreal Canadiens" },
    "US-TN": { color: "#FFB81C", team: "Nashville Predators" },
    "US-NJ": { color: "#CE1126", team: "New Jersey Devils" },
    "CA-ON": {
      color: "#B79257",
      team: ["Ottawa Senators", "Toronto Maple Leafs"],
    },
    "US-PA": {
      color: "#F74902",
      team: ["Philadelphia Flyers", "Pittsburgh Penguins"],
    },
    "US-WA": { color: "#001628", team: "Seattle Kraken" },
    "US-MO": { color: "#002F87", team: "St. Louis Blues" },
    "US-NV": { color: "#B4975A", team: "Vegas Golden Knights" },
    "US-DC": { color: "#041E42", team: "Washington Capitals" },
    "CA-MB": { color: "#041E42", team: "Winnipeg Jets" },
  };

  function setTeamColorAndHover(stateId) {
    var defaultColor = "light gray";
    var statePath = d3.select("#" + stateId);

    var fillColor = teamColors[stateId]
      ? teamColors[stateId].color
      : defaultColor;
    statePath.attr("fill", fillColor);

    statePath
      .on("mouseover", function (event) {
        var teamName = teamColors[stateId]
          ? teamColors[stateId].team
          : "No team";
        tooltip
          .style("opacity", 1)
          .html(teamName)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });
  }

  d3.selectAll("#USA path, #USA g").each(function () {
    var stateId = d3.select(this).attr("id");
    setTeamColorAndHover(stateId);
  });

  d3.selectAll("#Canada path, #Canada g").each(function () {
    var provinceId = d3.select(this).attr("id");
    setTeamColorAndHover(provinceId);
  });

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
});

//line chart
d3.csv("stanley_cup.csv").then(function (data) {
  data.forEach(function (d) {
    d.cups = +d["Stanley Cups"];
  });

  const margin = { top: 20, right: 30, bottom: 150, left: 60 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(
      data.map(function (d) {
        return d.Team;
      })
    )
    .range([0, width])
    .padding(0.1);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.cups;
      }),
    ])
    .nice()
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("class", "x-axis-title")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 100})`)
    .text("NHL Teams");

  svg
    .append("text")
    .attr("class", "y-axis-title")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .text("Number of Stanley Cups");

  const line = d3
    .line()
    .x(function (d) {
      return x(d.Team) + x.bandwidth() / 2;
    })
    .y(function (d) {
      return y(d.cups);
    });

  svg.append("path").datum(data).attr("class", "line").attr("d", line);

  var lineTooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.Team) + x.bandwidth() / 2;
    })
    .attr("cy", function (d) {
      return y(d.cups);
    })
    .attr("r", 4)
    .style("fill", "steelblue")
    .on("mouseover", function (event, d) {
      lineTooltip.transition().duration(200).style("opacity", 0.9);
      lineTooltip
        .html("Stanley Cups: " + d.cups)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", function (d) {
      lineTooltip.transition().duration(500).style("opacity", 0);
    });
});

var spacing = 520;
var totalHeight =
  document.getElementById("svg-container").clientHeight +
  document.getElementById("chart").clientHeight +
  spacing;

document.getElementById("svg-container").style.height = totalHeight + "px";

// bar chart
// bar chart
const barMargin = { top: 20, right: 70, bottom: 150, left: 80 };
const barWidth = 800 - barMargin.left - barMargin.right;
const barHeight = 500 - barMargin.top - barMargin.bottom;

const svgBarChart = d3
  .select("#bar-chart-container")
  .attr("width", barWidth + barMargin.left + barMargin.right)
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
  .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

const yBarChart = d3.scaleLinear().range([barHeight, 0]);

const xAxisBarChart = svgBarChart
  .append("g")
  .attr("transform", `translate(0,${barHeight})`)
  .attr("class", "axis-label");

const yAxisBarChart = svgBarChart.append("g").attr("class", "axis-label");

const barSeasonSelect = d3.select("#bar-season-select");

function updateBarChart(data) {
  const xScale = d3
    .scaleBand()
    .range([0, barWidth])
    .padding(0.1)
    .domain(data.map((d) => d.goalie));

  yBarChart.domain([0, d3.max(data, (d) => d.saves)]);

  xAxisBarChart
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end")
  .attr("dx", "-0.5em")
  .attr("dy", "0.5em");

svgBarChart.append("text") 
  .attr("x", barWidth / 2)
  .attr("y", barHeight + barMargin.bottom - 10) 
  .attr("fill", "#000")
  .style("text-anchor", "middle")
  .attr("font-size", "14px") 
  .text("Goalie");


  yAxisBarChart.call(d3.axisLeft(yBarChart));

  svgBarChart.append("text") 
      .attr("transform", "rotate(-90)")
      .attr("y", -barMargin.left + 20) 
      .attr("x", -barHeight / 2)
      .attr("dy", "0.71em")
      .style("text-anchor", "middle")
      .attr("font-size", "14px") 
      .text("Number of Saves");
  

  const bars = svgBarChart.selectAll(".bar").data(data);

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .merge(bars)
    .attr("x", (d) => xScale(d.goalie))
    .attr("y", (d) => yBarChart(d.saves))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => barHeight - yBarChart(d.saves));

  bars.exit().remove();

  const logos = svgBarChart.selectAll(".logo").data(data);

  logos
    .enter()
    .append("image")
    .attr("class", "logo")
    .merge(logos)
    .attr("x", (d) => xScale(d.goalie) + xScale.bandwidth() / 2 - 15)
    .attr("y", (d) => yBarChart(d.saves) - 20)
    .attr("width", 30)
    .attr("height", 30)
    .attr("xlink:href", (d) => d.logo_url);

  logos.exit().remove();
}

d3.csv("goalieSaves.csv").then((data) => {
  data.forEach((d) => {
    d.saves = +d.saves;
  });

  const seasons = d3.group(data, (d) => d.season.slice(0, 9));

  updateBarChart(seasons.get("2023-2024"));

  barSeasonSelect.on("change", function () {
    const selectedSeason = barSeasonSelect.node().value;
    updateBarChart(seasons.get(selectedSeason));
  });
});

//radar chart
const radarWidth = 400;
const radarHeight = 400;
const radarMargin = { top: 20, right: 30, bottom: 30, left: 40 };

const radarScale = d3.scaleLinear().range([0, radarWidth / 2]);
const radarAngleScale = d3.scaleBand().range([0, 2 * Math.PI]);

const radarSVG = d3.select("#radar-chart")
  .attr("width", radarWidth + radarMargin.left + radarMargin.right)
  .attr("height", radarHeight + radarMargin.top + radarMargin.bottom)
  .append("g")
  .attr("transform", `translate(${radarWidth / 2 + radarMargin.left},${radarHeight / 2 + radarMargin.top})`);

function updateRadarChart(data, maxValues) {
  const maxStat = d3.max(data, d => d.value);
  radarScale.domain([0, maxStat]);

  radarAngleScale.domain(data.map(d => d.stat));

  radarSVG.selectAll("*").remove();

  const radarAxes = radarSVG.selectAll(".radar-axis")
    .data(data)
    .enter().append("g")
    .attr("class", "radar-axis");

  radarAxes.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => radarScale(maxStat) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("y2", (d, i) => radarScale(maxStat) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("stroke", "black");

  radarAxes.append("text")
    .attr("x", (d, i) => radarScale(maxStat) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("y", (d, i) => radarScale(maxStat) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("dy", "-0.5em")
    .attr("text-anchor", "middle")
    .text(d => maxValues[d.stat]);

  const radarArea = d3.areaRadial()
    .angle((d, i) => radarAngleScale(d.stat))
    .outerRadius((d, i) => radarScale(d.value))
    .curve(d3.curveLinearClosed);

  radarSVG.append("path")
    .datum(data)
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "steelblue")
    .attr("d", radarArea);

  radarAxes.append("text")
    .attr("x", (d, i) => radarScale(maxStat) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("y", (d, i) => radarScale(maxStat) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text(d => d.stat);

  const radarPoints = radarSVG.selectAll(".radar-point")
    .data(data)
    .enter().append("circle")
    .attr("class", "radar-point")
    .attr("cx", (d, i) => radarScale(d.value) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("cy", (d, i) => radarScale(d.value) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2))
    .attr("r", 5)
    .attr("fill", "steelblue");
}

d3.csv("PlayerPerformanceInPlayoffs.csv").then(data => {
  const players = Array.from(new Set(data.map(d => d.Player)));

  const playerSelect = d3.select("#player-select");
  playerSelect.selectAll("option")
    .data(players)
    .enter().append("option")
    .attr("value", d => d)
    .text(d => d);

  const maxValues = {
    Goals: 50,
    Assists: 30,
    Hits: 100,
    Takeaways: 20,
    PIMDrawn: 50
  };

  playerSelect.on("change", function() {
    const selectedPlayer = playerSelect.node().value;
    const playerData = data.filter(d => d.Player === selectedPlayer)[0];
    const radarData = [
      { stat: "Goals", value: +playerData.Goals },
      { stat: "Assists", value: +playerData.Assists },
      { stat: "Hits", value: +playerData.Hits },
      { stat: "Takeaways", value: +playerData.Takeaways },
      { stat: "PIMDrawn", value: +playerData.PIMDrawn }
    ];
    updateRadarChart(radarData, maxValues);
  });
});


// Load the data for body injuries by season
d3.csv("InjuriesByArea.csv").then(function(data) {
    // Parse the data
    data.forEach(function(d) {
        d["2018-2019"] = +d["2018-2019"];
        d["2019-2020"] = +d["2019-2020"];
        d["2020-2021"] = +d["2020-2021"];
        d["2021-2022"] = +d["2021-2022"];
    });

    // Create a pie chart function
    function createPieChart(seasonData) {
        // Remove existing pie chart
        d3.select("#pie-chart-svg").selectAll("*").remove();

        // Set up pie chart parameters
        const pieWidth = 500;
        const pieHeight = 500;
        const pieRadius = Math.min(pieWidth, pieHeight) / 2;

        const color = d3.scaleOrdinal()
            .domain(data.columns.slice(1))
            .range(d3.schemeSet2);

        const arc = d3.arc()
            .outerRadius(pieRadius - 10)
            .innerRadius(0);

        const pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        const svg = d3.select("#pie-chart-svg")
            .attr("width", pieWidth)
            .attr("height", pieHeight)
            .append("g")
            .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

        // Create pie chart slices
        const g = svg.selectAll(".arc")
            .data(pie(seasonData))
            .enter().append("g")
            .attr("class", "arc");

        // Append paths for pie chart slices
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.Location); });

        // Add labels to pie chart slices with rotation
        const labelArc = d3.arc()
            .outerRadius(pieRadius - 40)
            .innerRadius(pieRadius - 40);

        g.append("text")
            .attr("transform", function(d) {
                const pos = labelArc.centroid(d);
                const angle = (d.startAngle + d.endAngle) / 2;
                return "translate(" + pos + ") rotate(" + (angle * 180 / Math.PI - 90) + ")";
            })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.Location; })
            .attr("text-anchor", function(d) {
                // Set the text anchor based on the angle
                const angle = (d.startAngle + d.endAngle) / 2;
                return angle > Math.PI ? "end" : "start";
            })
            .style("fill", "black");
    }

    // Create a dropdown for season selection
    const seasonDropdown = d3.select("#season-dropdown");
    seasonDropdown.selectAll("option")
        .data(data.columns.slice(1))
        .enter()
        .append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    // Initial pie chart with the first season data
    createPieChart(data[0]);

    // Update the pie chart when a new season is selected
    seasonDropdown.on("change", function() {
        const selectedSeason = seasonDropdown.property("value");
        const seasonData = data.map(function(d) {
            return { Location: d.Location, value: d[selectedSeason] };
        });
        createPieChart(seasonData);
    });
});










