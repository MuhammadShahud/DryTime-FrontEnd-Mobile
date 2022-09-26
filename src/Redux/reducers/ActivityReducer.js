/* eslint-disable prettier/prettier */
import { ActionTypes } from '../action_types';

const initialState = {
    sober_activity: { data: [], next_url: null },
    suicide_help_links: [],
    forum_topics: [],
    therapists: { data: [], next_url: null },
    rehabs: { data: [], next_url: null },
    patients: { data: [], next_url: null },
    music: { data: [], next_url: null },
    yoga_classes: { data: [], next_url: null },
    sponsor_rehabs: { data: [], next_url: null },
    sponsor_events: { data: [], next_url: null },
    schedules: { data: [], next_url: null },
    meetings: { data: [], next_url: null },
    dates: []
    //exercises: { data: [], next_url: null },
    // reading: { data: [], next_url: null },
    // playing: { data: [], next_url: null },
    // learning: { data: [], next_url: null },
    // cooking: { data: [], next_url: null },

};

export const ActivityReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.EmptySoberActivity:
            state = { ...state, sober_activity: { data: [], next_url: null } };
            break;
        case ActionTypes.GetSoberActivity:
            state = { ...state, sober_activity: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreSoberActivity:
            state = { ...state, sober_activity: { data: [...state.sober_activity.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetSuicideLinks:
            state = { ...state, suicide_help_links: action.payload };
            break;
        case ActionTypes.GetForumTopics:
            state = { ...state, forum_topics: action.payload };
            break;
        case ActionTypes.GetAllTherapist:
            state = { ...state, therapists: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreAllTherapist:
            state = { ...state, therapists: { data: [...state.therapists.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetRehabs:
            state = { ...state, rehabs: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreRehabs:
            state = { ...state, rehabs: { data: [...state.rehabs.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetPatients:
            state = { ...state, patients: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMorePatients:
            state = { ...state, patients: { data: [...state.patients.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetMusic:
            state = { ...state, music: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreMusic:
            state = { ...state, music: { data: [...state.music.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetYogaClasses:
            state = { ...state, yoga_classes: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreYogaClasses:
            state = { ...state, yoga_classes: { data: [...state.yoga_classes.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetSponseeRehabs:
            state = { ...state, sponsor_rehabs: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreSponseeRehabs:
            state = { ...state, sponsor_rehabs: { data: [...state.sponsor_rehabs.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetSponsorEvents:
            state = { ...state, sponsor_events: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreSponsorEvents:
            state = { ...state, sponsor_events: { data: [...state.sponsor_events.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetSchedules:
            state = { ...state, schedules: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreSchedules:
            state = { ...state, schedules: { data: [...state.schedules.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.GetMeeting:
            state = { ...state, meetings: { data: action.payload, next_url: action.next_url } };
            break;
        case ActionTypes.GetMoreMeeting:
            state = { ...state, meetings: { data: [...state.meetings.data, ...action.payload], next_url: action.next_url } };
            break;
        case ActionTypes.DeleteMeeting:
            let meetings = { ...state.meetings };
            meetings.data.splice(action.index, 1);
            state = { ...state, meetings };
            break;
        case ActionTypes.DeleteSoberActivity:
            let activities = { ...state.sober_activity };
            activities.data.splice(action.index, 1);
            state = { ...state, sober_activity: activities };
            break;
        case ActionTypes.DeleteClass:
            let classes = { ...state.yoga_classes };
            classes.data.splice(action.index, 1);
            state = { ...state, yoga_classes: classes };
            break;
        case ActionTypes.GetSchedulesDate:
            state = { ...state, dates: action.payload };
            break;
        default:
            break;
    }
    return state;
};
   // case ActionTypes.GetExercises:
        //     state = { ...state, exercises: { data: action.payload, next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetMoreExercises:
        //     state = { ...state, exercises: { data: [...state.exercises.data, ...action.payload], next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetReading:
        //     state = { ...state, reading: { data: action.payload, next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetMoreReading:
        //     state = { ...state, reading: { data: [...state.reading.data, ...action.payload], next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetPlaying:
        //     state = { ...state, playing: { data: action.payload, next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetMorePlaying:
        //     state = { ...state, playing: { data: [...state.playing.data, ...action.payload], next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetLearning:
        //     state = { ...state, learning: { data: action.payload, next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetMoreLearning:
        //     state = { ...state, learning: { data: [...state.learning.data, ...action.payload], next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetCooking:
        //     state = { ...state, cooking: { data: action.payload, next_url: action.next_url } };
        //     break;
        // case ActionTypes.GetMoreCooking:
        //     state = { ...state, cooking: { data: [...state.cooking.data, ...action.payload], next_url: action.next_url } };
        //     break;