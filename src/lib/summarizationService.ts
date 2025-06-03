import redactPHI from "./redactPHI";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "mistralai/mistral-7b-instruct";

// --- Summarization Service Function ---
export async function summarizeText(text: string): Promise<string> {
  console.log("Processing and summarizing PDF...", text);

  const textContent = redactPHI(text);

  console.log("Redacted Text:", textContent);

  try {
    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: `You are a doctor explaining a medical report to a patient. 
              MOST IMPORTANT:.
                DO NOT INCLUDE ANY PHI.
                DO NOT INCLUDE ANY PHONE NUMBERS.
                DO NOT INCLUDE ANY ADDRESSES.
                DO NOT INCLUDE ANY EMAIL ADDRESSES.
                DO NOT INCLUDE ANY SOCIAL SECURITY NUMBERS.
                DO NOT INCLUDE ANY MEDICAL RECORD NUMBERS.
                DO NOT INCLUDE ANY HEALTH INSURANCE NUMBERS.
                DO NOT INCLUDE ANY REDACTED DATA.

              WHAT YOU NEED TO DO:
                Please read the provided report and explain what it means in simple, everyday language.
                Focus on the key findings and any recommended next steps.
                Be accurate and do not add any information not in the report.
                exclude any PHI as per HIPPA regulations.
               `,
            },
            {
              role: "system",
              content: `CONTEXT: heres the report data in raw format: 
              ${textContent} 
              `,
            },
            {
              role: "user",
              content: `Please explain this to me as if I were a patient. What does it say, and what should I do next?`,
            },
          ],
          // Consider adjusting temperature for more or less "human-like" explanation
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error("OpenRouter API error in service:", errorData);
      throw new Error(
        errorData.error?.message ||
          `OpenRouter API request failed with status ${aiResponse.status}`
      );
    }

    const aiData = await aiResponse.json();

    const summary = aiData.choices[0]?.message?.content?.trim();
    if (!summary) {
      throw new Error("Could not retrieve summary from AI.");
    }

    return summary;
  } catch (error) {
    throw error;
  }
}
