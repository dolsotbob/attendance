import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Wallet from './pages/Wallet';
import Question from './pages/Question';
import './App.css';

function App() {
  const [address, setAddress] = useState<string | null>(
    sessionStorage.getItem('address') || null
  );
  const [balance, setBalance] = useState<string | null>(null);

  return (
    <Router basename="attendance">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/wallet" replace />}></Route>
          <Route path="/main" element={<Main></Main>}></Route>
          <Route path="/wallet" element={
            <Wallet
              address={address}
              setAddress={setAddress}
              balance={balance}
              setBalance={setBalance}
            ></Wallet>}>
          </Route>
          <Route path="/question" element={
            <Question
              address={address}
              balance={balance}
              setBalance={setBalance}
            ></Question>}></Route>
        </Routes>
      </main>
    </Router>
  )
}

export default App;
