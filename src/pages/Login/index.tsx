import React from 'react';
import { Grid, Paper, Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TabPanel } from '../../components/index';
import Background from '../../assets/images/login.jpg';
import Lottie from 'react-lottie';
import * as animationRegister from '../../assets/lottie/21630-registrar.json';
import * as animationData from '../../assets/lottie/83168-login-success.json';

const GridXX = styled(Grid)(({ theme }: any) => ({
  '@keyframes pulsate': {
    '0%': {
      backgroundPosition: '0% 0%',
    },
    '25%': {
      backgroundPosition: '40% 10%',
    },
    '50%': {
      backgroundPosition: '0% 10%',
    },
    '75%': {
      backgroundPosition: '10% 40%',
    },
    '100%': {
      backgroundPosition: '0% 0%',
    },
  },
  animation: 'pulsate 30s infinite',
  backgroundImage: `url(${Background})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  borderBottomRightRadius: 10,
  borderTopRightRadius: 10,
  ...theme.typography.body2,
}));

const Item = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '100vh',
  color: theme.palette.text.secondary,
}));
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const LoginPage = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%', flexGrow: 1 }}>
      <Grid container alignItems="center" justifyContent="center">
        <GridXX item xs={6}>
          <Item style={{ padding: '10%', backgroundColor: 'transparent' }}>
            <Box>
              <p
                style={{
                  fontSize: '22px',
                  textTransform: 'uppercase',
                  fontWeight: 'bolder',
                }}
              >
                Social Activities Manager
              </p>
            </Box>
          </Item>
        </GridXX>
        <Grid item xs={6}>
          <Item>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab
                    icon={
                      <Lottie
                        options={{
                          animationData,
                        }}
                        style={{
                          width: `40px`,
                          height: `40px`,
                        }}
                      />
                    }
                    iconPosition="start"
                    label="Login"
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Register"
                    icon={
                      <Lottie
                        options={{
                          animationData: animationRegister,
                        }}
                        style={{
                          width: `40px`,
                          height: `40px`,
                        }}
                      />
                    }
                    iconPosition="start"
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <>Login</>
              </TabPanel>
              <TabPanel value={value} index={1}>
                Item Two
              </TabPanel>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};
