import React, { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_PIN = '0000';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('testElements');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('testElements', JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (input.trim() !== '') {
      setItems([...items, input.trim()]);
      setInput('');
    }
  };

  const handlePinSubmit = () => {
    if (pin === DEFAULT_PIN) {
      setAuthenticated(true);
      setPinError('');
      setPin('');
    } else {
      setPinError('Incorrect PIN. Try again.');
    }
  };

  if (!authenticated) {
    return (
      <div className="App">
        <h2>Enter PIN to Access</h2>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="Enter PIN"
          maxLength={4}
          onKeyDown={e => {
            if (e.key === 'Enter') handlePinSubmit();
          }}
        />
        <button onClick={handlePinSubmit}>Submit</button>
        {pinError && <p style={{ color: 'red' }}>{pinError}</p>}
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Test Elements List</h1>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add new test element"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {items.length === 0 && <li>No elements yet.</li>}
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
