import { ObjectId, OptionalId } from "mongodb";

export type tareas = {
    id : string,
    title : string,
    completed : boolean
} 

export type tareasdb = OptionalId<{
    title : string,
    completed : boolean
}>