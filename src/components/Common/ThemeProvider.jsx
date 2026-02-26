import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import '../../styles/theme.css';

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('campusHireTheme');
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campusHireTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="theme-provider">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {children}
    </div>
  );
}

export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>
  );
}

export function ThemeSettings() {
  const [theme, setTheme] = useState(localStorage.getItem('campusHireTheme') || 'light');
  const [customColors, setCustomColors] = useState(() => {
    const saved = localStorage.getItem('campusHireCustomColors');
    return saved ? JSON.parse(saved) : {
      primary: '#2563eb',
      secondary: '#1e40af',
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4'
    };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campusHireTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('campusHireCustomColors', JSON.stringify(customColors));
    Object.entries(customColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [customColors]);

  const handleColorChange = (color, value) => {
    setCustomColors(prev => ({ ...prev, [color]: value }));
  };

  return (
    <div className="theme-settings">
      <h3>Theme Settings</h3>

      <div className="settings-section">
        <h4>Theme Mode</h4>
        <div className="theme-options">
          <label>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <Sun size={20} />
            Light Mode
          </label>
          <label>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <Moon size={20} />
            Dark Mode
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h4>Custom Colors</h4>
        <div className="color-picker-group">
          {Object.entries(customColors).map(([color, value]) => (
            <div key={color} className="color-picker">
              <label>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(color, e.target.value)}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(color, e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h4>Preview</h4>
        <div className="preview-grid">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-success">Success Button</button>
          <button className="btn btn-danger">Danger Button</button>
          <button className="btn btn-warning">Warning Button</button>
        </div>
      </div>

      <div className="settings-section">
        <button
          className="btn btn-outline"
          onClick={() => {
            setTheme('light');
            setCustomColors({
              primary: '#2563eb',
              secondary: '#1e40af',
              success: '#10b981',
              danger: '#ef4444',
              warning: '#f59e0b',
              info: '#06b6d4'
            });
          }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
