import React from 'react'
import { Navigate } from 'react-router-dom'

export default function Protected({ children }) {
    if (localStorage.getItem("Token") == null) {
        return <><Navigate to={"/"} /></>
    }
    else {
        return children
    }

}
