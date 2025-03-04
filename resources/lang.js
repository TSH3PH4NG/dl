const {
   translate
} = require('@vitalets/google-translate-api');

async function translate(text,lang){
let language = !lang ? "english" : lang

      let result = await translate(text, {
         to: language,
         autoCorrect: true
      }).catch(_ => null)
      
      return result?.text
}

module.export = { translate };
