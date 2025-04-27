import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const LeftDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const drawerWidth = 400; // Define drawer width as a constant

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Drawer
        title="Basic Drawer"
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
        width={drawerWidth}
        styles={{
          body: { padding: '8px 0' },
          wrapper: { position: 'relative' },
        }}
      >
        {/* Toggle Button positioned relative to drawer */}
        <Button
          type="primary"
          onClick={toggleDrawer}
          style={{
            position: 'absolute',
            right: '-30px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1001,
            backgroundColor: '#e2e2e2',
            borderRadius: '0 4px 4px 0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            padding: '0px',
            width: '30px',
            height: '60px',
          }}
        >
          {!open ? (
            <FaAngleRight className="text-gray-600" />
          ) : (
            <FaAngleLeft className="text-gray-600" />
          )}
        </Button>

        <div style={{ padding: '8px 0' }}>
          <p>Drawer Content Item 1</p>
          <p>Drawer Content Item 2</p>
          <p>Drawer Content Item 3</p>
        </div>
      </Drawer>
    </div>
  );
};

export default LeftDrawer;
