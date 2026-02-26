import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../styles/sidebar.css';

export default function Sidebar({ items, isOpen, onItemClick }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        {items.map(item => (
          <div key={item.id} className="sidebar-item-wrapper">
            <button
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              onClick={() => {
                if (item.submenu) {
                  toggleExpand(item.id);
                } else {
                  onItemClick(item);
                }
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.submenu && (
                <ChevronDown 
                  size={16} 
                  className={`sidebar-chevron ${expandedItems[item.id] ? 'expanded' : ''}`}
                />
              )}
            </button>

            {item.submenu && expandedItems[item.id] && (
              <div className="sidebar-submenu">
                {item.submenu.map(subitem => (
                  <button
                    key={subitem.id}
                    className="sidebar-subitem"
                    onClick={() => onItemClick(subitem)}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
