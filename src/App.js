import React from 'react';
import './App.css';
import SecurePage from './components/checklist';
import Navigation from './components/navigation';

function App() {
    return (
        <div className="App">
            <Navigation />
            <SecurePage />
        </div>
    );
}

export default App;