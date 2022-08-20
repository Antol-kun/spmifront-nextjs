import React from "react";

export default function App() {
  const current = new Date();
  const date = `${current.getDate()}-${
    current.getMonth() + 1
  }-${current.getFullYear()}`;
  return (
    <div className="App">
      <h8>{date}</h8>{" "}
    </div>
  );
}
