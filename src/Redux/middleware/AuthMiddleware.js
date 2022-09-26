import axios from 'axios';
import { Alert, AsyncStorage } from 'react-native';
import { APIs } from '../../Config/APIs';
import { get, post } from '../../Config/AxiosConfig';
import { ActionTypes } from '../action_types';
import messaging from '@react-native-firebase/messaging';

export const AuthMiddleware = {
  Register: (userData) => {
    return async dispatch => {
      dispatch({ type: ActionTypes.ShowLoading });
      try {
        let formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('confirm_password', userData.Repassword);
        formData.append('dob', userData.DateOfBirth);
        formData.append('gender', userData.Gender);
        formData.append('addictions', userData.addiction);
        formData.append('rehab_name', userData.Rehab);
        formData.append('sober_time', userData.sober);
        formData.append('patient_type', userData.patient);
        formData.append('hear_from', userData.WhereHear);
        formData.append('using_reason', userData.WhyUsingApp);
        formData.append('device_id', userData.token);
        formData.append('relation_status', userData.relation_status);
        if (userData.single_status || userData.married)
          formData.append(
            'relation_status1',
            userData.single_status
              ? userData.single_status
              : userData.married,
          );
        if (userData.single_not_avail || userData.single_avail)
          formData.append(
            'relation_status2',
            userData.single_not_avail != "Select" && userData.single_not_avail
              ? userData.single_not_avail
              : userData.single_avail
          );
        // formData.append('country', userData.country);
        // formData.append('state', userData.state);
        // formData.append('city', userData.city);

        console.warn(formData)

        let request = await post(APIs.REGISTER, formData);
        if (request) {
          AsyncStorage.setItem("@DT-user", JSON.stringify(request), (error) => console.warn(error))
          dispatch({ type: ActionTypes.Register, payload: request });
          userData.callback()
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error)
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  UpdateProfile: userData => {

    return async dispatch => {
      dispatch({ type: ActionTypes.ShowLoading });
      try {
        let formData = new FormData();
        formData.append('username', userData.username);
        formData.append('dob', userData.DateOfBirth);
        formData.append('gender', userData.Gender);
        formData.append('rehab_name', userData.Rehab);
        formData.append('sober_time', userData.sober);
        formData.append('patient_type', userData.patient);
        formData.append('addiction', userData.addiction);
        formData.append('relation_status', userData.relation_status);
        if (userData.profile_pic?.uri && !userData?.profile_pic?.uri.startsWith("http"))
          formData.append('profile_pic', userData.profile_pic);
        if ((userData.single_status && userData.single_status != "Select") || (userData.married && userData.married != "Select"))
          formData.append(
            'relation_status1',
            userData.single_status
              ? userData.single_status
              : userData.married,
          );
        if ((userData.single_not_avail && userData.single_not_avail != "Select") || (userData.single_avail && userData.single_avail != "Select"))
          formData.append(
            'relation_status2',
            userData.single_not_avail != "Select" && userData.single_not_avail
              ? userData.single_not_avail
              : userData.single_avail
          );
        // formData.append('country', userData.country);
        // formData.append('state', userData.state);
        // formData.append('city', userData.city);
        console.warn(formData)
        let request = await post(APIs.UPDATE_PROFILE, formData);
        if (request) {
          console.warn(request)
          AsyncStorage.setItem("@DT-user", JSON.stringify({ token: userData.token, user: request }))
          dispatch({ type: ActionTypes.Update_Profile, payload: request });
          Alert.alert('Note', 'Profile updated successfully..!', [
            {
              text: "OK",
              onPress: userData.onSuccess
            }
          ])

        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
        console.warn(error)
      }
    };
  },
  Login: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('device_id', userData.token);
        let request = await post(APIs.LOGIN, formData);
        if (request) {
          AsyncStorage.setItem("@DT-user", JSON.stringify(request))
          dispatch({ type: ActionTypes.Login, payload: request, plan: request.user.user_plan });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error)
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  checkUser: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('email', userData.email);
        let request = await post(APIs.SOCIAL_LOGIN, formData);
        if (request) {
          AsyncStorage.setItem("@DT-user", JSON.stringify(request))
          dispatch({ type: ActionTypes.Login, payload: request, plan: request.user.user_plan });
        }
        else
          userData.callback(false);

        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error)
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  getRehabs: ({ callback }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await get(APIs.GET_ONLY_REHABS);
        if (request) {
          callback(request);
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  SetPlan: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        // formData.append('plan', userData.plan);
        // formData.append('start_date', userData.startDate);
        // formData.append('end_date', userData.endDate);
        formData.append("addictions", userData.addictions)
        formData.append("edit", userData.edit)
        console.warn(formData);
        let request = await post(APIs.SET_PLAN, formData);
        if (request) {
          let user = { ...userData.user, user: request }
          AsyncStorage.setItem("@DT-user", JSON.stringify(user))
          dispatch({ type: ActionTypes.Update_Profile, payload: request });
          userData.callback()
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  SendEmail: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('email', userData.email);
        let request = await post(APIs.SEND_EMAIL, formData);
        if (request) {
          console.warn(request)
          userData.callback(request)
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  ResetPassword: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        let request = await post(APIs.RESET_PASSWORD, formData);
        console.warn(request)
        if (request) {
          userData.callback()
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  getPaymentMethods: () => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await get(APIs.GET_PAYMENT_METHODS);
        if (request) {
          dispatch({ type: ActionTypes.SetPaymentMethods, payload: request });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  addPaymentMethod: (data) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('card_number', data.number);
        //formData.append('', data.name);
        formData.append('exp_date', data.expiry);
        formData.append('cvc', data.cvc);
        let request = await post(APIs.ADD_PAYMENT_METHOD, formData);
        if (request) {
          data.callback()
          AuthMiddleware.getPaymentMethods();
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  deletePaymentMethod: (data) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.DeletePaymentMethods, index: data.index })
        let formData = new FormData();
        formData.append('stripe_source_id', data.method_id);
        let request = await post(APIs.DELETE_PAYMENT_METHOD, formData);
        if (request) {

        }
      } catch (error) {
        console.warn(error);
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  defaultPaymentMethod: (data) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.DefaultPaymentMethods, index: data.index })
        let request = await post(APIs.DEFAULT_PAYMENT_METHOD + `/${data.method_id}`);
        if (request) {

        }
      } catch (error) {
        console.warn(error);
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  getSubscriptions: ({ callback }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await get(APIs.GET_SUBSCRIPTIONS);
        if (request) {
          callback(request);
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  subscribePkg: data => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append("type", data.type);
        formData.append('plan_id', data.package_id);
        formData.append('price', data.price);
        let request = await post(APIs.SUBSCRIBE_PACKAGE, formData);
        if (request) {
          AsyncStorage.setItem("@DT-user", JSON.stringify({ token: data.token, user: request }))
          dispatch({ type: ActionTypes.SubscribePackage, payload: request });
          if (data?.onSuccess)
            data.onSuccess(true)
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
  deleteAccount: data => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await get(APIs.DELETE_ACCOUNT);
        if (request) {
          dispatch({ type: ActionTypes.Logout })
          AsyncStorage.getItem("@DT-publicKey", (error, result) => {
            if (!error) {
              if (!result) {
                AsyncStorage.removeItem("qoute")
                AsyncStorage.removeItem("@DT-user")
                AsyncStorage.removeItem("@DT-steps")
                AsyncStorage.removeItem("@DT-userSteps")
              }
            }
          })
          messaging().unsubscribeFromTopic("drytime");
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
      }
    };
  },
};
