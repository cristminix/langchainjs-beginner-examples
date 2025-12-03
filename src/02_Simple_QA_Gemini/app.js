import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

// muat variabel lingkungan
import "dotenv/config"

const main = async () => {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_GEMINI_KEY,
  })
  console.log("Q & A Dengan AI")
  console.log("=============")

  const question = "Apa mata uang Bangladesh?"
  console.log(`Pertanyaan: ${question}`)

  const response = await llm.invoke(question)
  console.log(`Jawaban: ${response.content}`)
}

main().catch((e) => console.error(e))
