import { ObjectId } from "mongodb";

export type user = {
    nombre : string,
    email : string,
    telefono : string
    amigos : string
} 

export type userdb = {
    nombre : string,
    email : string,
    telefono : string
    amigos : ObjectId[]
}