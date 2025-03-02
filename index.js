const express = require('express');
const puppeteer = require('puppeteer');
const { savetube } = require("./resources/functions");

const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/download', async (req, res) => {
    const { url, quality } = req.query;
    if (!url) return res.status(400).json({ error: "Missing URL parameter" });

    const videoQuality = quality || "720";

    try {
        // Fetch video URL
        const data = await savetube.download(url, videoQuality);
        console.log("savetube response:", data); // Debug log

        if (!data || !data.result || !data.result.download) {
            return res.status(500).json({ error: "Invalid response from savetube" });
        }

        const videoUrl = data.result.download;
        console.log("Extracted video URL:", videoUrl); // Debug log

        // Open in Puppeteer
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(videoUrl, { waitUntil: 'networkidle2' });

        // Redirect user
        res.redirect(videoUrl);

        setTimeout(() => browser.close(), 30000);
    } catch (error) {
        console.error("Error:", error); // Log full error
        res.status(500).json({ error: "Failed to fetch video URL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
