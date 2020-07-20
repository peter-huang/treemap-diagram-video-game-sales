import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";
import { tree } from "d3";

const GAME_DATA =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

let COLORS = [
  "#caf0f8",
  "#ddd8c4",
  "#16db93",
  "#84b59f",
  "#69a297",
  "#048ba8",
  "#ff9f1c",
  "#ffbf69",
  "#c8553d",
  "#e63946",
  "#ff99c8",
  "#efea5a",
  "#fcf6bd",
  "#8338ec",
  "#a9def9",
  "#80b918",
  "#3c6e71",
  "#74c69d",
];
function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData(GAME_DATA);
  }, []);

  const getData = (url) => {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        const data = JSON.parse(req.responseText);

        setData(data);
      }
    };
    req.send();
  };

  return (
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 d-flex flex-column justify-content-center align-items-center">
          <div>
            <TreeMap data={data} />
          </div>

          <div class="text-center font-weight-bold text-black mt-2 pt-2 d-none">
            Designed and coded by{" "}
            <a class="credits" href="https://github.com/peter-huang">
              Peter Huang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeMap({ data }) {
  useEffect(() => {
    if (data.children != null) {
      drawTreeMap(data);
    }
  }, [data]);

  const drawTreeMap = (data) => {
    // set up color array
    for (let i = 0; i < data.children.length; i++) {
      const temp = COLORS[i];
      COLORS[i] = [data.children[i].name, temp];
    }

    const legendBox = 20;

    const paddingFactor = {
      top: 1,
      right: 1,
      bottom: 8,
      left: 1,
    };

    const padding = {
      top: 50,
      right: 50,
      bottom: paddingFactor.bottom * legendBox,
      left: 50,
    };

    const treePadding = 2;

    const dim = {
      width: 1000 + padding.right + padding.left,
      height: 500 + padding.top + padding.bottom,
    };

    // Tooltip
    const tooltip = d3
      .select("#body")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");

    // Graph Titles
    d3.select("#treemap")
      .append("div")
      .attr("id", "title")
      .text("Video Game Sales");

    d3.select("#title")
      .append("div")
      .attr("id", "description")
      .text("Top 100 Most Sold Video Games Grouped by Platform");

    const treemap = d3.treemap();
    treemap
      .size([dim.width, dim.height - padding.bottom])
      .paddingOuter(treePadding)
      .paddingInner(treePadding);

    const root = d3.hierarchy(data);

    root.sum((d) => {
      return d.value;
    });
    // .sort((a, b) => b.value - a.value);

    treemap(root);

    const xScale = d3.scaleLinear();
    xScale.domain([]);
    xScale.range([]);

    // SVG setup
    const svg = d3
      .select("#treemap")
      .append("svg")
      .attr("width", dim.width)
      .attr("height", dim.height);

    let tileView = svg
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "tile-container")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    tileView
      .append("rect")
      .attr("class", "tile")
      .attr("fill", (d, i) => {
        const g = d.parent.data.name;

        for (let i = 0; i < COLORS.length; i++) {
          if (COLORS[i][0] === g) {
            return COLORS[i][1];
          }
        }
      })
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)
      .on("mouseover", (d, i) => {
        let content =
          "Name: " +
          d.data.name +
          "<br />" +
          "Category: " +
          d.data.category +
          "<br />" +
          "Value: " +
          d.data.value;
        tooltip.transition().duration(100).style("opacity", 0.9);
        let pos = d3
          .select(document.getElementsByClassName("tile")[i])
          .node()
          .getBoundingClientRect();
        let x = pos.x - window.pageXOffset + 10 + "px";
        let y = pos.y - window.pageYOffset + 10 + "px";
        tooltip
          .html(content)
          .style("left", x)
          .style("top", y)
          .style("opacity", 0.9)
          .attr("data-value", d.data.value);
      })
      .on("mouseout", (d) => {
        tooltip.transition().duration(100).style("opacity", 0);
      });

    // Text
    tileView
      .append("text")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0 + 8)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("font-size", "0.5em")
      .html((d) => d.data.name);

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr(
        "transform",
        "translate(" +
          (dim.width / 3 - padding.left / 3) +
          ", " +
          (dim.height - padding.bottom) +
          ")"
      );

    for (let i = 0; i < COLORS.length; i++) {
      if (i >= 0 && i < 6) {
        legend
          .append("rect")
          .attr("class", "legend-item")
          .attr("width", legendBox)
          .attr("height", legendBox)
          .attr("x", 0)
          .attr("y", legendBox * (i + 1))
          .style("fill", COLORS[i][1])
          .style("stroke-width", 1)
          .style("stroke", "black");

        legend
          .append("text")
          .attr("class", "legend-item-text")
          .attr("width", legendBox)
          .attr("height", legendBox)
          .style("font-size", "1em")
          .attr("x", legendBox * 2)
          .attr("y", legendBox * (i + 1) + legendBox / 1.25)
          .text(COLORS[i][0]);
      } else if (i >= 6 && i < 12) {
        legend
          .append("rect")
          .attr("class", "legend-item")
          .attr("width", legendBox)
          .attr("height", legendBox)
          .attr("x", padding.right * 3)
          .attr("y", legendBox * (i - 5))
          .style("fill", COLORS[i][1])
          .style("stroke-width", 1)
          .style("stroke", "black");

        legend
          .append("text")
          .attr("class", "legend-item-text")
          .attr("width", legendBox)
          .attr("height", legendBox)
          .style("font-size", "1em")
          .attr("x", padding.right * 3 + legendBox * 2)
          .attr("y", legendBox * (i - 5) + legendBox / 1.25)
          .text(COLORS[i][0]);
      } else {
        legend
          .append("rect")
          .attr("class", "legend-item")
          .attr("width", legendBox)
          .attr("height", legendBox)
          .attr("x", padding.right * 6)
          .attr("y", legendBox * (i - 11))
          .style("fill", COLORS[i][1])
          .style("stroke-width", 1)
          .style("stroke", "black");

        legend
          .append("text")
          .attr("class", "legend-item-text")
          .attr("width", legendBox)
          .attr("height", legendBox)
          .style("font-size", "1em")
          .attr("x", padding.right * 6 + legendBox * 2)
          .attr("y", legendBox * (i - 11) + legendBox / 1.25)
          .text(COLORS[i][0]);
      }
    }
  };

  return (
    <div id="treemap-container">
      <div id="treemap"></div>
    </div>
  );
}

export default App;
