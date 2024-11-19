import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb";
import { user, userdb } from "./types.ts";
import { getuserporemail, getuserpornombre, gettodo } from "./funciones.ts";


const url = Deno.env.get("URL");
if (!url){
  Deno.exit(1);
}

const client = new MongoClient(url);
const dbName = 'ExamenParcial';

await client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName); 
const usercollection = db.collection<userdb>('users');

const handler = async(req:Request):Promise<Response> =>{
  const method = req.method;
  const url = new URL(req.url)
  const path = url.pathname

  if (method === "GET"){  
    if (path === "/persona"){
      const param = url.searchParams.toString()

      if (param === "name"){
        return getuserpornombre(param, usercollection)
      }

      if (param === "email"){
        return getuserporemail(param, usercollection)
      }
      
      const usuarios = await usercollection.find().toArray()
      return new Response (JSON.stringify(usuarios))
    }


    return new Response ("Path incorrecto")
  }else if (method === "POST"){
    const body = await req.json()
    
    if (path === "/persona"){
      const comprobaremail = await usercollection.findOne({email : body.email})
      if (comprobaremail !== null){
        return new Response ("Ya hay alguien con ese email")
      }
      const comprobartlf = await usercollection.findOne({telefono : body.telefono})
      if (comprobartlf !== null){
        return new Response ("Ya hay alguien con ese numero de telefono")
      } 

      
      const am = body.amigos.toString()

      await usercollection.insertOne({
        nombre : body.nombre,
        email : body.email,
        telefono : body.telefono,
        amigos : am
      })

      const respuesta = await gettodo(body, usercollection);

      return new Response (JSON.stringify(respuesta))
    }

  }else if (method === "PUT"){
    const body = await req.json()

      if (path === "/persona"){
        
        await usercollection.updateOne({email : body.email}, {
          nombre : body.nombre,
          telefono : body.telefono,
          amigos : body.amigos
        })
        return new Response("Modificado")
      }

      return new Response ("path incorrecto")

  }else if (method === "DELETE"){
    const body = await req.json()

    if (path === "/persona"){
      
      const personaop = await usercollection.findOne({email : body.email});
      if (!personaop){
        return new Response ("No se ha encontrado la persona", {status :404})
      }

      await usercollection.deleteOne({email:body.email})
      return new Response ("Eliminado correctamente")
    }
    return new Response
  }

  return new Response("")
}

Deno.serve({port : 3000}, handler)