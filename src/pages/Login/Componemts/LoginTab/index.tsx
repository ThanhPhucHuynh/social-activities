import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { Box } from '@mui/material';
import useWindowDimensions from '../../../../config/constants';

import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginRequest } from '../../../../redux/actions';
import { RootState } from '../../../../redux/reducers/rootReducer';

const LoginTab = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const { pending, officer, error } = useSelector((state: RootState) => state.auth);

  const { height, width } = useWindowDimensions();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    handleLogin(values.email, values.password);
  };

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    dispatch(fetchLoginRequest({ email: email, password: password }));
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // return <React.Fragment></React.Fragment>;
  return (
    <React.Fragment>
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
              Login + {officer?.email}
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

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button loading={pending} type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Box>
      </Box>
    </React.Fragment>
  );
};
export default LoginTab;
