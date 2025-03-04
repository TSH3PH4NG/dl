/* © Tshepang 2025*/
const { translate } = require('@vitalets/google-translate-api');

// Full list of supported language codes
const supportedLanguages = [
    'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 
    'zh-CN', 'zh-TW', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 
    'gl', 'ka', 'de', 'el', 'gu', 'ht', 'he', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 
    'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 
    'lt', 'mk', 'ms', 'ml', 'mr', 'mn', 'my', 'ne', 'no', 'ps', 'fa', 'pl', 'pt', 
    'pa', 'ro', 'ru', 'sr', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 
    'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
];

async function trt(text, lang) {
    // Default to "en" (English) if no lang is provided
    let language = !lang ? "en" : lang;
    
    // Check if the language code is valid
    if (!supportedLanguages.includes(language)) {
        return {
            status: 400,
            text: `Invalid language code\n choose from: ${supportedLanguages}`,
        };
    }

    let result;
    try {
        result = await translate(text, {
            to: language,
            autoCorrect: true,
        });
    } catch (error) {
        return {
            status: 500,
            error: "Translation failed",
        };
    }

    return {
        status: 200,
        text: result?.text,
    };
}

module.exports = { trt };
