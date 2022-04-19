import React from 'react';
import './App.css';
import { Game } from './components/Game';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Game maxX={20} maxY={15} />
            </header>
        </div>
    );
}

export default App;
