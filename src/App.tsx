import React from 'react';
import './App.css';
import {Maze} from "./maze/Maze";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Maze maxX={10} maxY={10}/>
      </header>
    </div>
  );
}

export default App;
