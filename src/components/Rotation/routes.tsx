import React from 'react';
import { Rotate } from './Rotation';
import { RotateResult } from './RotationResult';
import { Route, Routes } from 'react-router';
import RotationCalendar from './Calendar';

import { NewRotate } from './new';

function Rotation() {
  return (
    <Routes>
      <Route path="/" element={<NewRotate />} />
      <Route path="/result" element={<RotateResult />} />
      <Route path="/calendar" element={<RotationCalendar />} />
    </Routes>
  );
}

export default Rotation;
