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
    .style("fill", "#ff7f50")
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

// Define the gradient
const defs = svgBarChart.append("defs");
const gradient = defs
  .append("linearGradient")
  .attr("id", "barGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");
gradient.append("stop").attr("offset", "0%").attr("stop-color", "#ff7f50");
gradient.append("stop").attr("offset", "100%").attr("stop-color", "#ff4500");

const yBarChart = d3.scaleLinear().range([barHeight, 0]);

const xAxisBarChart = svgBarChart
  .append("g")
  .attr("transform", `translate(0,${barHeight})`)
  .attr("class", "axis-label");

const yAxisBarChart = svgBarChart.append("g").attr("class", "axis-label");

const barSeasonSelect = d3.select("#bar-season-select");

const barTooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

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

  svgBarChart
    .append("text")
    .attr("x", barWidth / 2)
    .attr("y", barHeight + barMargin.bottom - 10)
    .attr("fill", "#000")
    .style("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Goalie");

  yAxisBarChart.call(d3.axisLeft(yBarChart));

  svgBarChart
    .append("text")
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
    .attr("height", (d) => barHeight - yBarChart(d.saves))
    .style("fill", "url(#barGradient)")
    // Add tooltip on mouseover
    .on("mouseover", function (event, d) {
      const savesValue = d.saves;
      barTooltip.transition().duration(200).style("opacity", 0.9);
      barTooltip
        .html(`<strong>Saves:</strong> ${savesValue}`)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      barTooltip.transition().duration(500).style("opacity", 0);
    });

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

// Read CSV file to get unique seasons
d3.csv("goalieSaves.csv").then((data) => {
  // Parse CSV data
  data.forEach((d) => {
    d.saves = +d.saves;
  });

  // Extract unique seasons
  const seasons = d3.group(data, (d) => d.season.slice(0, 9));

  // Populate dropdown options
  barSeasonSelect.selectAll("option").remove(); // Remove existing options
  seasons.forEach((_, season) => {
    barSeasonSelect.append("option").text(season).attr("value", season);
  });

  // Initialize chart with the first season
  updateBarChart(seasons.get(data[0].season.slice(0, 9)));

  // Event listener for dropdown change
  barSeasonSelect.on("change", function () {
    const selectedSeason = this.value;
    updateBarChart(seasons.get(selectedSeason));
  });
});


//radar chart
// Radar chart setup
const radarWidth = 400;
const radarHeight = 400;
const radarMargin = { top: 20, right: 30, bottom: 30, left: 40 };

const radarScale = d3.scaleLinear().range([0, radarWidth / 2]);
const radarAngleScale = d3.scaleBand().range([0, 2 * Math.PI]);

const radarSVG = d3
  .select("#radar-chart")
  .attr("width", radarWidth + radarMargin.left + radarMargin.right)
  .attr("height", radarHeight + radarMargin.top + radarMargin.bottom)
  .append("g")
  .attr(
    "transform",
    `translate(${radarWidth / 2 + radarMargin.left},${radarHeight / 2 + radarMargin.top})`
  );

