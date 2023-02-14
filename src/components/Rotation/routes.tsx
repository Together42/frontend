import React from 'react';
import { RotateResult } from './RotationResult';
import { Route, Routes } from 'react-router';
import { RotationCalendar } from './RotationCalendar';
import { Rotate } from './Rotation';

function Rotation() {
  return (
    <Routes>
      <Route path="/" element={<Rotate />} />
      <Route path="/calendar" element={<RotationCalendar />} />
    </Routes>
  );
}

export default Rotation;
