import React from 'react';
import './Toggle.css';

const Toggle = ({ label, checked, onChange, name }) => {
  return (
    <div className="toggle-container">
      <label className="toggle-label" htmlFor={name}>
        {label}
      </label>
      <div className="toggle-switch">
        <input 
          type="checkbox" 
          id={name}
          name={name}
          checked={checked} 
          onChange={(e) => onChange(name, e.target.checked)} 
          className="toggle-checkbox"
        />
        <label className="toggle-slider" htmlFor={name}></label>
      </div>
    </div>
  );
};

export default Toggle;
