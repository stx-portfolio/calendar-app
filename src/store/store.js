import { configureStore } from "@reduxjs/toolkit";
import { uiSlice, calendarSlice, authSlice } from "./";

export const store = configureStore({
    reducer: {
        auth:authSlice.reducer,
        ui: uiSlice.reducer,
        calendar: calendarSlice.reducer
    },
    //* No revise si las fechas se pueden serializar
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})