const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
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

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // For server environments
    });

    const page = await browser.newPage();

    // Mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the video URL (Cloudflare will handle the challenge here)
    await page.goto(videoUrl, { waitUntil: 'domcontentloaded' });

    // Wait for the video to load
    await page.waitForSelector('video');

    // Get the video element's source URL
    const videoSrc = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return videoElement ? videoElement.src : null;
    });

    if (!videoSrc) {
      await browser.close();
      return res.status(500).json({ error: "Video source not found" });
    }

    // Download the video using stream and pipe to the response
    const videoStream = await page.goto(videoSrc);
    res.setHeader('Content-Type', 'video/mp4');
    videoStream.body.pipe(res);

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: `Failed error: ${e}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
