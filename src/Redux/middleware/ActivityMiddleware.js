/* eslint-disable prettier/prettier */
import axios from 'axios';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { APIs, base_url } from '../../Config/APIs';
import { get, post } from '../../Config/AxiosConfig';
import { ActionTypes } from '../action_types';

export const ActivityMiddleware = {
    getExercises: ({ type, search = "", mine }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("search", search)
                formData.append("mine", mine)
                let request = await post(APIs.GET_SOBER_ACTIVITY + `/${type}`, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetSoberActivity, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreExercises: ({ next_url, search = "", mine }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("search", search)
                formData.append("mine", mine)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreSoberActivity, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getSuicideLinks: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_SUICIDE_LINKS);
                if (request) {
                    dispatch({ type: ActionTypes.GetSuicideLinks, payload: request.data })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getForumTopics: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_FORUM_TOPICS);
                if (request) {
                    dispatch({ type: ActionTypes.GetForumTopics, payload: request })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getAllTherapist: ({ search, meet_type, latitude, longitude, callback }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("latitude", latitude);
                formData.append("longitude", longitude);
                formData.append("name", search);
                if (meet_type)
                    formData.append("type", meet_type);
                let request = await post(APIs.GET_ALL_THERAPISTS, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetAllTherapist, payload: request.data, next_url: request.next_page_url });
                    callback();
                }
                if (request.data.length == 0) {
                    // if(search)
                    // alert("No counselors found")
                    // else
                    alert("No counselors in your area at this time.")
                }

                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreAllTherapist: ({ next_url, search, meet_type, latitude, longitude, }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("latitude", latitude);
                formData.append("longitude", longitude);
                formData.append("name", search)
                if (meet_type)
                    formData.append("type", meet_type)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreAllTherapist, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    addRequest: ({ therapist_id, title, note, date, callback }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("therapist_id", therapist_id)
                formData.append("date", date)
                formData.append("title", title)
                formData.append("note", note)
                let request = await post(APIs.ADD_THERAPIST_REQUEST, formData);
                if (request) {
                    callback(true)
                }
                else
                    callback(false)

                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getRehabs: ({ search }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("rehab_name", search)
                let request = await post(APIs.GET_REHABS, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetRehabs, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreRehabs: ({ next_url, search }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("rehab_name", search)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreRehabs, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMeetings: ({ search, type, mine = false }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("search", search)
                formData.append("type", type)
                formData.append("mine", mine)
                let request = await post(APIs.GET_MEETINGS, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMeeting, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreMeetings: ({ next_url, search, type, mine = false }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("search", search)
                formData.append("type", type)
                formData.append("mine", mine)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreMeeting, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    createMeeting: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append('title', data.title);
                formData.append('address', data.address);
                formData.append('description', data.description);
                formData.append('start_time', data.start_time);
                formData.append('zip_code', data.zip);
                if (data.file)
                    formData.append('image', data.file);
                if (data.type)
                    formData.append('type', data.type);

                let request = await post(APIs.CREATE_MEETING, formData, {}, "Before scheduling a meeting you must verify your account by clicking a link sent to you in email from Zoom, please check your email account.");
                if (request) {
                    data.callback(true);
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    deleteMeeting: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.DeleteMeeting, index: data.index })
                let request = await get(APIs.DELETE_MEETING + `/${data.id}`);
                if (request) {
                }
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getSponseeRehabs: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_SPONSEE_REHABS);
                if (request) {
                    dispatch({ type: ActionTypes.GetSponseeRehabs, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreSponseeRehabs: ({ next_url }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreSponseeRehabs, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getSponsorEvents: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_SPONSOR_EVENTS);
                if (request) {
                    dispatch({ type: ActionTypes.GetSponsorEvents, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreSponsorEvents: ({ next_url }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreSponsorEvents, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    addSponsorRequest: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("notes", data.note);
                if (!data.event)
                    formData.append("rehab_id", data.id);
                if (data.event)
                    formData.append("event_id", data.id);

                let request = await post(APIs.ADD_SPONSOR_REQUEST, formData);
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
    getPatient: ({ rehab_id }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("rehab_id", rehab_id)
                let request = await post(APIs.GET_PATIENTS, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetPatients, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMorePatient: ({ next_url, rehab_id }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("rehab_id", rehab_id)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMorePatients, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMusic: ({ callback, search }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("search", search)
                let request = await post(APIs.GET_MUSIC, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMusic, payload: request.data, next_url: request.next_page_url });
                    callback()
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreMusic: ({ next_url, callback, search }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("search", search)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreMusic, payload: request.data, next_url: request.next_page_url })
                    callback()
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getYogaClass: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("mine", data?.mine)
                let request = await post(APIs.GET_YOGA_CLASSES, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetYogaClasses, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreYogaClass: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                // let request = await get(next_url);
                let formData = new FormData();
                formData.append("mine", data?.mine)
                let request = await post(data.next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreYogaClasses, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getSchedules: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("date", data.date)
                let request = await post(APIs.GET_SCHEDULES, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetSchedules, payload: request.data, next_url: request.next_page_url });
                    if (data.callback)
                        data.callback(request.data);
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getMoreSchedules: ({ next_url, date }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("date", date)
                let request = await post(next_url, formData);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreSchedules, payload: request.data, next_url: request.next_page_url })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    AddSchedule: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("title", data.title)
                formData.append("start_time", data.startTime)
                formData.append("end_time", data.endTime)
                formData.append("date", data.date)
                if (data.activityId)
                    formData.append((data?.type == "meeting" ? "meeting_id" : "activity_id"), data.activityId)
                if (data.note)
                    formData.append("note", data.note)
                if (data.reminder)
                    formData.append("reminder", data.reminder)
                console.warn(formData)
                let request = await post(APIs.ADD_SCHEDULE, formData);
                if (request) {
                    data.callback();
                    dispatch({ type: ActionTypes.AddSchedule, payload: request, })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    AddScheduleMeal: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let formData = new FormData();
                formData.append("date", data.date)
                formData.append("plans", data.plans)

                console.warn(formData)
                let request = await post(APIs.ADD_SCHEDULE_MEAL, formData);
                if (request) {
                    data.callback();
                    dispatch({ type: ActionTypes.AddSchedule, payload: request, })
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    getScheduledDates: () => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let request = await get(APIs.GET_SCHEDULED_DATES);
                if (request) {
                    dispatch({ type: ActionTypes.GetSchedulesDate, payload: request });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error);
            }
        };
    },
    addActivity: (data) => {
        return async dispatch => {
            try {
                // let formData = new FormData();
                // formData.append("title", data.title);
                // formData.append("title", data.title)
                // formData.append("title", data.title)
                // formData.append("title", data.title)
                // let request = await post(APIs.ADD_ACTIVITY_VIDEO, formData);
                RNFetchBlob.fetch("POST", base_url + APIs.ADD_ACTIVITY_VIDEO,
                    {
                        Authorization: "Bearer " + data.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    [{
                        name: "name",
                        data: data.title
                    }, {
                        name: "details",
                        data: data.description
                    }, {
                        name: "duration",
                        data: data.duration
                    }, {
                        name: "type",
                        data: data.type
                    },
                    {
                        name: "thumbnail",
                        filename: data.thumb.name,
                        type: data.thumb.mime,
                        data: Platform.OS == "android" ? RNFetchBlob.wrap(data.thumb.path.replace("file://", "")) : RNFetchBlob.wrap(data.thumb.path)
                    },
                    {
                        name: "video",
                        filename: data.file.name,
                        type: data.file.type,
                        data: Platform.OS == "android" ? RNFetchBlob.wrap(data.file.uri.replace("file://", "")) : RNFetchBlob.wrap(data.file.uri)
                    }]
                ).uploadProgress((sent, total) => {
                    data.uploading(sent, total);
                }).then((value) => {
                    data.callback()
                    console.warn(value)
                }).catch((reason) => {
                    alert(reason);
                })
            } catch (error) {
                console.warn(error);
            }
        };
    },
    addYogaClass: (data) => {
        return async dispatch => {
            try {
                await RNFetchBlob.fetch("POST", base_url + APIs.ADD_CLASS_VIDEO,
                    {
                        Authorization: "Bearer " + data.token,
                        'Content-Type': 'multipart/form-data',
                    },
                    [{
                        name: "title",
                        data: data.title
                    }, {
                        name: "description",
                        data: data.description
                    }, {
                        name: "duration",
                        data: data.duration
                    },
                    {
                        name: "thumbnail",
                        filename: data.thumb.name,
                        type: data.thumb.mime,
                        data: Platform.OS == "android" ? RNFetchBlob.wrap(data.thumb.path.replace("file://", "")) : RNFetchBlob.wrap(data.thumb.path)
                    },
                    {
                        name: "video",
                        filename: data.file.name,
                        type: data.file.type,
                        data: Platform.OS == "android" ? RNFetchBlob.wrap(data.file.uri.replace("file://", "")) : RNFetchBlob.wrap(data.file.uri)
                    },]
                ).uploadProgress((sent, total) => {
                    data.uploading(sent, total);
                }).then((value) => {
                    data.callback()
                    console.warn(value)
                })
            } catch (error) {
                console.warn(error);
            }
        };
    },
    deleteSoberActivity: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.DeleteSoberActivity, index: data.index })
                let request = await get(APIs.DELETE_SOBER_ACTIVITY + "/" + data.id);
                if (request) {
                }
            } catch (error) {
                console.warn(error);
            }
        };
    },
    deleteClass: (data) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.DeleteClass, index: data.index })
                let request = await get(APIs.DELETE_CLASS + "/" + data.id);
                if (request) {
                }
            } catch (error) {
                console.warn(error);
            }
        };
    },
    getJWTToken: (data) => {
        return async dispatch => {
            try {
                let request = await get(APIs.GENERATE_JWT);
                if (request) {
                    data.callback(request);
                }
            } catch (error) {
                data.callback(false)
                console.warn(error);
            }
        };
    },
    getZoomAccessToken: (data) => {
        return async dispatch => {
            try {
                let formData = new FormData();
                formData.append("type", "zak")
                let request = await axios.get(`https://api.zoom.us/v2/users/${data.zoom_id}/token?type=zak`, {
                    headers: {
                        "Authorization": "Bearer " + data.token
                    }
                });
                if (request.data) {
                    data.callback(request.data)
                }
            } catch (error) {
                data.callback(false)
                console.warn(error);
            }
        };
    }
    // getMoreReading: ({ next_url }) => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(next_url);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetMoreReading, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
    // getPlaying: () => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(APIs.GET_PLAYING);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetPlaying, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
    // getMorePlaying: ({ next_url }) => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(next_url);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetMorePlaying, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
    // getLearning: () => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(APIs.GET_INSTRUMENT);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetLearning, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
    // getMoreLearning: ({ next_url }) => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(next_url);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetMoreLearning, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
    // getCooking: () => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(APIs.GET_COOKING);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetCooking, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
    // getMoreCooking: ({ next_url }) => {
    //     return async dispatch => {
    //         try {
    //             dispatch({ type: ActionTypes.ShowLoading });
    //             let request = await get(next_url);
    //             if (request) {
    //                 dispatch({ type: ActionTypes.GetMoreCooking, payload: request.data })
    //             }
    //             dispatch({ type: ActionTypes.HideLoading });
    //         } catch (error) {
    //             console.warn(error);
    //         }
    //     };
    // },
};
