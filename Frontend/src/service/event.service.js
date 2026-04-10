import {api} from "../lib/api.js";

export const fetchEvents=()=>{
    api.
    get("/events")
}
export const fetchEventById=(id)=> api.get(`/events/${id}`)
export const fetchNgoEvents=()=>api.get("/events/ngo/my-events")
export const addEvent=(payload)=>api.post("/events/add-event",payload)
export const volunteerForEvent=(id)=>api.post(`/events/${id}/volunteer`)
export const viewRegistrations=(id)=>api.post(`/events/${id}/view-registrations`)
