import React, { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_PIN = '0000';
const MAX_ATTEMPTS = 3;

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('testElements');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Password management
  const [storedPin, setStoredPin] = useState(() => {
    return localStorage.getItem('appPin') || DEFAULT_PIN;
  });
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changePinMsg, setChangePinMsg] = useState('');
  

  useEffect(() => {
    localStorage.setItem('testElements', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('appPin', storedPin);
  }, [storedPin]);

  const handleAdd = () => {
    if (input.trim() !== '') {
      setItems([...items, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    if (editIndex === index) {
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(items[index]);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = (index) => {
    if (editValue.trim() !== '') {
      const newItems = [...items];
      newItems[index] = editValue.trim();
      setItems(newItems);
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleEditSave(index);
    } else if (e.key === 'Escape') {
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handlePinSubmit = () => {
    if (pin === storedPin) {
      setAuthenticated(true);
      setPinError('');
      setPin('');
      setAttempts(0);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        setPinError('You have reached the maximum number of attempts. Access denied.');
      } else if (newAttempts === MAX_ATTEMPTS - 1) {
        setPinError('This is your last attempt!');
      } else {
        setPinError('Incorrect PIN. Try again.');
      }
    }
    setPin('');
  };

  // Change password logic
  const handleChangePin = () => {
    setChangePinMsg('');
    if (oldPin !== storedPin) {
      setChangePinMsg('Old PIN is incorrect.');
      return;
    }
    if (newPin.length !== 4 || isNaN(newPin)) {
      setChangePinMsg('New PIN must be a 4-digit number.');
      return;
    }
    if (newPin !== confirmPin) {
      setChangePinMsg('New PIN and confirm PIN do not match.');
      return;
    }
    setStoredPin(newPin);
    setShowChangePin(false);
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setChangePinMsg('PIN changed successfully!');
    setTimeout(() => setChangePinMsg(''), 2000);
  };

  

  if (!authenticated) {
    const isLocked = attempts >= MAX_ATTEMPTS;
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
            if (e.key === 'Enter' && !isLocked) handlePinSubmit();
          }}
          disabled={isLocked}
        />
        <button onClick={handlePinSubmit} disabled={isLocked}>Submit</button>
        {pinError && <p style={{ color: 'red' }}>{pinError}</p>}
        
        
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Secret List</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new secret"
          onKeyDown={e => {
            if (e.key === 'Enter') handleAdd();
          }}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {!showChangePin && (
        <ul>
          {items.length === 0 && <li>No elements yet.</li>}
          {[...items].sort((a, b) => a.localeCompare(b)).map((item, idx) => {
            const origIndex = items.findIndex(i => i === item);
            return (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  position: 'relative'
                }}
                className="list-item"
              >
                {editIndex === origIndex ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={handleEditChange}
                      onKeyDown={e => handleEditKeyDown(e, origIndex)}
                      className="edit-input"
                      autoFocus
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <button
                      onClick={() => handleEditSave(origIndex)}
                      className="save-btn"
                      title="Save"
                    >✔️</button>
                    <button
                      onClick={() => {
                        setEditIndex(null);
                        setEditValue('');
                      }}
                      className="cancel-btn"
                      title="Cancel"
                    >✖️</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1 }}>{item}</span>
                    <button
                      onClick={() => handleEdit(origIndex)}
                      className="edit-btn"
                      title="Edit"
                    >✏️</button>
                    <button
                      onClick={() => handleRemove(origIndex)}
                      className="remove-btn"
                      title="Remove"
                    >&#10006;</button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <button
        style={{ marginTop: 24, fontSize: '0.95em' }}
        onClick={() => setShowChangePin(!showChangePin)}
      >
        Change PIN
      </button>
      {showChangePin && (
        <div
          className="change-pin"
          style={{
            background: '#23262f',
            borderRadius: 8,
            padding: 16,
            marginTop: 16,
            minWidth: 260
          }}
        >
          <h3 style={{ marginTop: 0 }}>Change PIN</h3>
          <input
            type="password"
            value={oldPin}
            onChange={e => setOldPin(e.target.value)}
            placeholder="Old PIN"
            maxLength={4}
            style={{ marginBottom: 8 }}
          />
          <input
            type="password"
            value={newPin}
            onChange={e => setNewPin(e.target.value)}
            placeholder="New PIN"
            maxLength={4}
            style={{ marginBottom: 8 }}
          />
          <input
            type="password"
            value={confirmPin}
            onChange={e => setConfirmPin(e.target.value)}
            placeholder="Confirm New PIN"
            maxLength={4}
            style={{ marginBottom: 8 }}
          />
          <div>
            <button onClick={handleChangePin}>Save</button>
            <button onClick={() => setShowChangePin(false)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
          {changePinMsg && <p style={{ color: changePinMsg.includes('success') ? 'lightgreen' : 'red' }}>{changePinMsg}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
