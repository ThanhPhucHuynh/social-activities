import React, { useEffect, useState } from 'react';
import { Table, Input, Form, message } from 'antd';
import Hook from './hook';
import { getSection, getDepartment, addSection } from '../../../services/department';
import { Box } from '@mui/material';
import { Button } from 'antd';
import prompt from '../../../components/Prompt';

const SectionA = ({ idDPM, nameDPM }: { idDPM: string; nameDPM: string }) => {
  const { columns, data, setData } = Hook();
  const [isLoading, setIsLoading] = useState(false);
  const fetch = () => {
    setIsLoading(true);
    getSection({ idDPM: idDPM })
      .then((res) => {
        console.log(res.data.reverse());
        if (res.data) {
          setData(res.data.reverse());
        }
        return;
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <React.Fragment>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <Box>
          <Table
            pagination={false}
            loading={isLoading}
            rowKey={(a) => (a ? a._id : (Math.random() + 1).toString(36).substring(7))}
            columns={columns}
            dataSource={data}
          />
        </Box>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              prompt({
                title: 'Add section',
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
                  addSection({
                    name: value.name,
                    department_id: idDPM,
                    department_name: nameDPM,
                    _id: '',
                  })
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
            Add Section
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
      </Box>
    </React.Fragment>
  );
};
export default SectionA;
