import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import moment from 'moment';
import List, { ListItem } from 'material-ui/List';

import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Card from 'material-ui/Card';

import { connect } from 'react-redux';
import redux from '../redux';

const styles = {
  chatWrapper: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0px auto',
    height: '100%',
    border: '1px solid #F0F0F0',
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },

  chatWindowWrapper: {
    width: '70%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  chatWindow: {
    flex: 1,
    padding: '10px'
  },

  chatWindowForm: {
    padding: '10px'
  },

  chatUsersWrapper: {
    width: '30%'
  }
};


class FormMsgInput extends Component {
  constructor (props) {
    super(props);

    this.state = { msg: '' };
  }

  onLoginNameChange (ev) {
    this.setState({ msg: ev.target.value });
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ msg: '' });
  }

  render () {
    return (
      <form style={ { display: 'flex', flexDirection: 'row', flex: 1 } }onSubmit={ this.handleSubmit.bind(this) }>
        <TextField
          type='text'
          label='Falaaa!'
          placeholder='Nao tenha medo, digita!'
          style={ { flex: 1 } }
          value={ this.state.msg }
          onChange={ this.onLoginNameChange.bind(this) } />

        <Button style={ { width: '100px' } } type='submit'>enviar!</Button>
      </form>
    );
  }
}

class ChatRoom extends Component {
  renderMsg (msg, index) {
    return (
      <Typography key={ index } variant="body1" align="left">
        <span style={ { color: '#777' } }>
          [{ moment(msg.date).format('DD/MM/YYYY hh:mm:ssA') }]&nbsp;
        </span>

        { msg.userName &&
          <span style={ { color: '#555' } }>
            &nbsp;@{ msg.userName }: &nbsp;
          </span> }

        <span style={ { color: '#222' } }>
          { msg.msg }
        </span>
      </Typography>
    );
  }

  renderUser (user, index) {
    return (
      <ListItem key={ index }>
        <Typography noWrap={ true } variant="body1" align="left">
          { user }
        </Typography>
      </ListItem>
    );
  }

  render () {
    return (
      <div style={ styles.chatWrapper }>
        <Card style={ styles.chatWindowWrapper }>
          <div style={ styles.chatWindow }>
            { this.props.msgs.map((msg, idx) => this.renderMsg(msg, idx)) }
          </div>

          <div style={ { padding: '5px' } }>
            <AppBar position="static" color="default">
              <div style={ styles.chatWindowForm }>
                <FormMsgInput onSubmit={ this.handleSubmit.bind(this) } />
              </div>
            </AppBar>
          </div>
        </Card>

        <Card className='user-list' style={ styles.chatUsersWrapper }>
            <List component="nav">
              { this.props.usersInChat.map((u, idx) => this.renderUser(u, idx)) }
            </List>
        </Card>
      </div>
    );
  }

  handleSubmit (values) {
    redux.msgs.actions.send(values.msg);
  }
}

export default connect((s) => {
  return {
    usersInChat: s.usersInChat,
    user: s.user,
    msgs: s.msgs
  };
})(ChatRoom);
