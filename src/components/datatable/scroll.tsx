import { useState, useRef, useEffect } from 'react';
import { Slider, TableContainer, Box } from '@mui/material';

const CustomScrollTableContainer = ({ children, width = '100%' }:any) => {
  const tableContainerRef: any = useRef(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  
  const handleScrollChange = (_: any, newValue: any) => {
    if (tableContainerRef.current) {
      const maxScroll = tableContainerRef.current.scrollWidth - tableContainerRef.current.clientWidth;
      tableContainerRef.current.scrollLeft = (newValue / 100) * maxScroll;
    }
  };
  
  const handleScroll = () => {
    if (tableContainerRef.current) {
      const maxScroll = tableContainerRef.current.scrollWidth - tableContainerRef.current.clientWidth;
      const currentScroll = tableContainerRef.current.scrollLeft;
      setScrollRatio((currentScroll / maxScroll) * 100);
    }
  };

  const checkOverflow = () => {
    if (tableContainerRef.current) {
      const hasOverflow = tableContainerRef.current.scrollWidth > tableContainerRef.current.clientWidth;
      setHasOverflow(hasOverflow);
    }
  };
  
  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      // Check overflow initially and on resize
      checkOverflow();
      const resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(container);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [children]); // Re-check when children change

  return (
    <Box sx={{ width: width, maxWidth: '100%' }}>
      <TableContainer
        ref={tableContainerRef}
        sx={{
          overflowX: "auto",
          borderRadius: "6px",
          border: "1px solid #ECECFC",
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          width: '100%',
        }}
      >
        {children}
      </TableContainer>
      
      {hasOverflow && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          px: 2,
        }}>
          <Slider
            value={scrollRatio}
            onChange={handleScrollChange}
            sx={{
              width: '20%',
              maxWidth: 'calc(100% - 32px)',
              mt: 1,
              color: '#DADADA',
              height: 8,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 25, 
                backgroundColor: '#1c252e',
                borderRadius: '1px',
                transform: 'translate(-6px, -12px)',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: 'none'
                },
                '&.Mui-active': {
                  boxShadow: 'none'
                }
              },
              '& .MuiSlider-track': {
                height: 6,
              },
              '& .MuiSlider-rail': {
                height: 8,
                opacity: 0.5,
                backgroundColor: '#ECECFC',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CustomScrollTableContainer;