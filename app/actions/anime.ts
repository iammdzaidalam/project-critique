"use server";

import { getTopAnime } from "@/lib/anime";
import { Tone } from "../page";
import generateResponse from "@/lib/llm";

export default async function analyzeAnime({username, tone}:{username:string, tone:Tone}){
    const data = await getTopAnime({username});
    if(!data){
        throw new Error("Failed to fetch Anime data");
    }
    interface AnimeNode {
        node: {
            title: string;
        }
    }
    const animeTitles=data.map((anime: AnimeNode)=> anime.node.title).join(",");
    const feedback=generateResponse(`list of top anime: ${animeTitles}`,tone);
    return feedback;
}