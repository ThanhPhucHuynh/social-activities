/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Form, Input, Button, Checkbox, DatePicker, Select, message } from 'antd';
import { Box } from '@mui/material';
import useWindowDimensions from '../../../../config/constants';
import { CI, getCities } from '../../../../services/citys';
const config = {
  rules: [{ type: 'object' as const, required: true, message: 'Please select time!' }],
};
const { Option } = Select;

const Register = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [cities, setCitys] = React.useState<CI[]>([]);

  const { height } = useWindowDimensions();

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
  const onGenderChange = (value: string) => {
    // switch (value) {
    //   case 'male':
    //     this.formRef.current!.setFieldsValue({ note: 'Hi, man!' });
    //     return;
    //   case 'female':
    //     this.formRef.current!.setFieldsValue({ note: 'Hi, lady!' });
    //     return;
    //   case 'other':
    //     this.formRef.current!.setFieldsValue({ note: 'Hi there!' });
    // }
  };

  React.useEffect(() => {
    getCities()
      .then((res) => {
        setCitys(res.data);
      })
      .catch((err) => message.error("can't get cities"));
  }, []);

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
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select gender" onChange={onGenderChange} allowClear>
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Code ID"
            name="code"
            rules={[{ required: true, message: 'Please input your code ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Select placeholder="Select country" onChange={onGenderChange} allowClear>
              {cities.map((a, i) => {
                return (
                  <Option key={i} value={a.city}>
                    {a.city}
                  </Option>
                );
              })}
              {/* <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option> */}
            </Select>
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="DatePicker" {...config}>
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
