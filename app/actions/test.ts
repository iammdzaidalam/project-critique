"use server"

import generateResponse from "@/lib/llm"

const testConnection = async (data:string, type:string)=>{
    try{
        const response = await generateResponse(data,type);
        return response;
    }catch(error){
        console.error(error);
    }
}

export default testConnection;