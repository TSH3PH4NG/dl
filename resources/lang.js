const { translate } = require('@vitalets/google-translate-api');

async function trt(text, lang) {
    let language = !lang ? "en" : lang; // Default to "en" (English)
    
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
