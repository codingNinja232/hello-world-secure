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

  // Password management
  const [storedPin, setStoredPin] = useState(() => {
    return localStorage.getItem('appPin') || DEFAULT_PIN;
  });
  const [changePinMsg, setChangePinMsg] = useState('');

  // Delete confirmation
  const [deleteIndex, setDeleteIndex] = useState(null);

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
    setDeleteIndex(index);
  };

  const confirmRemove = () => {
    if (deleteIndex !== null) {
      const newItems = [...items];
      newItems.splice(deleteIndex, 1);
      setItems(newItems);
      if (editIndex === deleteIndex) {
        setEditIndex(null);
        setEditValue('');
      }
      setDeleteIndex(null);
    }
  };

  const cancelRemove = () => {
    setDeleteIndex(null);
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
              {/* Delete confirmation dialog */}
              {deleteIndex === origIndex && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#23262f',
                    color: '#fff',
                    border: '1px solid #353945',
                    borderRadius: 8,
                    padding: 16,
                    zIndex: 10,
                    minWidth: 200,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  <div style={{ marginBottom: 12 }}>Are you sure you want to delete this item?</div>
                  <button onClick={confirmRemove} style={{ marginRight: 8 }}>Yes</button>
                  <button onClick={cancelRemove}>No</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
