const express = require('express');
const axios = require('axios');
const { savetube } = require("./resources/functions");
const { trt } = require("./resources/lang");
const app = express();
const PORT = 80;




app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get("/translate", async (req, res) => {
    const { text, lang = "en" } = req.query;

    if (!text) {
        return res.status(400).json({ error: "I need a text" });
    }

    try {
        let trt_text = await trt(text, lang);
        res.send(trt_text);
    } catch (error) {
        res.status(500).json({ error: "Translation failed", details: error.message });
    }
});


app.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL parameter" });    
    
    try {
        const data = await savetube(url);
        return res.send(data);
        /*
        const videoStream = await axios({
        url: data.result.download,
        method: 'GET',
        responseType: 'stream',
        headers: {
       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
   });



        res.setHeader('Content-Type', options ? 'audio/mpeg' : 'video/mp4');
        videoStream.data.pipe(res);
        */
    } catch (error) {
        res.status(500).json({ error: error });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
