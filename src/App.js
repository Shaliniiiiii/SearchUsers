import React from "react";
import SearchNames from "./SearchNames";
import "./App.css";
import names from "./names";

export default function App() {
  return (
    <div className="App">
      <SearchNames
        isSearchable
        isMulti
        placeHolder="Select"
        options={names}
        onChange={(value) => console.log(value)}
      />
    </div>
  );
}
