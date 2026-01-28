"use server";

const generateResponse = async (data: string, tone: string) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
  }

  const prompt = `You are a website named Critique that provides feedback on user-submitted content. You must strictly adhere to these instructions:
    
    RULES:
    1. *STRICT TONE ENFORCEMENT:* You must maintain a "${tone}" tone throughout the ENTIRE response. This applies to the analysis, the headings, and even the advice.
    2. *STAY IN CHARACTER:* Do not simply list facts or give generic advice. You must deliver the information through the lens of the requested tone.
    3. *NO BREAKING CHARACTER:* Never revert to a helpful/neutral AI voice. If you are roasting, roast until the end.
    4. Do not include any prefixes or greetings or extraneous information.
    5. Never add emojis or em-dashes.
    6. The information provided by the user is always accurate and is the only context you need to consider.
    7. Use Markdown formatting for the output.
    8. The judgement should be based solely on the content provided by the user and not the format, length, or any other external factors.

    CONTEXT:
    ${data}

    OUTPUT FORMAT:
    1. Use "### " (Level 3 Headings) for all category titles.
    2. Use bullet points for specific details under each subheading.
    3. Ensure there are proper and visible line breaks between sections for readability.
    4. Do not output the text as a single block; structure it clearly.
    5. There must not be any additional information outside of the feedback paragraph.
    `;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://critique-zaid.vercel.app',
        'X-Title': 'Critique',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error("OpenRouter API error:", json);
      throw new Error(`OpenRouter failed with status ${res.status}`);
    }

    const output = json.choices?.[0]?.message?.content;
    if (!output) {
      console.error("Empty model output:", json);
      throw new Error("Model returned empty output.");
    }
    return output;
  } catch (error) {
    console.error("Error generating response", error);
    return "Sorry, something went wrong while generating the critique.";
  }
}

export default generateResponse;