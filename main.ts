import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb";
import { tareas, tareasdb } from "./types.ts";
import { tareaporid } from "./funciones.ts";

const url = Deno.env.get("URL");
if (!url){
  Deno.exit(1);
}

const client = new MongoClient(url);
const dbName = 'P3BACKEND';

await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName); 
const taskcollection = db.collection<tareasdb>('tareas');

const handler = async(req:Request):Promise<Response> =>{
  const method = req.method;
  const url = new URL(req.url)
  const path = url.pathname

  if (method === "GET"){ 
    if (path === "/tasks"){
        const todastareas = await taskcollection.find().toArray();
        return new Response (JSON.stringify(todastareas))
    }else if (path.startsWith("/tasks/")){
      const id = path.replace("/tasks/", "").toString();
      return tareaporid(id, taskcollection);
    } 
    
    
  }else if (method === "POST"){
    const body = await req.json()
    if (path === "/tasks"){

      const {insertedId} = await taskcollection.insertOne({
        title : body.title,
        completed : false
      })

      return new Response (JSON.stringify(await taskcollection.findOne({
        _id: insertedId
      })))
    }
    
  }else if (method === "PUT"){
    const body = await req.json()
    if (path.startsWith("/tasks/")){
      const id = path.replace("/tasks/", "").toString();
      if (!id){
        return new Response(JSON.stringify({error : "No se ha encontrado el id"}))
      }
      const {upsertedId} = await taskcollection.updateOne({_id : new ObjectId(id)},{
        $set: {
          completed: body.completed
        }
      })

      return new Response (JSON.stringify(await taskcollection.findOne({
        _id: new ObjectId(id)
      })))

    } 


  }else if (method === "DELETE"){
    const body = await req.json()
    if (path.startsWith("/tasks/")){
      const id = path.replace("/tasks/", "").toString();
      if (!id){
        return new Response(JSON.stringify({error :"Tarea no encontrada"}))
      }
      
      await taskcollection.deleteOne({_id : new ObjectId(id)})
      return new Response(JSON.stringify({message: "Tarea eliminada correctamente"}))

    }
  }

  return new Response(JSON.stringify({error : "Path incorrecto"}))
}

Deno.serve({port : 3000}, handler)