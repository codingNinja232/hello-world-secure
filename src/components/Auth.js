import React, { useState } from 'react';

const DEFAULT_PIN = '0000';
const MAX_ATTEMPTS = 3;

export default function Auth({
  storedPin,
  setStoredPin,
  setAuthenticated,
  changePinMsg,
  setChangePinMsg,
}) {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            color: '#61dafb',
            fontSize: '1em',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          title="Change PIN"
          onClick={() => setShowChangePin(!showChangePin)}
        >
          Change PIN
        </button>
      </div>
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