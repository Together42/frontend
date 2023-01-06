import React from 'react';
import { Rotate } from './Rotation';
import { RotateResult } from './RotationResult';
import { Route, Routes } from 'react-router';

function Rotation() {
  return (
    <Routes>
      <Route path="/" element={<Rotate />} />
      <Route path="/result" element={<RotateResult />} />
    </Routes>
  );
}

export default Rotation;
