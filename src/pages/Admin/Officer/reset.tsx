import { Popconfirm, message, Input, Form, Tag, Space, Tooltip, Avatar, Button } from 'antd';
import React from 'react';
import prompt from '../../../components/Prompt';
import { OfficerI, resetPW } from '../../../services/officer';

const Reset = ({ record }: { record: OfficerI }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Space size="middle">
      <Popconfirm
        placement="topRight"
        title={'confirm reset password'}
        onConfirm={() => {
          setIsLoading(true);
          resetPW(record.email)
            .then(() => {
              message.success('reset pw completed!');
            })
            .catch(() => {
              message.error('reset pw failed');
            })
            .finally(() => setIsLoading(false));
        }}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="primary"
          style={{
            display: 'flex',
          }}
          loading={isLoading}
        >
          {isLoading ? 'processing...' : 'Reset password'}
        </Button>
      </Popconfirm>
      <Button
        style={{
          display: 'flex',
        }}
        onClick={() => {
          prompt({
            title: record._id,
            renderItem: (
              <React.Fragment>
                <Form.Item
                  label="Name"
                  name="name"
                  initialValue={record.name}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="email"
                  name="email"
                  initialValue={record.email}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="gender"
                  name="gender"
                  initialValue={record.gender}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Birthday"
                  name="Birthday"
                  initialValue={record.birthday}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="country"
                  name="country"
                  initialValue={record.country}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="phone"
                  name="phone"
                  initialValue={record.phone}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="created_at"
                  name="created_at"
                  initialValue={record.created_at}
                  rules={[{ required: true, message: 'Please input dpm' }]}
                >
                  <Input disabled />
                </Form.Item>
              </React.Fragment>
            ),
            onOk: (ref, value, close, error) => {
              close();
            },
          });
        }}
      >
        Detail
      </Button>
    </Space>
  );
};

export default Reset;
