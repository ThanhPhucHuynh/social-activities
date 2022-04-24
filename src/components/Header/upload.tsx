import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Tooltip,
  MenuItem,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Image, Form, Input, message, Select, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IOfficer } from '../../redux/types/authI';
import { clearAuth } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import prompt from '../Prompt';
import { DelMedia, getMe, OfficerI } from '../../services/officer';
import moment from 'moment';
import { CI, getCities } from '../../services/citys';
const { Option } = Select;
const config = {
  rules: [{ type: 'object' as const, message: 'Please select time!' }],
};

const UploadH = ({
  officer,
  record,
  cities,
}: {
  officer: IOfficer;
  record: OfficerI;
  cities: CI[];
}) => {
  const [avatarURL, setAvatarURL] = React.useState<string>('');

  const props = {
    name: 'files',
    action: 'https://gosv.herokuapp.com/media',
    headers: {
      authorization: `Bearer ${officer.token}`,
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (avatarURL) {
          const u = avatarURL.split('/');
          const uu = u[u.length - 1].split('.')[0];
          console.log(uu);
          DelMedia(uu).then((res) => {
            //
          });
        }
        if (officer.avatar) {
          const i = officer.avatar.split('/');
          const ii = i[i.length - 1].split('.')[0];
          console.log(ii);
          DelMedia(ii).then((res) => {
            //
          });
        }
        setAvatarURL(info.file.response.url);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <React.Fragment>
      <Form.Item
        label="Avatar"
        name="avatar"
        // rules={[{ message: 'Please input dpm' }]}
      >
        <Upload
          maxCount={1}
          accept={'.jpg,.png,.jpeg'}
          listType={'picture'}
          multiple={false}
          {...props}
        >
          <Box display={'flex'}>
            <Avatar src={avatarURL ? avatarURL : record.avatar} />
            <Button style={{ marginLeft: 20 }} icon={<UploadOutlined />}>
              Click to Upload
            </Button>
          </Box>
        </Upload>
      </Form.Item>
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
        name="gender"
        initialValue={record.gender}
        label="Gender"
        rules={[{ required: true }]}
      >
        <Select placeholder="Select gender" allowClear>
          <Option value="male">male</Option>
          <Option value="female">female</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        initialValue={record.country}
        name="country"
        label="Country"
        rules={[{ required: true }]}
      >
        <Select placeholder="Select country" allowClear>
          {cities.map((a, i) => {
            return (
              <Option key={i} value={a.city}>
                {a.city}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name="birthday"
        label="birthday"
        initialValue={moment(record.birthday, 'YYYY-MM-DD HH:mm')}
        {...config}
      >
        <DatePicker format={'DD/MM/YYYY'} />
      </Form.Item>
      <Form.Item
        label="phone"
        name="phone"
        initialValue={record.phone}
        rules={[{ required: true, message: 'Please input dpm' }]}
      >
        <Input />
      </Form.Item>
    </React.Fragment>
  );
};
export default UploadH;
