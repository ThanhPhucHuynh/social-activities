import React from 'react';
import logo from '../../logo.svg';
import { Button } from 'antd';
import { DatePicker, Space } from 'antd';
import api from '../../utils/api';
import { config } from '../../config';
import useHook from './Hook';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import { Header } from '../../components';
import { IOfficer } from '../../redux/types/authI';

export declare type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;
export declare type EventValue<DateType> = DateType | null;

function Home({ officer }: { officer: IOfficer }): React.ReactElement {
  const { RangePicker, onChange, onOk, data, setData } = useHook();

  React.useEffect(() => {
    api.get('https://random-data-api.com/api/restaurant/random_restaurant').then((res) => {
      console.log(res);
      return res;
    });

    api.get('').then((res) => {
      console.log(res);
      setData(res.data);
      return res;
    });
  }, []);

  return (
    <div className="App">
      {/* <Header officer={officer} /> */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <Box width={300}>
          <Slider size="small" defaultValue={70} aria-label="Small" valueLabelDisplay="auto" />
          <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
        </Box> */}
        <div>
          <p>Social activities</p>
        </div>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React + {config.Host}
        </a> */}
        {/* <Space direction="vertical" size={12}>
          <DatePicker showTime onChange={onChange} onOk={onOk} />
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
          />
        </Space> */}
      </header>

      {/* <Button type="primary">Button</Button> */}
    </div>
  );
}

export default Home;
