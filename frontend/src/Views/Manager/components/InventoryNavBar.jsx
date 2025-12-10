// components/InventoryNavBar.jsx
import React from 'react';
import '../css/InventoryNavBar.css';

function InventoryNavbar({ setCurrentPage }) {
  const [activeTab, setActiveTab] = React.useState('all');

  const handleTabClick = (page) => {
    setActiveTab(page);
    setCurrentPage(page);
  };

  return (
    <nav className="inventory-navbar">
      <button
        className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`}
        onClick={() => handleTabClick('all')}
      >
        All
      </button>
      <button
        className={`nav-tab ${activeTab === 'menu' ? 'active' : ''}`}
        onClick={() => handleTabClick('menu')}
      >
        Menu
      </button>
      <button
        className={`nav-tab ${activeTab === 'ingredients' ? 'active' : ''}`}
        onClick={() => handleTabClick('ingredients')}
      >
        Ingredients
      </button>
      <button
        className={`nav-tab ${activeTab === 'other' ? 'active' : ''}`}
        onClick={() => handleTabClick('other')}
      >
        Other
      </button>
    </nav>
  );
}

export default InventoryNavbar;