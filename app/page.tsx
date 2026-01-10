"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import testConnection from "./actions";
import { toast } from "sonner";

export default function Home() {

  const [text,setText]=useState("");


  return (
    <div className="flex flex-col gap-4 min-h-screen justify-center items-center font-sans">
      <h1 className="text-4xl">CRITIQUE</h1>

      <Textarea className="w-1/2" value={text} onChange={(e)=>setText(e.target.value)}></Textarea>

      <Button onClick={async ()=>{
        try{
          const response = await testConnection(text,"roast");
          toast.success(response);
        }catch (err){
          toast.error("Error genenrating response");
        }
      }}>
        Submit
      </Button>
      
    </div>
  );
}
