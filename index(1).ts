const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8000 || 3000;


async function getBuffer(url, options) {
    try {
        options ? options: {};
        const res = await require("axios")({
            method: "get",
            url,
            headers: {
                DNT: 1,
                "Upgrade-Insecure-Request": 1,
            },
            ...options,
            responseType: "arraybuffer",
        });
        return res.data
    } catch (e) {
        console.log(`Error : ${e}`);
    }
       };

const voidi = {
  "0": "NywyOCw2LDUzLDM4LDU1LDM4LDYxLDgsMjYsMTksMjEsMjUsMjksMzQsNDEsOCwzMiw4LDM1LDM1LDQ5LDI4LDI2LDIwLDI0LDUyLDQ2LDY2LDQ5LDE2LDU5LDM1LDM0LDQ2LDUyLDU5LDQ1LDYxLDIxLDk=",
  "1": "IrHUN6Xe07oKmLT5SihqEOuckvDY8Vsf42MFGwP9JCdzZxylbApjRQn1taB3gW",
  "f": ["0", "", 1, 36, 5, 1, ","],
  "r": ["youtube-mp36.p.", "3fb448bb80mshb8219b06208d8c8p179be5jsndaed67c1144f"]
};

function atobSafe(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}

function k(e) {
  const data = atobSafe(voidi["0"]).split(voidi.f[6]);
  const reversed = voidi["1"].split("").reverse().join("");
  for (let t = 0; t < data.length; t++) {
    e += reversed[data[t] - voidi.f[4]];
  }
  return voidi.f[2] === 1 ? e.toLowerCase() : voidi.f[2] === 2 ? e.toUpperCase() : e;
}

async function api(videoId) {
  const endpoint = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}&_=${Math.random()}`;
  const headers = {
    'x-rapidapi-host': voidi.r[0] + "rapidapi.com",
    'x-rapidapi-key': voidi.r[1],
  };

  try {
    const res = await axios.get(endpoint, { headers });
    const data = res.data;
    let bb = await getBuffer(data.link);
    if (data.status === "ok") {
      return { title: data.title, link: data.link , buffer: bb };
    } else if (data.status === "processing") {
      return api(videoId);
    } else {
      throw new Error("Error fetching video");
    }
  } catch (error) {
    throw new Error("API request failed");
  }
}

async function toVideo(url) {
  const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  if (!match) throw new Error("Invalid YouTube URL");
  return await api(match[1]);
}


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL parameter" });

  try {
    const videoData = await toVideo(url);
    res.json(videoData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
