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
        <ul className="menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
              {React.cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick();
                  setMenuDropDownOpen(false);
                },
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
