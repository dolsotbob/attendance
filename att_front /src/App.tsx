import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Main from './pages/Main';
import Wallet from './pages/Wallet';
import Question from './pages/Question';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/wallet" element={<Wallet></Wallet>}></Route>
          <Route path="/question" element={<Question></Question>}></Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App;
