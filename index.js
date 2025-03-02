const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/download', async (req, res) => {
    const { quality, type } = req.query;
    
    // Directly set the video URL
    const videoUrl = "https://cdn72.savetube.su/media/uJdu4Lfy8aI/set-fire-to-the-rain-720-ytshorts.savetube.me.mp4";
    
    if (!videoUrl) return res.status(400).json({ error: "Missing video URL" });

    const options = type === "audio";
    
    try {
        // Redirect user to the video URL directly
        res.redirect(videoUrl);
    } catch (error) {
        console.error("Error:", error); 
        res.status(500).json({ error: "Failed to fetch video URL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
