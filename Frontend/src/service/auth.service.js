import {api} from "../lib/api.js"

export const loginVolunteer = async (payload) => {
   const res = await api.post("/users/login-user", payload)
   return res.data
}
export const registerVolunteer = async (payload) => {
    const res = await api.post("/users/register-user", payload)
    return res.data
}
export const logoutVolunteer = async () => {
    const res = await api.post("/users/logout-user")
    return res.data
}

export const loginNGO = async (payload) => {
    const res = await api.post("/ngos/login-ngo", payload)
    return res.data
}
export const registerNGO = async (payload) => {
    const res = await api.post("/ngos/register-ngo", payload)
    return res.data
}
export const logoutNGO = async () => {
    const res = await api.post("/ngos/logout-ngo")
    return res.data
}