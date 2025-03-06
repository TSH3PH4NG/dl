/* © Tshepang && Olduser*/

const axios = require('axios');
const crypto = require('crypto');

const COMMON_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'Origin': 'https://yt.savetube.me',
  'Referer': 'https://yt.savetube.me/',
  'User-Agent': 'Mozilla/5.0 (Android 12; Mobile; rv:135.0) Gecko/135.0 Firefox/135.0',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
};

// Fetch CDN data
async function getCDN() {
  const response = await axios.get('https://media.savetube.me/api/random-cdn', { headers: COMMON_HEADERS });
  return response.data.cdn;
}

// Decrypt data using AES-128-CBC
async function decrypt(datam) {
  try {
    const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
    const data = Buffer.from(datam, 'base64');
    const iv = data.slice(0, 16);
    const content = data.slice(16);
    const key = Buffer.from(await secretKey.match(/.{1,2}/g).join(''), 'hex');
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(content);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
  } catch (error) {
    throw new Error(error.message);
  }
}


async function getData(link) {
  const cdn = await getCDN();
  try {
    const response = await axios.post(`https://${cdn}/v2/info`, { url: link }, { headers: { ...COMMON_HEADERS, 'Content-Type': 'application/json' } });
    return await decrypt(response.data.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
}

async function downloadAud(cdn, key, aud) {
  const results = {};
  for (const format of aud) {
    const q = format.quality;
    try {
      const response = await axios.post(
        `https://${cdn}/download`,
        { downloadType: 'audio', quality: q, key },
        { headers: COMMON_HEADERS }
      );
      results[q] = response.data.data.downloadUrl;
    } catch (error) {
      console.error('Error downloading audio:', error);
      return error;
    }
  }
  return results;
}


async function downloadVid(cdn, key, quality = [
  { height: 338, width: 640, quality: 360, label: '360p' },
  { height: 676, width: 1280, quality: 720, label: '720p' },
  { height: 1012, width: 1920, quality: 1080, label: '1080p' },
]) {
  const results = {};
  for (const format of quality) {
    const q = format.quality;
    try {
      const response = await axios.post(
        `https://${cdn}/download`,
        { downloadType: 'video', quality: q, key },
        { headers: COMMON_HEADERS }
      );
      results[q] = response.data.data.downloadUrl;
    } catch (error) {
      console.error('Error downloading video:', error);
      return error;
    }
  }
  return results;
}

// Main function to download audio and video, and return the results
async function savetube(url) {
  try {
    const response = await getData(url);
    if (!response || response instanceof Error) throw new Error(response);

    const { key, thumbnail, title, duration, durationLabel, audio_formats  } = response;
    const cdn = await getCDN();

    // Ensure audio_formats is an array before passing it
    const audioLinks = await downloadAud(cdn, key, audio_formats ) 
    const videoLinks = await downloadVid(cdn, key);

    return {
      title,
      youtube_url: url,
      thumbnail,
      key,
      duration,
      duration_time: durationLabel,
      audio: audioLinks,
      video: videoLinks,
    };
  } catch (error) {
    console.error('Error during download:', error);
    return { error: `Internal processing error: ${error}` };
  }
}

module.exports = { savetube };
