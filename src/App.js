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
  "#4cc9f0",
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

    const padding = {
      top: 0,
      right: 50,
      bottom: 0,
      left: 50,
    };

    const treePadding = 2;

    const dim = {
      width: 700 - padding.right - padding.left,
      height: 500 - padding.top - padding.bottom,
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
    treemap.size([dim.width, dim.height]).paddingOuter(treePadding);

    const root = d3.hierarchy(data);

    //console.log(data[1].children);
    root.sum((d) => {
      return d.value;
    });

    treemap(root);

    // SVG setup
    const svg = d3
      .select("#treemap")
      .append("svg")
      .attr("width", dim.width)
      .attr("height", dim.height);

    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
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
      .attr("data-value", (d) => d.data.value);
  };

  return (
    <div id="treemap-container">
      <div id="treemap"></div>
    </div>
  );
}

export default App;
