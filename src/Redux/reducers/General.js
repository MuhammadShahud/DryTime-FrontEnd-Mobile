import { ActionTypes } from '../action_types';

const initialState = {
  loading: false,
  pages: null,
  notifications: { data: [], next_url: null },
  quotes: null,
  achievements: { data: [], next_url: null },
  steps: 0,
  steps_distance: 0,
  steps_report: [
    [0],
    [0],
    [0]
  ],
  track_steps: true,
  chat_notify: true
};

export const GeneralReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.Notifications:
      state = { ...state, notifications: { data: action.payload, next_url: action.next_url } };
      break;
    case ActionTypes.MoreNotifications:
      state = { ...state, notifications: { data: [...state.notifications.data, ...action.payload], next_url: action.next_url } };
      break;
    case ActionTypes.GetAchievements:
      state = { ...state, achievements: { data: action.payload, next_url: action.next_url } };
      break;
    case ActionTypes.GetMoreAchievements:
      state = { ...state, achievements: { data: [...state.achievements.data, ...action.payload], next_url: action.next_url } };
      break;
    case ActionTypes.GetPages:
      state = { ...state, pages: action.payload };
      break;
    case ActionTypes.GetQuotes:
      state = { ...state, quotes: action.payload };
      break;
    case ActionTypes.GetSteps:
      state = { ...state, steps_report: action.payload };
      break;
    case ActionTypes.IncreaseSteps:
      state = { ...state, steps: action.steps, steps_distance: action.distance };
      break;
    case ActionTypes.TRACK_STEPS:
      state = { ...state, track_steps: action.payload, };
      break;
    case ActionTypes.ResetSteps:
      state = { ...state, steps: 0, steps_distance: 0 };
      break;
    case ActionTypes.ChatNotify:
      state = { ...state, chat_notify: action.payload };
      break;
    case ActionTypes.ShowLoading:
      state = { ...state, loading: true };
      break;
    case ActionTypes.HideLoading:
      state = { ...state, loading: false };
      break;
    default:
      break;
  }
  return state;
};
