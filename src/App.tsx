import React from 'react';
import logo from './logo.svg';
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import './App.css';

const preferredLanguage = navigator.language.split('-')[0];
console.log(preferredLanguage)

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
        <Hero></Hero>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
