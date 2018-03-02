import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = {
  form: {
    width: '100%'
  },

  textFieldWrapper: {
    margin: '0 auto',
    maxWidth: '400px'
  },

  textField: {
    width: '100%'
  },

  submitWrapper: {
    textAlign: 'left',
    maxWidth: '400px',
    margin: '10px auto'
  }
};


class LoginForm extends Component {
  constructor (props) {
    super(props);

    this.state = { userName: '' };
  }

  onLoginNameChange (ev) {
    this.setState({ userName: ev.target.value });
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ userName: '' });
  }

  render () {
    return (
      <form style={ styles.form } onSubmit={ this.handleSubmit.bind(this) }>
        <div style={  styles.textFieldWrapper }>
          <TextField
            onChange={ this.onLoginNameChange.bind(this) }
            style={ styles.textField }
            placeholder='Digite o seu nick :)'
            label="Nickname" />
        </div>

        <div style={ styles.submitWrapper }>
          <Button type='submit' variant="raised" color="primary">
            chega ae
          </Button>
        </div>

      </form>
    );
  }
}

export default LoginForm;
