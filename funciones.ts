import { ObjectId } from "mongodb";
import { Collection } from "mongodb";
import { tareas, tareasdb } from "./types.ts";


export const tareaporid = async(
    id : string,
    taskcollection : Collection<tareasdb>
):Promise<Response> => {
    const tarea = await taskcollection.findOne({_id : new ObjectId(id)})

    if(!tarea){
        return new Response (JSON.stringify({error : "Tarea no encontrada"}))
    }
    

    return new Response (JSON.stringify(tarea))
}