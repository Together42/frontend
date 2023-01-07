import React, { useState, useEffect, useRef } from 'react';
import './Dropdown.css';

export const Dropdown = ({ trigger, menu }) => {
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);

  const handleOpen = () => {
    setMenuDropDownOpen(!isMenuDropDownOpen);
  };

  const handleClose = () => {
    if (isMenuDropDownOpen) {
      setMenuDropDownOpen(false);
    }
  };

  return (
    <div className="dropdown">
      {React.cloneElement(trigger, {
        onClick: handleOpen,
      })}
      {isMenuDropDownOpen ? (
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
      ) : null}
    </div>
  );
};
