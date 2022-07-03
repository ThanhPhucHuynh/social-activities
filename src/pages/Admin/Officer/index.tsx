import React, { useEffect, useState } from 'react';
import { Table, Input, Form, Select, message } from 'antd';
import Hook from './hook';
import { AddOfficer, getOfficers } from '../../../services/officer';
import { Box } from '@mui/material';
import { Button } from 'antd';
import prompt from '../../../components/Prompt';
const { Option } = Select;
const OfficerA = () => {
  const { columns, data, setData } = Hook();
  const [isLoading, setIsLoading] = useState(false);
  const fetch = () => {
    setIsLoading(true);
    getOfficers()
      .then((res) => {
        setData(res.data.reverse());
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <React.Fragment>
      DepartmentA
      <Box>
        <Box display={'flex'}>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              prompt({
                title: 'Text',
                renderItem: (
                  <React.Fragment>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[{ required: true, message: 'Please input dpm' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, message: 'Please input email' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Code"
                      name="code"
                      rules={[{ required: true, message: 'Please input email' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="role"
                      name="role"
                      initialValue={'officer'}
                      rules={[{ required: true, message: 'Please input email' }]}
                    >
                      <Select>
                        {['root', 'admin', 'officer'].map((e) => {
                          return (
                            <Option key={e} value={e} label={e}>
                              {e}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </React.Fragment>
                ),
                onOk: (ref, value, close, finish, error) => {
                  console.log(value);
                  AddOfficer({ ...value })
                    .then((res) => {
                      message.info('Add completed');
                      fetch();
                      close();
                    })
                    .catch((err) => {
                      message.error('Add failed!' + err.response.data.message);
                      finish();
                    });
                },
              });
            }}
          >
            Add
          </Button>
          <Button
            type="primary"
            style={{
              display: 'flex',
            }}
            onClick={() => {
              fetch();
            }}
          >
            Reload
          </Button>
        </Box>
        <Table loading={isLoading} rowKey={(a) => a._id} columns={columns} dataSource={data} />
      </Box>
    </React.Fragment>
  );
};
export default OfficerA;
