import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';

const DEFAULT_PIN = '0000';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('testElements');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [storedPin, setStoredPin] = useState(() => localStorage.getItem('appPin') || DEFAULT_PIN);
  const [changePinMsg, setChangePinMsg] = useState('');
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('testElements', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('appPin', storedPin);
  }, [storedPin]);

  const handleAdd = () => {
    const value = input.trim();
    if (value) {
      setItems(prev => [...prev, value]);
      setInput('');
    }
  };

  const handleRemove = (index) => setDeleteIndex(index);

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      setItems(prev => prev.filter((_, i) => i !== deleteIndex));
      if (editIndex === deleteIndex) {
        setEditIndex(null);
        setEditValue('');
      }
      setDeleteIndex(null);
    }
  };

  const cancelRemove = () => setDeleteIndex(null);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(items[index]);
  };

  const handleEditChange = (e) => setEditValue(e.target.value);

  const handleEditSave = (index) => {
    const value = editValue.trim();
    if (value) {
      setItems(prev => prev.map((item, i) => (i === index ? value : item)));
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter') handleEditSave(index);
    else if (e.key === 'Escape') {
      setEditIndex(null);
      setEditValue('');
    }
  };

  if (!authenticated) {
    return (
      <Auth
        storedPin={storedPin}
        setStoredPin={setStoredPin}
        setAuthenticated={setAuthenticated}
        changePinMsg={changePinMsg}
        setChangePinMsg={setChangePinMsg}
      />
    );
  }

  return (
    <div className="App">
      <h2>Secret</h2>
      <div className="add-row">
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
      <ul>
        {items.length === 0 && <li>No elements yet.</li>}
        {[...items].sort((a, b) => a.localeCompare(b)).map((item, idx) => {
          const origIndex = items.findIndex(i => i === item);
          return (
            <li key={idx} className="list-item">
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
                    disabled={editIndex !== null}
                  >✏️</button>
                  <button
                    onClick={() => handleRemove(origIndex)}
                    className="remove-btn"
                    title="Remove"
                    disabled={editIndex !== null}
                  >&#10006;</button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {/* Delete Confirmation Popup */}
      {deleteIndex !== null && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div style={{ marginBottom: 12 }}>Are you sure you want to delete this item?</div>
            <button onClick={confirmRemove} style={{ marginRight: 8 }}>Yes</button>
            <button onClick={cancelRemove}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
