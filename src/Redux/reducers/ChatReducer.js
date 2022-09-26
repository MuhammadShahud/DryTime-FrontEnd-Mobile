import { ActionTypes } from '../action_types';

const initialState = {
    chat_list: { data: [], next_url: null },
    messages: { data: [], next_url: null },
    sending: false
};

export const ChatReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GetChatList:
            state = { ...state, chat_list: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreChatList:
            state = { ...state, chat_list: { data: [...state.chat_list.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.UpdateChatList:
            let updated_chatlist = [...state.chat_list.data];
            updated_chatlist[action.index].last_message = {
                message: action.payload,
                time: new Date().toISOString()
            };
            state = { ...state, chat_list: { ...state.chat_list, data: updated_chatlist } };
            break;
        case ActionTypes.GetMessages:
            state = { ...state, messages: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreMessages:
            state = { ...state, messages: { data: [...state.messages.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.SendMessages:
            state = { ...state, messages: { ...state.messages, data: [action.payload, ...state.messages.data] } };
            break;
        case ActionTypes.SendingMessage:
            state = { ...state, sending: action.payload };
            break;
        default:
            break;
    }
    return state;
};
