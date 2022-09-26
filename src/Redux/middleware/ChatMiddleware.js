import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { APIs, base_url } from '../../Config/APIs';
import { get, post } from '../../Config/AxiosConfig';
import { ActionTypes } from '../action_types';

export const ChatMiddleware = {
    getChatlist: () => {
        return async dispatch => {
            dispatch({ type: ActionTypes.ShowLoading });
            try {
                let request = await get(APIs.GET_CHATS);
                if (request) {
                    dispatch({ type: ActionTypes.GetChatList, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
            }
        }
    },
    getMoreChatlist: ({ next_url }) => {
        return async dispatch => {
            dispatch({ type: ActionTypes.ShowLoading });
            try {
                let request = await get(next_url);
                if (request) {
                    dispatch({ type: ActionTypes.GetChatList, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
            }
        }
    },
    getMessages: (data, loading = true) => {
        return async dispatch => {
            if (loading)
                dispatch({ type: ActionTypes.ShowLoading });

            try {
                let request = await get(APIs.GET_MESSAGES + `/${data.id}`);
                if (request) {
                    data.callback(request.data);
                    dispatch({ type: ActionTypes.GetMessages, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                console.warn(error)
            }
        }
    },
    getMoreMessages: ({ next_url }) => {
        return async dispatch => {
            dispatch({ type: ActionTypes.ShowLoading });
            try {
                let request = await get(next_url);
                if (request) {
                    dispatch({ type: ActionTypes.GetMoreMessages, payload: request.data, next_url: request.next_page_url });
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
            }
        }
    },
    sendMessage: data => {
        return async dispatch => {
            dispatch({ type: ActionTypes.SendingMessage, payload: true });

            try {
                //data.msgObj
                // if(data.image!=2)
                // dispatch({ type: ActionTypes.SendMessages, payload: data.msgObj });

                await RNFetchBlob.fetch("POST", base_url + APIs.SEND_MESSAGE,
                    {
                        Authorization: "Bearer " + data.token,
                        //'Content-Type': 'multipart/form-data',
                    },
                    [{
                        name: "user_id",
                        data: data.user_id + ""
                    }, {
                        name: "type",
                        data: data?.file?.uri ? "media" : "text"
                    }, {
                        name: "message",
                        data: data.message
                    }, {
                        name: "image",
                        data: data.image + ""
                    }, {
                        name: "media",
                        filename: data.file.name,
                        data: RNFetchBlob.wrap(data.file.uri)
                    },]
                ).uploadProgress((sent, total) => {
                    data.uploading(sent, total);
                }).then((value) => {
                   dispatch({ type: ActionTypes.SendMessages, payload: JSON.parse(value.data).data });
                    data.callback()
                    //console.warn()
                })

                dispatch({ type: ActionTypes.SendingMessage, payload: false });
            } catch (error) {
                alert("Error occured try again")
                dispatch({ type: ActionTypes.SendingMessage, payload: false });
                console.warn(error)
            }
        };
    },
    getUsers: ({
        name,
        callback,
    }) => {
        return async dispatch => {
            dispatch({ type: ActionTypes.ShowLoading });
            try {
                let formData = new FormData();
                formData.append('search', name);
                let request = await post(APIs.GET_USERS, formData);
                if (request) {
                    callback(request);
                    console.warn("GetUsers:", request);
                }
                dispatch({ type: ActionTypes.HideLoading });
            } catch (error) {
                dispatch({ type: ActionTypes.HideLoading });
                callback(false);

            }
        }
    },
};
