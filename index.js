const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
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
        // Download video to temporary file
        const tmpFilePath = path.join(__dirname, 'temp_video.mp4');
        const file = fs.createWriteStream(tmpFilePath);

        const protocol = videoUrl.startsWith('https') ? https : http;

        protocol.get(videoUrl, (response) => {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();  // Close the file after download is finished

                // Set response headers
                res.setHeader('Content-Type', options ? 'audio/mpeg' : 'video/mp4');
                res.setHeader('Content-Disposition', 'attachment; filename="temp_video.mp4"');
                
                // Send the temporary video file
                res.sendFile(tmpFilePath, (err) => {
                    if (err) {
                        console.error("Error sending file:", err);
                        res.status(500).json({ error: "Failed to send video file" });
                    }
                    // Clean up the file after it's sent
                    fs.unlink(tmpFilePath, (err) => {
                        if (err) {
                            console.error("Error deleting temp file:", err);
                        }
                    });
                });
            });
        }).on('error', (err) => {
            console.error("Error downloading video:", err);
            res.status(500).json({ error: "Failed to download video" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch video URL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
