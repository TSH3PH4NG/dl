const express = require('express');
const axios = require('axios');
const { savetube } = require("./resources/functions");
const app = express();
const PORT = 80;




app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/download', async (req, res) => {
    const { url , quality , type } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL parameter" });


    const  options = type === "audio";
    const videoQuality = quality || "720" ;
    
    
    try {
        const data = await savetube.download(url,videoQuality);
        const videoStream = await axios({
            url: data.result.download,
            method: 'GET',
            responseType: 'stream'
        });


        res.setHeader('Content-Type', options ? 'audio/mpeg' : 'video/mp4');
        videoStream.data.pipe(res);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
