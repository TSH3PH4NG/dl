const express = require('express');
const puppeteer = require('puppeteer');
const { savetube } = require("./resources/functions");

const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/download', async (req, res) => {
    const { url, quality, type } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL parameter" });

    const videoQuality = quality || "720";

    try {
        // Get the video URL using savetube
        const data = await savetube.download(url, videoQuality);
        const videoUrl = data.result.download;

        // Launch Puppeteer and open the video URL in a browser
        const browser = await puppeteer.launch({ headless: false }); // Set headless: false to show the browser
        const page = await browser.newPage();
        await page.goto(videoUrl, { waitUntil: 'networkidle2' });

        // Redirect user to the video URL
        res.redirect(videoUrl);

        // Optionally close the browser after a delay (to let the user see the video)
        setTimeout(() => browser.close(), 30000);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch video URL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

