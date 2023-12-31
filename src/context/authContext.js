import React, { useReducer, createContext} from "react";  

import jwtDecode from "jwt-decode"
import { act } from "react-dom/test-utils";

const initialState = {
    user: null
}

if(localStorage.getItem("token")){
    const decodeToken = jwtDecode(localStorage.getItem("token"));

    if(decodeToken.exp * 1000 < Date.now()){
        localStorage.removeItem("token");
    }else{
        initialState.user = decodeToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
});

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (userData) =>{
        localStorage.setItem("token", userData.token);

        dispatch({
            type: 'LOGIN',
            payload: userData
        })

    }

    function logout(){
        localStorage.removeItem("token");
        dispatch({ type: 'LOGOUT'})
    }

    return (
        <AuthContext.Provider 
            value={{user: state.user, login, logout, codigo: state.codigo}}
            {...props}
        />
    )

}

export { AuthContext, AuthProvider};