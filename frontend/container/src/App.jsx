/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FlexLayout } from '@nutanix-ui/prism-reactjs';

import '@nutanix-ui/prism-reactjs/dist/index.css';
import './index.css';

import LandingPage from './pages/LandingPage';
import FaqPage from './pages/FaqPage';

import Header from './components/Header';

function App({ history }) {
  return (
    <Router history={history}>
      <FlexLayout flexDirection="column" itemSpacing="0px" padding="0px">
        <Header />

        <div style={{ padding: '10px' }}>
          <Switch>
            <Route exact path="/" render={(props) => <LandingPage { ...props } history={ history } />} />
            <Route exact path="/docs" render={() => <FaqPage />} />
          </Switch>
        </div>
      </FlexLayout>
    </Router>
  );
}

App.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default App;
