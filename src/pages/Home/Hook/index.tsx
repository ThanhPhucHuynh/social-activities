import { DatePicker } from 'antd';
import React from 'react';

export default function Hook() {
  const { RangePicker } = DatePicker;
  const [data, setData] = React.useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onChange(value: any, dateString: any) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onOk(value: any) {
    console.log('onOk: ', value);
  }

  return {
    RangePicker,
    onChange,
    onOk,
    data,
    setData,
  };
}
