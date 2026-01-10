"use server"

import generateResponse from "@/lib/llm"

const testConnection = async (data:string, type:string)=>{
    const response = await generateResponse(data,type);
    return response;
}

export default testConnection;