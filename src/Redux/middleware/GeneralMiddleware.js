import { AsyncStorage } from 'react-native';
import { APIs } from '../../Config/APIs';
import { get, post } from '../../Config/AxiosConfig';
import { ActionTypes } from '../action_types';

export const GeneralMiddleware = {
    RateApp: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append('rating', data.rating);
                formData.append('comments', data.comment);
                let request = await post(APIs.RATE_APP, formData);
                if (request) {
                    data.callback();
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    ContactUs: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append('title', data.title);
                formData.append('description', data.description);
                formData.append('type', data.type);
                let request = await post(APIs.CONTACT_US, formData);
                if (request) {
                    data.callback();
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    GetPages: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_PAGES);
                if (request) {
                    dispatch({ type: ActionTypes.GetPages, payload: request });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getNotifications: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.NOTIFICATION);
                if (request) {
                    dispatch({ type: ActionTypes.Notifications, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreNotifications: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(next_url);
                if (request) {
                    dispatch({ type: ActionTypes.MoreNotifications, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getQoutes: (data) => {
        return async dispatch => {
            try {
                let request = await get(APIs.GET_QUOTES);
                if (request) {
                    dispatch({ type: ActionTypes.GetQuotes, payload: request });
                    data.callback(request)
                }
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getAchievements: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_ACHIEVEMENTS);
                if (request) {
                    console.warn(request)
                    dispatch({ type: ActionTypes.GetAchievements, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreAchievements: ({ next_url }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(next_url);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreAchievements, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    addSponsor: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append('address', data.Address);
                formData.append('phone', data.Phone);
                formData.append('occupation', data.Occupation);
                formData.append('sponsor_type', data.individual);
                if (data.individual == "organization") {
                    formData.append('organization_name', data.OrganizationName);
                    formData.append('organization_address', data.OrganizationAddress);
                }
                formData.append('title', data.Title);
                formData.append('ein', data.EIN);
                formData.append('sponsor_who', data.Sponsorship);
                let request = await post(APIs.ADD_SPONSOR, formData);
                if (request) {
                    data.callback();
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    addSponsee: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append('religious_affiliation', data.ReligiousAffiliation);
                formData.append('old_treatment', data.CounselingYesNo);
                formData.append('old_treatment_text', data.Counseling);
                formData.append('inpatient', data.inpatientTreatment);
                formData.append('weekly_schedule', data.WeeklyTreatment);
                formData.append('why_need_sponsor', data.HelpSponsorship);
                formData.append('is_waiting', data.waitingList);
                let request = await post(APIs.ADD_SPONSEE, formData);
                if (request) {
                    data.callback();
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    addSteps: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.IncreaseSteps, steps: data.steps, distance: data.distance })
                let formData = new FormData();
                formData.append('steps_count', data.steps);
                formData.append('distance_completed', data.distance);
                formData.append('date', data.date);
                let request = await post(APIs.STORE_STEPS, formData);
                if (request) {
                }
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getSteps: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_STEPS);
                if (request) {
                    dispatch({ type: ActionTypes.GetSteps, payload: request });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    awardToken: (data) => {
        return async dispatch => {
            try {
                let request = await post(APIs.AWARD_TOKEN);
                if (request) {
                    data.callback(request?.token_name);
                    // dispatch({ type: ActionTypes.GetSteps, payload: request });
                }
            } catch (error) {
                console.warn(error);
            }
        };
    }
};

