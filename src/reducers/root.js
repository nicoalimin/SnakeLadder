import { combineReducers, createAction, createReducer } from "@reduxjs/toolkit";
import { generateId } from "../utils/generateId";

// ----- Players ------
export const playersActions = {
    add: createAction("players/add"),
    delete: createAction("players/delete"),
}

export const gameActions = {

}

export const playersReducer = createReducer({}, builder => {
    builder
    .addCase(playersActions.add, (state, payload) => {
        const newId = generateId();
        state[newId] = {
            ...payload,
            id: newId,
        };
    })
    .addCase(playersActions.delete, (state, payload) => {
        delete state[payload.id];
    });
});

export const gameReducer = createReducer({}, builder => {

});

export const boardReducer = createReducer({}, builder => {

});