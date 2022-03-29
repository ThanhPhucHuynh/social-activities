import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Image } from 'antd';
import { IOfficer } from '../../redux/types/authI';
import { clearAuth } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const pagesAdmin = ['Activities', 'Officer', 'Report', 'Explore'];
const pagesOfficer = ['Activities'];

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
  const settingsA = [
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
    <AppBar position="sticky" style={{ background: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="image"
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
              {(officer.role === 'admin' ? pagesAdmin : pagesOfficer).map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    navigate(`/${page.toLowerCase()}`);
                  }}
                >
                  <Typography textAlign="center" color={'black'}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="image"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <Image width={100} src={require('../../assets/images/logo.png')} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {(officer.role === 'admin' ? pagesAdmin : pagesOfficer).map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page.toLowerCase()}`)}
                sx={{ my: 2, display: 'block' }}
                color="secondary"
              >
                {page}
              </Button>
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
