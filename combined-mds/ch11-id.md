# BAB 12: MENGUPLOAD BERBAGAI JENIS DOKUMEN

Sekarang kita bisa memuat dokumen .txt di LangChain, mari tingkatkan aplikasi agar dapat memuat jenis atau format dokumen lain, seperti .docx dan .pdf.

Untuk memuat berbagai format file, Anda perlu mengimpor loader untuk setiap format sebagai berikut:

```javascript
import { TextLoader } from "langchain/document_loaders/fs/text"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx"
```

Selanjutnya, Anda perlu memeriksa ekstensi dokumen dan memuat dokumen menggunakan loader yang sesuai.

Tepat di bawah pembuatan llm, tentukan lokasi file yang ingin digunakan sebagai variabel filePath, lalu dapatkan ekstensi dokumen menggunakan metode `path.extname()`:

```javascript
import path from "path"

// ...

const filePath = "./python.pdf"
const extension = path.extname(filePath)

let loader = null

if (extension === ".txt") {
  loader = new TextLoader(filePath)
} else if (extension === ".pdf") {
  loader = new PDFLoader(filePath)
} else if (extension === ".docx") {
  loader = new DocxLoader(filePath)
} else {
  throw new Error("Format dokumen tidak didukung")
}

const docs = await loader.load()
```

Kode di atas menggunakan file `'python.pdf'` yang bisa Anda dapatkan dari folder kode sumber.

Setelah Anda mendapatkan string ekstensi, Anda perlu memeriksa nilainya untuk membuat loader yang tepat.

Ketika format dokumen tidak didukung, lempar error untuk menghentikan aplikasi.

Loader LangChain bergantung pada paket Node. Anda perlu menginstal mammoth untuk memuat file .docx dan pdf-parse untuk memuat file .pdf:

`npm install mammoth pdf-parse`

Setelah loader dibuat, Anda dapat memuat dan membagi dokumen menjadi potongan‑potongan (chunks), mengubah potongan menjadi vektor, dan membuat rantai (chains) seperti pada bab sebelumnya:

```javascript
const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})

const chunks = await splitter.splitDocuments(docs)

// sisanya sama...
```

Dan selesai. Sekarang Anda dapat mengunggah dokumen .txt, .docx, atau .pdf dan mengajukan pertanyaan yang relevan dengan isi dokumen.

Untuk mengganti dokumen yang ingin diunggah, Anda hanya perlu mengubah variabel filePath ke lokasi dokumen.

Jika Anda mengunggah dokumen yang tidak didukung, Node akan menampilkan error 'Format dokumen tidak didukung'.

## Ringkasan

Kode untuk bab ini tersedia di folder `12_Uploading_Different_Document_Types` dari kode sumber buku.

Dalam bab ini, Anda telah meningkatkan aplikasi Chat With Document lebih lanjut dengan membuat antarmuka untuk mengunggah file, lalu memuat dokumen menggunakan loader yang berbeda, tergantung pada jenis dokumen.

Di bab berikutnya, saya akan menunjukkan cara mengobrol dengan video YouTube. Sampai jumpa di sana!
