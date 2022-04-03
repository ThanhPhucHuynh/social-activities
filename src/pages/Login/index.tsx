import React from 'react';
import { Grid, Box, Tabs, Tab } from '@mui/material';
import { TabPanel } from '../../components/index';
import Lottie from 'react-lottie';
import * as animationRegister from '../../assets/lottie/21630-registrar.json';
import * as animationData from '../../assets/lottie/83168-login-success.json';
import stylesS, { GridS, Item, a11yProps } from './styles';

import { LoginTab, RegisterTab } from './Componemts';

export const LoginPage = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%', flexGrow: 1, height: '100%' }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} style={{ flex: 1 }}>
        <GridS item xs={8} alignItems="center" justifyContent="center">
          <Item style={{ padding: '10%', backgroundColor: 'transparent' }}>
            <Box>
              <span style={stylesS.TextHeadersS}>Social Activities Manager</span>
            </Box>
          </Item>
        </GridS>
        <Grid item xs={4} style={{ flex: 1 }}>
          <Item style={{ height: '100%' }}>
            <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab
                  icon={
                    <Lottie
                      options={{
                        animationData,
                      }}
                      style={stylesS.Lotte}
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
                      style={stylesS.Lotte}
                    />
                  }
                  iconPosition="start"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <Box style={{ height: '90%' }}>
              <TabPanel value={value} index={0}>
                <LoginTab />
              </TabPanel>
              {/* <TabPanel value={value} index={1}>
                <RegisterTab />
              </TabPanel> */}
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};
