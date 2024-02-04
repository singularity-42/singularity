
import Title from '@/components/base/Title';
import Table from '@/components/view/Table';
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
        In Future is this the place to change information about the <Title /> 
        will be made. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span>Soon you can change information about the</span>
          <Title />
        </div>

      </div>
      <Table type='change' />
    </>
  );
};

export default ChangePage;
