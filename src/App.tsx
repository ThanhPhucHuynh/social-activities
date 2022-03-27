import React from 'react';
import './App.less';
import '@fontsource/roboto/300.css';
import { RouterNavigation } from './routes';
export declare type RangeValue<DateType> = [EventValue<DateType>, EventValue<DateType>] | null;
export declare type EventValue<DateType> = DateType | null;
import { Provider } from 'react-redux';
import store from './redux/store';

function App(): React.ReactElement {
  return (
    <div className="App">
      <Provider store={store}>
        <RouterNavigation />
      </Provider>
    </div>
  );
}

export default App;
