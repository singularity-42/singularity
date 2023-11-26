
import Brand from '@/components/content/Title';
import Table from '@/components/layout/Table';
import React from 'react';

const ChangePage: React.FC = () => {
  return (
    <>
      <div style={
        // info block 
        {
          position: 'absolute',
          display: 'flex',
          fontSize: '18px',
          top: '33%',
          padding: '50px',
          gap: '20px',
          color: '#ccc',
        
        }
      }
      >
{/*         
        In Future is this the place to change information about the <Brand /> 
        will be made. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span>Change information about the</span>
          <Brand />
        </div>

      </div>
      <Table type='change' />
    </>
  );
};

export default ChangePage;
