import {authAPI} from '../api/api';
import {AppThunkType} from './redux-store';
import {stopSubmit} from 'redux-form';

export type AuthDataType = {
    id: number | null
    email: string | null
    login: string | null
}
export type AuthType = {
    id: number | null
    email: string | null
    login: string | null
    isAuth: boolean
}
export type SetUserDataActionType = ReturnType<typeof setAuthUserData>;

export type AuthActionType = SetUserDataActionType

let initialState: AuthType = {
    id: null,
    email: null,
    login: null,
    isAuth: false
}

const SET_USER_DATA = 'auth/SET_USER_DATA'

export const authReducer = (state: AuthType = initialState, action: AuthActionType): AuthType => {
    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export const setAuthUserData = (id: number | null, email: string | null, login: string | null, isAuth: boolean) => ({
    type: SET_USER_DATA,
    payload: {
        id,
        email,
        login,
        isAuth
    }
} as const)

export const getAuthUserData = (): AppThunkType => async dispatch => {
    let response = await authAPI.me()

    if (response.data.resultCode === 0) {
        let {id, login, email} = response.data.data
        dispatch(setAuthUserData(id, email, login, true))
    }
}

export const login = (email: string, password: string, rememberMe: boolean): AppThunkType => async dispatch => {
    let response = await authAPI.login(email, password, rememberMe)

    if (response.data.resultCode === 0) {
        dispatch(getAuthUserData())
    } else {
        let message = response.data.messages.length > 0 ? response.data.messages[0] : 'Some error'
        dispatch(stopSubmit('login', {_error: message}))
    }
}

export const logout = (): AppThunkType => async dispatch => {
    let response = await authAPI.logout()
    if (response.data.resultCode === 0) {
        dispatch(setAuthUserData(null, null, null, false))
    }
}
