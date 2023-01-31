import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { onLogin, onLogout, onChecking, clearErrorMessage, onLogoutCalendar } from "../store";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking())
        try {

            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token-init-date', new Date().getTime());
            localStorage.setItem('token', data.token);
            dispatch(onLogin({ name: data.name, uid: data.uid }))
        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'))
            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10);
        }

    }


    const startRegister = async ({ name, email, password }) => {
        dispatch(onChecking())
        try {

            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            localStorage.setItem('token-init-date', new Date().getTime());
            localStorage.setItem('token', data.token);
            dispatch(onLogin({ name: data.name, uid: data.uid }))
        } catch (err) {
            const { data } = err.response;
            dispatch(onLogout(data?.msg || ''))
            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10);
        }

    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = calendarApi.get('/auth/renew')
            console.log(data)
            localStorage.setItem('token-init-date', new Date().getTime());
            localStorage.setItem('token', data.token);
            dispatch(onLogin({ name: data.name, uid: data.uid }))
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout())
        }
    }

    const startLogout = ()=>{
        localStorage.clear();
        dispatch(onLogout())
        dispatch(onLogoutCalendar())
    }

    return {
        //* Propiedades
        status,
        errorMessage,
        user,
        //* Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }
}