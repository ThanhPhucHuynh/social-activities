import React, { useEffect, useState } from 'react';
import { Table, Input, Form, message } from 'antd';
import Hook from './hook';
import { addDepartment, getDepartment } from '../../../services/department';
import { Box } from '@mui/material';
import { Button } from 'antd';
import prompt from '../../../components/Prompt';
import SectionA from '../Section';

const DepartmentA = () => {
  const { columns, data, setData } = Hook();
  const [isLoading, setIsLoading] = useState(false);
  const fetch = () => {
    setIsLoading(true);
    getDepartment()
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
                  </React.Fragment>
                ),
                onOk: (ref, value, close, error) => {
                  addDepartment({ name: value.name })
                    .then((res) => {
                      console.log(res);
                      message.info('Add completed');
                      fetch();
                      close();
                    })
                    .catch((err) => {
                      // error(err?.response?.data.message.toString());
                      message.error('Add failed!' + err.response.data.message);
                    });
                },
              });
            }}
          >
            Add Department
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
        <Table
          loading={isLoading}
          rowKey={(a) => a._id}
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: (record) => <SectionA idDPM={record._id} nameDPM={record.name} />,
            // <p style={{ margin: 0 }}>{record.name}</p>,
            rowExpandable: (record) => record.name !== 'Not Expandable',
          }}
        />
      </Box>
    </React.Fragment>
  );
};
export default DepartmentA;
