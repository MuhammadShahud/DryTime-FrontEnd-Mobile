import { combineReducers } from 'redux';
import { AuthReducer } from './AuthReducer';
import { GeneralReducer } from './General';
import { PostReducer } from './PostReducer';
import { ActivityReducer } from './ActivityReducer';
import { ChatReducer } from './ChatReducer';

export const reducer = combineReducers({
  AuthReducer,
  GeneralReducer,
  PostReducer,
  ActivityReducer,
  ChatReducer
});
