import React from 'react';
import { Form, Input, Button, Checkbox, DatePicker } from 'antd';
import { Box } from '@mui/material';
import useWindowDimensions from '../../../../config/constants';
const config = {
  rules: [{ type: 'object' as const, required: true, message: 'Please select time!' }],
};
const Register = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { height, width } = useWindowDimensions();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    handleLogin();
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Box height={height * 0.8} style={{ padding: 0 }}>
      <Box
        display="flex"
        flexDirection={'column'}
        justifyContent="center"
        alignItems="center"
        height={'100%'}
      >
        <Box style={{ width: '100%' }}>
          <p
            style={{
              margin: '20%',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              fontSize: 'xx-large',
            }}
          >
            Register
          </p>
        </Box>
        <Form
          labelAlign="left"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="date-picker" label="DatePicker" {...config}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Box>
  );
};
export default Register;
