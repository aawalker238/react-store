import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Box } from 'gestalt';

const Loader = ({ show }) =>
  show && (
    <Box
      position="fixed"
      dangerouslySetInlineStyle={{
        __style: {
          bottom: 550,
          left: '50%',
          transform: 'translateX(-50%)'
        }
      }}
    >
      <PulseLoader color="#e3780c" size={30} margin="3px" />
    </Box>
  );

export default Loader;
