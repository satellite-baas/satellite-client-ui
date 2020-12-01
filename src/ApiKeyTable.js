import React, { useState } from 'react';
import AddApiKeyButton from './AddApiKeyButton';

import './ApiKeyTable.css';

const ApiKeyTable = ({ keys, deleteKey, addKey }) => {
  const [shownKey, setShownKey] = useState(null);
  const [showDelete, setShowDelete ] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);

  const handleCopyKey = (id) => {
    const key = keys.filter(key => key.id === id)[0];

    navigator.clipboard.writeText(key.key).then(() => {
      return true;
    }, () => {
      return null;
    });
  };

  const handleDelete = () => {
    setShowDelete(false);
    deleteKey(keyToDelete);
  };

  const handleOpenModal = (id) => {
    if (keys.length === 1) return null;

    setShowDelete(true);
    setKeyToDelete(id)
  };

  const handleCloseModal = (e) => {
    setShowDelete(false);
  };

  return (
    <div className="box" style={{ padding: "2rem" }}>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Key</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.map(function(key, i) {
            return (
              <tr key={i}>
                <td
                  id={key.id}
                  onClick={() => handleCopyKey(key.id)}
                >
                  { key.admin ? "*".repeat(key.key.length) : key.key }
                </td>
                <td>{key.admin ? "Admin" : "Client"}</td>
                <td>
                  <span 
                    className="icon toggle" 
                    onClick={() => handleCopyKey(key.id)}
                  >
                    <i className="fas fa-copy"></i>
                  </span> 
                  |
                  <span 
                    className="icon delete-backend"
                    onClick={() => handleOpenModal(key.id)}
                  >
                    <i 
                      className="fas fa-trash-alt"
                    ></i>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AddApiKeyButton addKey={addKey} />
    </div>
  );
};

export default ApiKeyTable;