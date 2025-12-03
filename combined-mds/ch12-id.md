# BAB 13: CHAT DENGAN VIDEO YOUTUBE

Setelah mempelajari cara membuat AI berinteraksi dengan dokumen, mari lanjutkan dengan membuat aplikasi Chat dengan YouTube.

Untuk membuat aplikasi ini, Anda dapat menyalin aplikasi yang sudah selesai dari Bab 11 dan melakukan perubahan yang ditunjukkan pada bab ini.

Mari kita mulai!

## Menambahkan YouTube Loader

Aplikasi Chat dengan YouTube menggunakan teknik RAG untuk meningkatkan LLM dengan data transkrip video.

Untuk mendapatkan transkrip video YouTube, Anda perlu menginstal paket youtube-transcript dan youtubei.js menggunakan npm sebagai berikut:

`npm install youtube-transcript youtubei.js`

API ini digunakan oleh YouTube loader dari LangChain untuk mengambil transkrip video.

Di bagian atas file, impor kelas `YoutubeLoader` dari LangChain seperti ini:

```javascript
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube"
```

Kita akan meminta pengguna untuk memasukkan URL YouTube, lalu memproses URL tersebut untuk membuat embeddings dan rantai RAG.

Tepat di bawah inisiasi history, buat fungsi bernama `processUrl()` dengan konten berikut:

```javascript
const history = new ChatMessageHistory()

const processUrl = async (ytUrl) => {
  const loader = YoutubeLoader.createFromUrl(ytUrl)
  const docs = await loader.load()
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const chunks = await splitter.splitDocuments(docs)

  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_KEY })

  const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings)

  const retriever = vectorStore.asRetriever()

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizePrompt,
  })

  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  })

  const conversationalRagChain = new RunnableWithMessageHistory({
    runnable: ragChain,
    getMessageHistory: (sessionId) => history,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
    outputMessagesKey: "answer",
  })

  return conversationalRagChain
}
```

Fungsi `processUrl()` hanya memproses argumen `ytUrl` yang diberikan untuk membuat embeddings dan rantai RAG.

Anda perlu menghapus kode duplikat di luar fungsi yang melakukan proses yang sama.

Selanjutnya, buat loop while di bawah fungsi untuk meminta URL YouTube:

```javascript
let conversationalRagChain = null

while (!conversationalRagChain) {
  const { ytUrl } = await prompts([
    {
      type: "text",
      name: "ytUrl",
      message: "URL YouTube: ",
      validate: (value) => (value ? true : "URL YouTube tidak boleh kosong"),
    },
  ])

  conversationalRagChain = await processUrl(ytUrl)
}
```

Loop akan berjalan selama `conversationalRagChain` bernilai null.

Setelah URL diproses, buat loop while lain untuk meminta pertanyaan dari pengguna:

```javascript
console.log("Video telah diproses. Ajukan pertanyaan Anda")
console.log("Ketik /bye untuk menghentikan program")

let exit = false
while (!exit) {
  const { question } = await prompts([
    {
      type: "text",
      name: "question",
      message: "Pertanyaan Anda: ",
      validate: (value) => (value ? true : "Pertanyaan tidak boleh kosong"),
    },
  ])
  if (question == "/bye") {
    console.log("Sampai jumpa!")
    exit = true
  } else {
    const response = await conversationalRagChain.invoke(
      { input: question },
      {
        configurable: {
          sessionId: "test",
        },
      }
    )
    console.log(response.answer)
  }
}
```

Aplikasi sekarang sudah selesai. Anda dapat menjalankan aplikasi dan mengujinya.

Misalnya, saya memasukkan URL video saya di https://youtu.be/Sr4KeW078P4 yang menjelaskan sintaks JavaScript Promise:

Gambar 38. Hasil Aplikasi Tanya YouTube

![Gambar dari halaman PDF 115](images/page_115_img_0_X13.jpg)

Anda dapat memasukkan tautan pendek YouTube atau tautan lengkap. Itu akan bekerja seperti yang ditunjukkan di atas.

## Menangani Error Transkrip Tidak Ada

Karena video musik YouTube tidak memiliki transkrip, Anda akan mendapatkan error saat memberikan salah satunya ke aplikasi.

Berikut adalah pesan error yang ditampilkan ketika saya memasukkan video Taylor Swift di https://youtu.be/q3zqJs7JUCQ:

```
Error: Failed to get YouTube video transcription: [YoutubeTranscript] (cid:0) Transcript is disabled on this video (q3zqJs7JUCQ)
```

Error ini terjadi karena transkrip dinonaktifkan untuk video musik.

Anda juga mendapatkan error saat memasukkan URL non-YouTube seperti ini:

```
URL YouTube: https://amazon.com

Error: Failed to get youtube video id from the url
```

Untuk mencegah kedua error tersebut, Anda perlu membungkus badan fungsi dalam blok try..catch sebagai berikut:

```javascript
const processUrl = async (ytUrl) => {
  try {
    const loader = YoutubeLoader.createFromUrl(ytUrl)

    // ...

    return conversationalRagChain
  } catch (error) {
    console.log("Bukan URL YouTube atau video tidak memiliki transkrip. Silakan coba URL lain")
    return null
  }
}
```

Dengan cara ini, pesan error ditampilkan ketika video tidak memiliki transkrip, dan pengguna dapat memasukkan URL yang berbeda:

```
URL YouTube: https://amazon.com
Bukan URL YouTube atau video tidak memiliki transkrip. Silakan coba URL lain
```

Tanpa transkrip, kita tidak dapat menghasilkan data vektor.

## Ringkasan

Kode untuk bab ini tersedia di folder `13_Chat_With_Youtube` dari kode sumber buku.

Dalam bab ini, Anda telah belajar cara membuat aplikasi Chat dengan YouTube yang mengambil transkrip video YouTube menggunakan URL, lalu mengubah transkrip tersebut menjadi vektor, yang dapat digunakan untuk meningkatkan pengetahuan LLM.

Dengan menggunakan AI, Anda dapat meminta poin-poin penting atau ringkasan dari video panjang tanpa harus menonton video itu sendiri.
