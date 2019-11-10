import React, {Fragment} from 'react';
import './App.css';
import { Navbar } from './component/Layout/Navbar';
import Landing from './component/Layout/Landing';

const App = () => {
  return (
    <Fragment>
     <Navbar />
     <Landing />
    </Fragment>
  );
}

export default App;
