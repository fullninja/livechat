import React, { Component } from 'react';

import logo from './img/logo.svg';
import './styles/App.css';

import ChatRoom from './components/ChatRoom';
import LoginForm from './components/LoginForm';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import { Provider, connect } from 'react-redux';

import redux from './redux';

class AlertDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Error!</DialogTitle>
        <DialogContent style={ { minWidth: '200px' } }>
          <DialogContentText id="alert-dialog-description">
            { this.props.error }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class AppComponentWrapper extends Component {
  render () {
    return (
      <div className='app'>
        <AlertDialog error={ this.props.error } ref='alert' />

        <header className="app-header">
          <a href='/'>
            <img src={logo} className="app-logo" alt="logo" />
          </a>
        </header>

        <div style={ { padding: '10px' } }>
          { !this.props.user &&
            <LoginForm onSubmit={ this.handleLoginSubmit.bind(this) } /> }

          { this.props.user && <ChatRoom /> }
        </div>

      </div>
    );
  }

  handleLoginSubmit (values) {
    redux.user.actions.login(values.userName);
  }

  componentDidUpdate () {
    if (this.props.error) {
      this.refs.alert.setState({ open: true });
    }
  }
}
const AppContainer = connect((s) => {
  return {
    user: !s.user || !s.user.error ? s.user : null,
    error: s.user && s.user.error ? s.user.error : null
  };
})(AppComponentWrapper);

class App extends Component {
  render() {
    return (
      <Provider store={ redux.store }>
        <AppContainer />
      </Provider>
    );
  }
}

export default App;
