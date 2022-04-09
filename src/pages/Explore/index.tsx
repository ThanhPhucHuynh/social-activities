import React from 'react';

const Explore = () => {
  return (
    <React.Fragment>
      Explore
      <iframe
        style={{
          // "background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);"
          background: '#FFFFFF',
          border: 'none',
          borderRadius: '2px',
          boxShadow: ' 0 2px 10px 0 rgba(70, 76, 79, .2)',
        }}
        width="640"
        height="480"
        src="https://charts.mongodb.com/charts-socaila-iuqhr/embed/charts?id=625170d1-2438-49be-852e-0245e25a2bd5&maxDataAge=3600&theme=light&autoRefresh=true"
      ></iframe>
    </React.Fragment>
  );
};

export default Explore;
