import { Box } from '@mui/material';
import { Button, Form, Input, Table, DatePicker, message, Select } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import prompt from '../../../components/Prompt';
import { IOfficer } from '../../../redux/types/authI';
import { ActivitiesI, getActivitiesAll, postActivities } from '../../../services/activites';
import { getDepartment, getSection, SectionI } from '../../../services/department';
import { DepartmentI } from '../../../services/officer';
import Hook from './hook';
import RenderItem from './renderItem';
const { RangePicker } = DatePicker;
const { Option } = Select;
const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
};
const ActivitiesOfficer = ({ officer }: { officer: IOfficer }) => {
  const { columns, data, setData, fetch, isLoading, setIsLoading } = Hook();
  const [form] = Form.useForm();

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
                renderItem: <RenderItem />,
                formProps: {
                  form: form,
                  onValuesChange: (changedValues: any, values: any) => {
                    if (changedValues.department) {
                      form.setFieldsValue({ section: undefined });
                    }
                  },
                },
                onOk: (ref, value, close, finish, error) => {
                  const sec: SectionI = JSON.parse(value.section);
                  const date: string[] = value.Date.map((D: Date) => D.toISOString());
                  const act: ActivitiesI = {
                    name: value.name,
                    description: value.description,
                    location: value.location,
                    section_id: sec._id,
                    section_name: sec.name,
                    picture: [],
                    _id: '',
                    date: date,
                  };
                  postActivities(act)
                    .then((res) => {
                      finish();
                      fetch();
                      message.info('ADD complete!');
                    })
                    .catch(() => message.error('failed!!'))
                    .finally(() => close());
                },
              });
            }}
          >
            Request new activities
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
        <Table loading={isLoading} rowKey={(a) => a?._id} columns={columns} dataSource={data} />
      </Box>
    </div>
  );
};

export default ActivitiesOfficer;
