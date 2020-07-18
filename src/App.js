import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./frontend/css/main.css";
import * as d3 from "d3";

const GAME_DATA =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

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

        console.log(data);
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
  return (
    <div id="treemap-container">
      <div id="treemap"></div>
    </div>
  );
}

export default App;
