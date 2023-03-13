import React, { useState, useEffect, useRef } from 'react';
import '@css/utils//Dropdown.scss';

export const Dropdown = ({ title, menu }) => {
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);

  const handleOpen = () => {
    setMenuDropDownOpen(true);
  };

  const handleClose = () => {
    setMenuDropDownOpen(false);
  };

  return (
    <div className="dropdown" onMouseOver={handleOpen} onMouseLeave={handleClose}>
      {title}
      {isMenuDropDownOpen && (
        <div className="menu">
          {menu.map((menuItem, index) => (
            <div key={`dropdown ${index}`}>
              {React.cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick();
                  setMenuDropDownOpen(false);
                },
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
