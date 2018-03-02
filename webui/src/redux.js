import { createStore, combineReducers } from 'redux';
import io from 'socket.io-client';

const config = process.env.NODE_ENV === 'development' ?
                require('./config/local') :
                require('./config/prod');

const socket = io.connect(config.urls.socket);

function dispatch (action) { return store.dispatch(action); }

// users
const userInitialState = null;
const userActionTypes = {
  loginStart: 'user_login_start',
  loginFail: 'user_login_fail',
  login: 'user_login',

  disconnect: 'user_disconnect'
};

const userActions = {
  login (userName) {
    dispatch({ type: userActionTypes.loginStart, userName });
    socket.emit('try-add-user', userName);
  },

  loginError (msg) {
    dispatch({
      type: userActionTypes.loginFail, msg });
  },

  loginSuccess ({ user, allUsers }) {
    dispatch({ type: userActionTypes.login, user, allUsers });
  },

  disconnect () {
    dispatch({ type: userActionTypes.disconnect });
  }
};

socket.on('login-already-in', userActions.loginAlreadyIn);
socket.on('login-success', userActions.loginSuccess);
socket.on('login-error', userActions.loginError);
socket.on('disconnect', userActions.disconnect);

function userReducer (state = userInitialState, action) {
  switch (action.type) {
    case userActionTypes.disconnect: return null;
    case userActionTypes.login: return action.user;
    case userActionTypes.loginFail: return { error: action.msg };
    default: return state;
  }
}
// *** users

// msgs
const msgInitialState = [ ];
const msgActionTypes = {
  msgIncoming: 'msg_incoming',
};


const msgActions = {
  incoming (msg) {
    dispatch({ type: msgActionTypes.msgIncoming, msg });
  },

  send (msg) {
    socket.emit('msg', msg);
  }
};
socket.on('msg', msgActions.incoming);

function addMsgToState (state, msg) {
  const newState = [ ...state ];

  newState.push(msg);
  return newState;
}

function msgReducer (state = msgInitialState, action) {
  switch (action.type) {
    case userActionTypes.disconnect: return msgInitialState;
    case msgActionTypes.msgIncoming: return addMsgToState(state, action.msg);
    default: return state;
  }
}
// ** msgs

// usersInChat
const usersInChatInitialState = [ ];
const usersInChatActionTypes = {
  addedUser: 'users_in_chat_added_user',
  removedUser: 'users_in_chat_removed_user',
};

const usersInChatActions = {
  add (userName) {
    dispatch({ type: usersInChatActionTypes.addedUser, userName });
  },

  remove (userName) {
    dispatch({ type: usersInChatActionTypes.removedUser, userName });
  }
};

function usersSort (a, b) { return a > b ? 1 : -1; }

function usersInChatReducer (state = usersInChatInitialState, action) {
  switch (action.type) {
    case userActionTypes.disconnect: return usersInChatInitialState;
    case userActionTypes.login: return [ ...action.allUsers ].sort(usersSort);

    case usersInChatActionTypes.addedUser: {
      const newState = [ ...state ];

      newState.push(action.userName);
      newState.sort(usersSort);

      return newState;
    }

    case usersInChatActionTypes.removedUser: {
      const newState = [ ...state ];
      newState.splice(newState.indexOf(action.userName), 1);

      return newState;
    }


    default: return state;
  }
}

socket.on('user-remove', usersInChatActions.remove);
socket.on('user-add', usersInChatActions.add);

// *** users in chat

const reducers = combineReducers({
  usersInChat: usersInChatReducer,
  user: userReducer,
  msgs: msgReducer
});
const store = createStore(reducers);

export default {
  usersInChat: { actions: usersInChatActions },
  user: { actions: userActions },
  msgs: { actions: msgActions },
  store
};
