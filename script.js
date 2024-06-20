//Map chart
d3.xml("svg/map.svg").then(function (svg) {
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

//Line chart
d3.csv("data/stanley_cup.csv").then(function (data) {
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

//Bar chart
const barMargin = { top: 20, right: 70, bottom: 150, left: 80 };
const barWidth = 800 - barMargin.left - barMargin.right;
const barHeight = 500 - barMargin.top - barMargin.bottom;

const svgBarChart = d3
  .select("#bar-chart-container")
  .attr("width", barWidth + barMargin.left + barMargin.right)
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
  .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

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
    .attr("width", 40)
    .attr("height", 40)
    .attr("xlink:href", (d) => d.logo_url);

  logos.exit().remove();
}

d3.csv("data/goalie_saves.csv").then((data) => {
  data.forEach((d) => {
    d.saves = +d.saves;
  });

  const seasons = d3.group(data, (d) => d.season.slice(0, 9));

  barSeasonSelect.selectAll("option").remove();
  seasons.forEach((_, season) => {
    barSeasonSelect.append("option").text(season).attr("value", season);
  });

  updateBarChart(seasons.get(data[0].season.slice(0, 9)));

  barSeasonSelect.on("change", function () {
    const selectedSeason = this.value;
    updateBarChart(seasons.get(selectedSeason));
  });
});

// Radar chart
d3.csv("data/player_performance_in_playoffs.csv").then((data) => {
  data.forEach((d) => {
    d.Goals = +d.Goals;
    d.Assists = +d.Assists;
    d.Hits = +d.Hits;
    d.Takeaways = +d.Takeaways;
    d.PIMDrawn = +d.PIMDrawn;
  });

  const seasons = [...new Set(data.map((d) => d.Season))];
  const playersBySeason = {};

  data.forEach((d) => {
    if (!playersBySeason[d.Season]) playersBySeason[d.Season] = [];
    playersBySeason[d.Season].push(d.Player);
  });

  const seasonSelect = d3.select("#season-select");
  seasons.forEach((season) => {
    seasonSelect.append("option").text(season).attr("value", season);
  });

  const playerSelect = d3.select("#player-select");
  function updatePlayerDropdown(season) {
    playerSelect.selectAll("option").remove();
    playersBySeason[season].forEach((player) => {
      playerSelect.append("option").text(player).attr("value", player);
    });
  }

  updatePlayerDropdown(seasons[0]);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  function drawRadarChart(player, season) {
    const playerData = data.find(
      (d) => d.Player === player && d.Season === season
    );
    if (!playerData) return;

    d3.select("#radar-chart").selectAll("*").remove();

    const chartData = [
      { axis: "Goals", value: playerData.Goals },
      { axis: "Assists", value: playerData.Assists },
      { axis: "Hits", value: playerData.Hits },
      { axis: "Takeaways", value: playerData.Takeaways },
      { axis: "PIMDrawn", value: playerData.PIMDrawn },
    ];

    const maxValues = {
      Goals: d3.max(
        data.filter((d) => d.Season === season),
        (d) => d.Goals
      ),
      Assists: d3.max(
        data.filter((d) => d.Season === season),
        (d) => d.Assists
      ),
      Hits: d3.max(
        data.filter((d) => d.Season === season),
        (d) => d.Hits
      ),
      Takeaways: d3.max(
        data.filter((d) => d.Season === season),
        (d) => d.Takeaways
      ),
      PIMDrawn: d3.max(
        data.filter((d) => d.Season === season),
        (d) => d.PIMDrawn
      ),
    };

    const width = 400,
      height = 400;
    const radius = Math.min(width, height) / 2;
    const levels = 5;
    const angleSlice = (Math.PI * 2) / chartData.length;

    const svg = d3
      .select("#radar-chart")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    for (let i = 0; i <= levels; i++) {
      const levelFactor = radius * (i / levels);
      svg
        .append("circle")
        .attr("r", levelFactor)
        .attr("cx", 0)
        .attr("cy", 0)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2,2")
        .style("stroke-opacity", 0.5);
    }

    const axis = svg
      .selectAll(".axis")
      .data(chartData)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "#CDCDCD")
      .style("stroke-width", "2px");

    axis
      .append("text")
      .attr("class", "legend")
      .attr(
        "x",
        (d, i) => (radius - 20) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y",
        (d, i) => (radius - 5) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .attr("text-anchor", "middle")
      .text((d) => d.axis);

    const radarLine = d3
      .lineRadial()
      .radius((d) => radius * (d.value / maxValues[d.axis]))
      .angle((d, i) => i * angleSlice);

      chartData.push(chartData[0]);

    svg
      .append("path")
      .datum(chartData)
      .attr("d", radarLine)
      .style("fill", "rgba(255, 127, 80, 0.5)")
      .style("stroke", "#ff7f50")
      .style("stroke-width", 2);

    svg
      .selectAll(".radarCircle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr(
        "cx",
        (d, i) =>
          radius *
          (d.value / maxValues[d.axis]) *
          Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) =>
          radius *
          (d.value / maxValues[d.axis]) *
          Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", "#ff7f50")
      .style("fill-opacity", 0.8)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.axis}: ${d.value}`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }

  drawRadarChart(playerSelect.node().value, seasonSelect.node().value);

  seasonSelect.on("change", function () {
    updatePlayerDropdown(this.value);
    drawRadarChart(playerSelect.node().value, this.value);
  });

  playerSelect.on("change", function () {
    drawRadarChart(this.value, seasonSelect.node().value);
  });
});

//Pie chart
d3.csv("data/injuries_by_area.csv").then(function (data) {
  data.forEach(function (d) {
    d["2018-2019"] = +d["2018-2019"];
    d["2019-2020"] = +d["2019-2020"];
    d["2020-2021"] = +d["2020-2021"];
    d["2021-2022"] = +d["2021-2022"];
  });

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

  const initialSeasonData = data.map(function (d) {
    return {
      Location: d.Location,
      value: d["2018-2019"],
    };
  });
  createPieChart(initialSeasonData);

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
  d3.select("#pie-chart-svg").selectAll("*").remove();
  d3.select("#legend").selectAll("*").remove();
  d3.select("#values").selectAll("*").remove();

  const pieWidth = 600;
  const pieHeight = 400;
  const pieRadius = Math.min(pieWidth - 20, pieHeight - 20) / 2;

  const customColors = [
    "#FFD3A6",
    "#FFC277",
    "#FFB81C",
    "#E69900",
    "#D2001C",
    "#BF0816",
    "#9E0015",
    "#73000E",
    "#470007",
    "#250001",
  ];

  const color = d3
    .scaleOrdinal()
    .domain(seasonData.map((d) => d.Location))
    .range(customColors);

  const arc = d3.arc().outerRadius(pieRadius).innerRadius(0);

  const arcOver = d3
    .arc()
    .outerRadius(pieRadius + 10)
    .innerRadius(0);

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.value);

  const svg = d3
    .select("#pie-chart-svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

  const arcs = svg
    .selectAll(".arc")
    .data(pie(seasonData))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .on("mouseover", function (d) {
      d3.select(this).transition().duration("50").attr("d", arcOver);
      const total = d3.sum(seasonData, (d) => d.value);
      const percentage = Math.round((d.data.value / total) * 100);
      d3.select(this.parentNode)
        .select("title")
        .text(`${d.data.Location}: ${d.data.value} (${percentage}%)`);
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration("50").attr("d", arc);
    })
    .append("title")
    .text((d) => `${d.data.Location}: ${d.data.value}`);

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
