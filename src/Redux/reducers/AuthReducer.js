import { ActionTypes } from '../action_types';

const initialState = {
  user: null,
  is_logged_in: false,
  user_sober_plan: null,
  paymentMethods: []
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.Register:
      state = { user: action.payload, is_logged_in: false };
      break;
    case ActionTypes.SetSoberPlan:
      state = { ...state, user: { ...state.user, user: { ...state.user.user, user_plan: action.payload } }, user_sober_plan: action.payload, is_logged_in: true };
      break;
    case ActionTypes.Login:
      state = { user: action.payload, is_logged_in: true };
      break;
    case ActionTypes.Logout:
      state = { user: null, is_logged_in: false, user_sober_plan: null };
      break;
    case ActionTypes.Update_Profile:
      state = { ...state, user: { ...state.user, user: action.payload } };
      break;
    case ActionTypes.SetPaymentMethods:
      state = { ...state, paymentMethods: action.payload };
      break;
    case ActionTypes.DeletePaymentMethods:
      let methods = [...state.paymentMethods];
      methods.splice(action.index, 1);
      state = { ...state, paymentMethods: methods };
      break;
    case ActionTypes.DefaultPaymentMethods:
      let pmethods = [...state.paymentMethods];
      pmethods.forEach((element, index) => {
        if (action.index == index)
          element.default_card = 1;
        else
          element.default_card = 0;
      })
      state = { ...state, paymentMethods: pmethods };
      break;
    case ActionTypes.SubscribePackage:
      state = { ...state, user: { ...state.user, user: { ...state.user, ...action.payload } }, is_logged_in: true };
      break;
    default:
      break;
  }
  return state;
};
