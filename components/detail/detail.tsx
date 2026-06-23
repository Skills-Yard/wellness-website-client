"use client"

import React, { useState } from 'react';
import SubDetailPopUp from './subdetail/mainfile';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minHeight: '200px',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: 'red',
  fontSize: '16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
};

export default function ButtonPop() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={containerStyle}>
        <button onClick={() => setOpen(true)} style={buttonStyle}>
          Open Subdetail Popup
        </button>
      </div>

      {open && <SubDetailPopUp onClose={() => setOpen(false)} />}
    </>
  );
}
