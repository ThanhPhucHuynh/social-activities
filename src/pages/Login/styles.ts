import { styled } from '@mui/material/styles';
import { Grid, Paper, GridProps, PaperProps } from '@mui/material';
import Background from '../../assets/images/login.jpg';

type I = { [key in 'TextHeadersS' | 'Lotte']: React.CSSProperties | undefined };

const styleS: I = {
  TextHeadersS: {
    fontSize: '22px',
    textTransform: 'uppercase',
    fontWeight: 'bolder',
  },
  Lotte: {
    width: `40px`,
    height: `40px`,
  },
};

const GridS = styled(Grid)<GridProps>(({ theme }) => ({
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

const Item = styled(Paper)<PaperProps>(({ theme }) => ({
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

export default styleS;

export { GridS, a11yProps, Item };
