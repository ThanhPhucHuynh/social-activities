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
import { Image, Form, Input, message, Select } from 'antd';
import { IOfficer } from '../../redux/types/authI';
import { clearAuth } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import prompt from '../Prompt';
import { getMe, OfficerI } from '../../services/officer';
import { CI, getCities } from '../../services/citys';
import UploadH from './upload';

const { Option } = Select;
const pages = {
  root: [
    {
      name: 'Department',
      path: '/root/department',
    },
    {
      name: 'Officer',
      path: '/root/officer',
    },
  ],
  admin: [
    {
      name: 'Activities',
      path: '/activities',
    },
    {
      name: 'Officer',
      path: '/officer',
    },
    {
      name: 'Report',
      path: '/report',
    },
    { name: 'Explore', path: '/explore' },
  ],
  officer: [
    {
      name: 'Activities',
      path: '/activities',
    },
  ],
};

const Header = ({ officer }: { officer: IOfficer }) => {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [record, setRecord] = React.useState<OfficerI | null>(null);
  const [cities, setCitys] = React.useState<CI[]>([]);
  const fetch = () => {
    getMe()
      .then((res) => {
        setRecord(res?.data);
        console.log(res.data);
      })
      .catch((e) => {
        message.error(e);
      });
  };

  React.useEffect(() => {
    fetch();
    getCities()
      .then((res) => {
        setCitys(res.data);
      })
      .catch(() => message.error("can't get cities"));
  }, []);

  const settingsA = [
    {
      Title: 'Profile',
      onPress: () => {
        handleCloseUserMenu();
        if (record) {
          prompt({
            title: record._id,
            renderItem: <UploadH cities={cities} officer={officer} record={record} />,
            onOk: (ref, value, close, finish, error) => {
              console.log(value);
              const u: OfficerI = {
                ...value,
                avatar: value.avatar.file.response.url,
                birthday: value.birthday.toISOString(),
              };
              console.log(u);
              // close();
              finish();
            },
            // renderError: () => {
            //   finish();
            // },
          });
        }
      },
    },
    {
      Title: 'Logout',
      onPress: () => {
        clearAuth();
        navigate('/', { replace: true });
        location.reload();
        setAnchorElUser(null);
      },
    },
  ];
  return (
    <AppBar position="sticky" style={{ background: 'white', zIndex: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Image
              width={100}
              onClick={() => navigate('/', { replace: true })}
              preview={!true}
              src={require('../../assets/images/logo.png')}
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages[officer.role].map((p: { name: string; path: string }) => (
                <MenuItem
                  key={p.name}
                  onClick={() => {
                    navigate(`${p.path}`);
                  }}
                >
                  <Typography textAlign="center" color={'black'}>
                    {p.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <Image width={100} src={require('../../assets/images/logo.png')} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages[officer.role].map((p: { name: string; path: string }) => (
              <MenuItem
                key={p.name}
                onClick={() => {
                  navigate(`${p.path}`);
                }}
              >
                <Typography textAlign="center" color={'black'}>
                  {p.name}
                </Typography>
              </MenuItem>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={officer?.name || 'Not login'}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={officer?.name || '?'} src={officer?.avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settingsA.map((setting) => (
                <MenuItem key={setting.Title} onClick={setting.onPress || handleCloseUserMenu}>
                  <Typography textAlign="center">{setting.Title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
