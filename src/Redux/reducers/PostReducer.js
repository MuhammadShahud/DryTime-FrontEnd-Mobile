/* eslint-disable prettier/prettier */
import { ActionTypes } from '../action_types';

const initialState = {
  trending_posts: [],
  my_posts: { data: [], next_url: null },
  others_posts: { data: [], next_url: null },
  all_posts: [],
  comment: { data: [], next_url: null },
  likes: []
};

export const PostReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GetTrendingPost:
      state = { ...state, trending_posts: action.payload };
      break;
    case ActionTypes.UsersPost:
      state = { ...state, my_posts: { data: action.payload, next_url: action.next_url } };
      break;
    case ActionTypes.MoreUsersPost:
      state = { ...state, my_posts: { data: [...state.my_posts.data, ...action.payload], next_url: action.next_url } };
      break;
    case ActionTypes.OthersPost:
      state = { ...state, others_posts: { data: action.payload, next_url: action.next_url } };
      break;
    case ActionTypes.MoreOthersPost:
      state = { ...state, others_posts: { data: [...state.others_posts.data, ...action.payload], next_url: action.next_url } };
      break;
    case ActionTypes.GetAllComments:
      state = { ...state, comment: { data: action.payload, next_url: action.next_url } };
      break;
    case ActionTypes.MyPostLikes:
      state = { ...state, likes: action.payload };
      break;
    case ActionTypes.GetMoreComments:
      state = { ...state, comment: { data: [...state.comment.data, ...action.payload], next_url: action.next_url } };
      break;
    case ActionTypes.AddComments:
      state = { ...state, comment: { ...state.comment, data: [...[action.payload], ...state.comment.data] } };
      break;
    case ActionTypes.DeleteComment:
      let new_state = { ...state.comment };
      let index = new_state.data.findIndex((value) => value.id == action.payload);
      new_state.data.splice(index, 1);
      state = { ...state, comment: new_state };
      break;
    case ActionTypes.DeleteMyPost:
      let new_my_posts = { ...state.my_posts };
      let p_index = new_my_posts.data.findIndex((value) => value.id == action.payload);
      new_my_posts.data.splice(p_index, 1);
      state = { ...state, my_posts: new_my_posts };
      break;
    case ActionTypes.LikePost:
      let new_posts = { ...state.others_posts };
      let s_item = new_posts.data.find((value) => value.id == action.payload);
      s_item.has_liked = !s_item.has_liked;
      state = { ...state, others_posts: new_posts };
      break;
    case ActionTypes.PromoteMyPost:
      let myPosts = { ...state.my_posts };
      let npItem = myPosts.data.find((value) => value.id == action.payload);
      npItem.is_promote = 1;
      state = { ...state, my_posts: myPosts };
      break;
    default:
      break;
  }
  return state;
};
