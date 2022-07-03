import { Box } from '@mui/system';
import React from 'react';

const Explore = () => {
  return (
    <React.Fragment>
      Explore
      {/* <iframe style="background: #F1F5F4;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);"  ></iframe> */}
      <header className="App-header">
        <iframe
          style={{
            minHeight: '100vh',
            // "background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);"
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: ' 0 2px 10px 0 rgba(70, 76, 79, .2)',
          }}
          width="100%"
          src="https://charts.mongodb.com/charts-socaila-iuqhr/embed/dashboards?id=62516f65-ed04-4c9d-8a64-9548acdbd82d&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=scale"
        ></iframe>
      </header>
    </React.Fragment>
  );
};

export default Explore;
