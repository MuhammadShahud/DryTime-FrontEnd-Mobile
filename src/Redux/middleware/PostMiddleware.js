import axios from 'axios';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { APIs, base_url } from '../../Config/APIs';
import { get, post } from '../../Config/AxiosConfig';
import { ActionTypes } from '../action_types';

export const PostMiddleware = {
  getTrendingPosts: () => {
    return async dispatch => {
      try {
        let request = await get(APIs.GET_TRENDING);
        if (request) {
          dispatch({ type: ActionTypes.GetTrendingPost, payload: request });
        }
      } catch (error) {
        console.warn(error);
      }
    };
  },
  createPost: data => {
    return async dispatch => {
      try {
        //  // dispatch({ type: ActionTypes.ShowLoading });
        //   let formData = new FormData();
        //   formData.append('description', data.Description);
        //   formData.append('file', data.file);
        //   formData.append('image', data.file?.type.includes("image") ? 1 : 0);
        //   if (data.forum) {
        //     formData.append('forum', data.forum);
        //     formData.append('day', data.day);
        //   }
        //   let request = await post(APIs.CREATE_POST, formData);
        //   if (request) {
        //     data.callback(true);
        //   }
        // [{
        //   name: "description",
        //   data: data.Description
        // }, {
        //   name: "image",
        //   data: data.file?.type.includes("image") ? "1" : "0"
        // }, {
        //   name: "file",
        //   filename: data.file.name,
        //   type: data.file.type,
        //   data: RNFetchBlob.wrap(data.file.uri)
        // }, ...data.forum ? [
        //   {
        //     name: "forum",
        //     data: data.forum + ""
        //   }, {
        //     name: "day",
        //     data: data.day
        //   },
        // ] : []]
        RNFetchBlob.fetch("POST", base_url + APIs.CREATE_POST,
          {
            Authorization: "Bearer " + data.token,
            'Content-Type': 'multipart/form-data',
          },
          [{
            name: "description",
            data: data.Description
          }, {
            name: "image",
            data: data.file?.type.includes("image") ? "1" : "0"
          }, {
            name: "file",
            filename: data.file.name,
            type: data.file.type,
            data: Platform.OS=="ios"?RNFetchBlob.wrap(data.file.uri.replace("file://","")):RNFetchBlob.wrap(data.file.uri)
          }, ...data.forum ? [
            {
              name: "forum",
              data: data.forum + ""
            }, {
              name: "day",
              data: data.day
            },
          ] : []]
        ).uploadProgress((sent, total) => {
          data.uploading(sent, total);
        }).then((value) => {
          console.warn(value)
          data.callback(true)
        }).catch((reason) => {
          alert(reason);
        })
        // dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getPost: ({ Loading }) => {
    return async dispatch => {
      try {
        Loading(true)
        let request = await get(APIs.GET_USER_POSTS);
        if (request) {
          dispatch({ type: ActionTypes.UsersPost, payload: request.data, next_url: request.next_page_url });
        }
        Loading(false)
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getMorePost: ({ Loading, next_url }) => {
    return async dispatch => {
      try {
        Loading(true)
        let request = await get(next_url);
        if (request) {
          dispatch({ type: ActionTypes.MoreUsersPost, payload: request.data, next_url: request.next_page_url });
        }
        Loading(false)
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getOthersPost: ({ forum, day }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append("forum", forum);
        formData.append("day", day);
        let request = await post(APIs.GET_OTHERS_POSTS, formData);

        if (request) {
          dispatch({ type: ActionTypes.OthersPost, payload: request.data, next_url: request.next_page_url });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getMoreOthersPost: ({ next_url, forum, day }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append("forum", forum);
        formData.append("day", day);
        let request = await post(next_url, formData);
        if (request) {
          dispatch({ type: ActionTypes.MoreOthersPost, payload: request.data, next_url: request.next_page_url });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  likePost: ({ post_id, Loading }) => {
    return async dispatch => {
      try {
        Loading(true)
        let formData = new FormData();
        formData.append("post_id", post_id)
        let request = await post(APIs.LIKE_POST, formData);
        if (request) {
          dispatch({ type: ActionTypes.LikePost, payload: request.data });
        }
        Loading(false)
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getAllComment: ({ post_id }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await post(APIs.GET_ALL_COMMENTS + `/${post_id}`);
        if (request) {
          dispatch({ type: ActionTypes.GetAllComments, payload: request.data, next_url: request.next_page_url });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getLikes: ({ post_id }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await get(APIs.GET_ALL_LIKES + `/${post_id}`);
        if (request) {
          dispatch({ type: ActionTypes.MyPostLikes, payload: request });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getMoreComment: ({ post_id, next_url }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await post(next_url);
        if (request) {
          dispatch({ type: ActionTypes.GetMoreComments, payload: request.data, next_url: request.next_page_url });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  AddComment: ({ comment, post_id, Loading, user }) => {
    return async dispatch => {
      try {
        Loading(true)
        let formData = new FormData();
        formData.append("post_id", post_id);
        formData.append("comment", comment);
        let request = await post(APIs.ADD_COMMENT, formData);
        if (request) {
          let updated_comment = {
            ...request[0],
            created_at: new Date(),
            updated_at: new Date(),
            user
          }
          dispatch({ type: ActionTypes.AddComments, payload: updated_comment, });
        }
        Loading(false)
      } catch (error) {
        console.warn(error);
      }
    };
  },
  DeleteComment: ({ comment_id }) => {
    return async dispatch => {
      try {
        let formData = new FormData();
        formData.append("comment_id", comment_id);
        let request = await post(APIs.DELETE_COMMENTS, formData);
        if (request) {
          dispatch({ type: ActionTypes.DeleteComment, payload: comment_id, });
        }
      } catch (error) {
        console.warn(error);
      }
    };
  },
  DeletePost: ({ post_id }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.DeleteMyPost, payload: post_id, });
        let request = await get(APIs.DELETE_POST + `/${post_id}`);
        if (request) {
        }
      } catch (error) {
        console.warn(error);
      }
    };
  },
  LikePost: ({ post_id }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.LikePost, payload: post_id, });
        let formData = new FormData();
        formData.append("post_id", post_id)
        let request = await post(APIs.LIKE_POST, formData);
        if (request) {
        }
      } catch (error) {
        console.warn(error);
      }
    };
  },
  EditPost: (data) => {
    return async dispatch => {
      try {
        RNFetchBlob.fetch("POST", base_url + APIs.EDIT_POST + `/${data.id}`,
          {
            Authorization: "Bearer " + data.token,
            'Content-Type': 'multipart/form-data',
          },
          [{
            name: "description",
            data: data.Description
          }, ...data.file ? [{
            name: "file",
            filename: data.file.name,
            type: data.file.type,
            data: RNFetchBlob.wrap(data.file.uri)
          }] : []]
        ).uploadProgress((sent, total) => {
          data.uploading(sent, total);
        }).then((value) => {
          data.callback(true)
        }).catch((reason) => {
          alert(reason);
        })
        // dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
      //   dispatch({ type: ActionTypes.ShowLoading });
      //   let formData = new FormData();
      //   if (data.Description)
      //     formData.append('description', data.Description);
      //   if (data.file?.name)
      //     formData.append('file', data.file);
      //   let request = await post(APIs.EDIT_POST + `/${data.id}`, formData);
      //   if (request) {
      //     data.callback(true);
      //   }
      //   dispatch({ type: ActionTypes.HideLoading });
      // } catch (error) {
      //   console.warn(error);
      // }
    };
  },
  PromotePost: (data) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let request = await get(APIs.PROMOTE_POST + `/${data.id}`);
        if (request) {
          dispatch({ type: ActionTypes.PromoteMyPost, payload: data.id });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) {
        console.warn(error);
      }
    };
  },
  getSinglePost: ({ post_id, Loading, callback }) => {
    return async dispatch => {
      try {
        Loading(true)
        let formData = new FormData();
        formData.append("id", post_id);
        let request = await post(APIs.GET_SINGLE_POST, formData);
        if (request) {
          callback(request);
        }
        Loading(false)
      } catch (error) {
        console.warn(error);
      }
    };
  },
};
