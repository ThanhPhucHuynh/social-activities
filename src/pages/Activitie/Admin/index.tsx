import { Box } from '@mui/material';
import { Button, Form, Input, Table } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import prompt from '../../../components/Prompt';
import { IOfficer } from '../../../redux/types/authI';
import { getActivitiesAll } from '../../../services/activites';
import Hook from './hook';
const ActivitieAdmin = ({ officer }: { officer: IOfficer }) => {
  const { columns, data, setData } = Hook();
  const [isLoading, setIsLoading] = useState(false);
  const fetch = () => {
    setIsLoading(true);
    getActivitiesAll()
      .then((res) => {
        // setData(res.data.reverse());
        console.table(res.data.reverse());
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <div>
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
                  // addDepartment({ name: value.name })
                  //   .then((res) => {
                  //     console.log(res);
                  //     message.info('Add completed');
                  //     fetch();
                  //     close();
                  //   })
                  //   .catch((err) => {
                  //     // error(err?.response?.data.message.toString());
                  //     message.error('Add failed!' + err.response.data.message);
                  //   });
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
          // expandable={{
          //   // expandedRowRender: (record) => <SectionA idDPM={record._id} nameDPM={record.name} />,
          //   // <p style={{ margin: 0 }}>{record.name}</p>,
          //   rowExpandable: (record) => record.name !== 'Not Expandable',
          // }}
        />
      </Box>
    </div>
  );
};

export default ActivitieAdmin;
