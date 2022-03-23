import React from 'react';
import logo from '../../logo.svg';
import { Button } from 'antd';
import { DatePicker, Space } from 'antd';
import api from '../../utils/api';
import { config } from '../../config';
import useHook from './Hook';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export declare type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;
export declare type EventValue<DateType> = DateType | null;

function Home(): React.ReactElement {
  const { RangePicker, onChange, onOk } = useHook();

  React.useEffect(() => {
    api.get('https://random-data-api.com/api/restaurant/random_restaurant').then((res) => {
      console.log(res);
      return res;
    });

    api.get('').then((res) => {
      console.log(res);
      return res;
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Box width={300}>
          <Slider size="small" defaultValue={70} aria-label="Small" valueLabelDisplay="auto" />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
        </Box>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React + {config.Host}
        </a>
        <Space direction="vertical" size={12}>
          <DatePicker showTime onChange={onChange} onOk={onOk} />
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
          />
        </Space>
      </header>

      <Button type="primary">Button</Button>
    </div>
  );
}

export default Home;
