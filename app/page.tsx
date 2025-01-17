"use client";
import React from "react";
import Grid from "./components/grid";

const actors = [
  { id: "1", name: "Helena Bonham Carter" },
  { id: "2", name: "Brad Pitt" },
  { id: "3", name: "Edward Norton" },
  { id: "4", name: "Jared Leto" },
  { id: "5", name: "Timothee Chalamet" },
  { id: "6", name: "Oscar Issac" },
  { id: "7", name: "Josh Brolin" },
  { id: "8", name: "Jason Momoa" },
  { id: "9", name: "Michael Cera" },
  { id: "10", name: "Kieran Culkin" },
  { id: "11", name: "Anna Kendrick" },
  { id: "12", name: "Chris Evans" },
  { id: "13", name: "John Travolta" },
  { id: "14", name: "Uma Thurman" },
  { id: "15", name: "Samuel L. Jackson" },
  { id: "16", name: "Bruce Willis" },
];

const App = () => {
  return (
    <div className="app-container bg-background min-h-screen h-full w-full">
      <h1 className="text-center text-3xl font-bold text-white mb-4 pt-4">
        StarLinks
      </h1>
      <h2 className="text-center text-xl font-bold text-white mb-4">
        Create four groups of four!
      </h2>
      <Grid actors={actors} gridSize={4} />
    </div>
  );
};

export default App;
