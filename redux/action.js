import types from "./types";

export const loginAction = userData => dispatch => {
    localStorage.setItem("hasasaUserData", JSON.stringify(userData))
    dispatch({
        type: types.LOGIN,
        payload: userData
    })
}

export const logoutActions = () => dispatch => {
    
    localStorage.removeItem('hasasaUserData')
    dispatch({type: types.LOGOUT})
}