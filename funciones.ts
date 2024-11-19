import { ObjectId } from "mongodb";
import { Collection } from "mongodb";
import { user, userdb } from "./types.ts";

export const getuserpornombre = async(
    name : string,
    usercollection : Collection<userdb>
):Promise<Response>=>{
    const usuarios = await usercollection.find({nombre : name}).toArray()
    if (usuarios.length===0){
        return new Response("NO se ha encontrado", {status:404})
    }
    return new Response (JSON.stringify(usuarios))
}

export const getuserporemail = async(
    email : string,
    usercollection : Collection<userdb>
):Promise<Response>=>{  
    const usuarios = await usercollection.findOne({email : email})

    return new Response (JSON.stringify(usuarios))
}

export const gettodo = async(
    usuario : user,
    usercollection : Collection<userdb>
) : Promise<user>=>{
    
    const datosdelamigo = await usercollection.find({nombre : usuario.amigos}).toArray().toString()

    return ({
        nombre : usuario.nombre,
        email : usuario.email,
        telefono : usuario.telefono,
        amigos : datosdelamigo
    })

}
