import types from "../types"
const initialState = {
    isLogedIn: false,
    userData: {}
}

const userReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case types.LOGIN: {
            return {
                ...state,
                isLogedIn: true,
                userData: payload
            }
        }
        case types.LOGOUT: {
            return {
                ...state,
                isLogedIn: false,
                userData: {}
            }
        }
        default: {
            return state
        }
      }
}
export default userReducer;