import React from 'react';
import './App.css';
import {Maze} from "./maze/Maze";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Maze maxX={80} maxY={50}/>
      </header>
    </div>
  );
}

export default App;