function updateRadarChart(data, maxValues) {
  const maxStat = d3.max(data, (d) => d.value);
  radarScale.domain([0, maxStat]);
  radarAngleScale.domain(data.map((d) => d.stat));

  radarSVG.selectAll("*").remove();

  // Add radial gridlines
  radarSVG
    .selectAll(".radar-grid")
    .data(radarScale.ticks(5).slice(1))
    .enter()
    .append("circle")
    .attr("class", "radar-grid")
    .attr("r", (d) => radarScale(d))
    .style("stroke", "#aaa")
    .style("fill", "none")
    .style("stroke-opacity", 0.5);

  const radarAxes = radarSVG
    .selectAll(".radar-axis")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radar-axis");

  radarAxes
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr(
      "x2",
      (d, i) =>
        radarScale(maxStat) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr(
      "y2",
      (d, i) =>
        radarScale(maxStat) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr("stroke", "black");

  // Add axes labels
  radarAxes
    .append("text")
    .attr(
      "x",
      (d, i) =>
        radarScale(maxStat) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr(
      "y",
      (d, i) =>
        radarScale(maxStat) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr("dy", "-0.5em")
    .attr("text-anchor", "middle")
    .text((d) => maxValues[d.stat]);

  const radarArea = d3
    .areaRadial()
    .angle((d, i) => radarAngleScale(d.stat))
    .outerRadius((d, i) => radarScale(d.value))
    .curve(d3.curveLinearClosed);

  radarSVG
    .append("path")
    .datum(data)
    .attr("fill", "#ff7f50")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#ff7f50")
    .attr("d", radarArea);

  // Add labels for each data point
  radarAxes
    .append("text")
    .attr(
      "x",
      (d, i) =>
        radarScale(maxStat) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr(
      "y",
      (d, i) =>
        radarScale(maxStat) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr("dy", "1em")
    .attr("text-anchor", "middle")
    .text((d) => d.stat);

  const radarPoints = radarSVG
    .selectAll(".radar-point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "radar-point")
    .attr(
      "cx",
      (d, i) =>
        radarScale(d.value) * Math.cos(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr(
      "cy",
      (d, i) =>
        radarScale(d.value) * Math.sin(radarAngleScale(d.stat) - Math.PI / 2)
    )
    .attr("r", 5)
    .attr("fill", "#ff7f50")
    .append("title")
    .text((d) => `${d.stat}: ${d.value}`);
}

// Load data and setup dropdowns
d3.csv("PlayerPerformanceInPlayoffs.csv").then((data) => {
  const seasons = Array.from(new Set(data.map((d) => d.Season)));

  const playerSelect = d3.select("#player-select");
  const seasonSelect = d3.select("#season-select");

  seasonSelect
    .selectAll("option")
    .data(seasons)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  // Calculate maxValues dynamically
  const maxValues = {};
  const stats = ["Goals", "Assists", "Hits", "Takeaways", "PIMDrawn"];
  stats.forEach(stat => {
    maxValues[stat] = d3.max(data, d => +d[stat]);
  });

  function updatePlayerOptions() {
    const selectedSeason = seasonSelect.node().value;
    const playersForSeason = data
      .filter(d => d.Season === selectedSeason)
      .map(d => d.Player);

    playerSelect.selectAll("option").remove();

    playerSelect
      .selectAll("option")
      .data(playersForSeason)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d);

    updateChart(); // Automatically update chart for the first player of the selected season
  }

  function updateChart() {
    const selectedPlayer = playerSelect.node().value;
    const selectedSeason = seasonSelect.node().value;
    const playerData = data.filter(
      (d) => d.Player === selectedPlayer && d.Season === selectedSeason
    )[0];
    const radarData = stats.map(stat => ({
      stat: stat,
      value: +playerData[stat]
    }));
    updateRadarChart(radarData, maxValues);
  }

  playerSelect.on("change", updateChart);
  seasonSelect.on("change", updatePlayerOptions);

  // Trigger change event for the first season
  seasonSelect.dispatch("change");
});



//pie chart
// Load the data for body injuries by season
d3.csv("InjuriesByArea.csv").then(function (data) {
  // Parse the data
  data.forEach(function (d) {
    // Convert the values to numbers
    d["2018-2019"] = +d["2018-2019"];
    d["2019-2020"] = +d["2019-2020"];
    d["2020-2021"] = +d["2020-2021"];
    d["2021-2022"] = +d["2021-2022"];
  });

  // Create a dropdown for season selection
  const seasonDropdown = d3.select("#season-dropdown");
  seasonDropdown
    .selectAll("option")
    .data(data.columns.slice(1))
    .enter()
    .append("option")
    .text(function (d) {
      return d;
    })
    .attr("value", function (d) {
      return d;
    });

  // Initial pie chart with the first season data
  const initialSeasonData = data.map(function (d) {
    return {
      Location: d.Location,
      value: d["2018-2019"],
    };
  });
  createPieChart(initialSeasonData);

  // Update the pie chart when a new season is selected
  seasonDropdown.on("change", function () {
    const selectedSeason = seasonDropdown.property("value");
    const seasonData = data.map(function (d) {
      return {
        Location: d.Location,
        value: d[selectedSeason],
      };
    });
    createPieChart(seasonData);
  });
});

function createPieChart(seasonData) {
  // Remove existing pie chart
  d3.select("#pie-chart-svg").selectAll("*").remove();
  d3.select("#legend").selectAll("*").remove();
  d3.select("#values").selectAll("*").remove(); // Clear existing values

  // Set up pie chart parameters
  const pieWidth = 600;
  const pieHeight = 400;
  const pieRadius = Math.min(pieWidth, pieHeight) / 2;

  const customColors = ["#FFD3A6", "#FFC277", "#FFB81C", "#E69900", "#D2001C", "#BF0816", "#9E0015", "#73000E", "#470007", "#250001"];

  const color = d3
    .scaleOrdinal()
    .domain(seasonData.map((d) => d.Location))
    .range(customColors); // Use custom colors here

  const arc = d3
    .arc()
    .outerRadius(pieRadius)
    .innerRadius(0);

  const arcOver = d3
    .arc()
    .outerRadius(pieRadius + 10) // Increase the outer radius slightly upon hover
    .innerRadius(0); // Adjust the inner radius to keep the thickness constant

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.value);

  const svg = d3
    .select("#pie-chart-svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr(
      "transform",
      "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")"
    );

  // Generate pie chart
  const arcs = svg.selectAll(".arc")
    .data(pie(seasonData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .on("mouseover", function (d) {
      d3.select(this).transition()
        .duration("50")
        .attr("d", arcOver); // Change the arc to the arcOver upon hover
      const total = d3.sum(seasonData, d => d.value);
      const percentage = Math.round((d.data.value / total) * 100);
      d3.select(this.parentNode).select("title").text(`${d.data.Location}: ${d.data.value} (${percentage}%)`);
    })
    .on("mouseout", function (d) {
      d3.select(this).transition()
        .duration("50")
        .attr("d", arc); // Revert back to original arc upon mouseout
    })
    .append("title")
    .text(d => `${d.data.Location}: ${d.data.value}`);

  // Legend
  const legend = d3.select("#legend");
  seasonData.forEach((d, i) => {
    const legendItem = legend.append("div").attr("class", "legend-item");

    legendItem
      .append("div")
      .attr("class", "legend-color-box")
      .style("background-color", color(d.Location));

    legendItem.append("span").text(`${d.Location}`);
  });
}


