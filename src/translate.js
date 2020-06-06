const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper 
 * @param {*} errorMessage 
 * @param {*} defaultLanguage 
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when teh action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'de';
  const confidenceThreshold = 0.75;
  return new Promise(function (resolve, reject) {

    try {

      // *******TODO**********
      // - Call the language translation API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#translate
      // - if successful, resolve exatly like shown below with the
      // translated text in the "translation" property,
      // the number of translated words in "words"
      // and the number of characters in "characters".

      // in case of errors during the call resolve with an error message according to the pattern
      // found in the catch clause below

      // pick the language with the highest confidence, and send it back

      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        authenticator: new IamAuthenticator({
          apikey: 'anZY7RWMgf4XoiosyDOLAQ-COFjeAUoYqRcoIBXJkDIh',
        }),
        url: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/a15c1a1e-21d0-48af-82e7-a859b98c7930',
      });
      

      if(params.body.text && params.body.language){
        // Confidence Threshold, if the confidence is too low, don't bother translating; the result wouldn't be good
        if(params.body.confidence && params.body.confidence > confidenceThreshold) {
          var translateParams = {
            text: params.body.text,
            //modelId: 'en-de',
            source: params.body.language,
            target: defaultLanguage
          };
          
  
          languageTranslator.translate(translateParams)
          .then(translationResult => {
            console.log(JSON.stringify(translationResult, null, 2));
            resolve({
              statusCode: 200,
              body: {
                detection: params.body,
                translation : {
                  translations: translationResult.result.translations,
                  language: translateParams.target,
                  words: translationResult.result.word_count,
                  characters: translationResult.result.character_count
                },
              },
              headers: { 'Content-Type': 'application/json' }
            });
          })
          .catch(err => {
            console.log('error:', err);
            resolve({
              statusCode: 500,
              body: {
                detection: params.body,
                error: "No Translation, this might be an error!",
                translations: "",
                words: -1,
                characters: -1,
              },
              headers: { 'Content-Type': 'application/json' }
            });
          });
        } else {
          resolve({
            statusCode: 200,
            body: {
              detection: params.body,
              translations: params.body.text,
              error: "Confidence not high enough!",
              words: -1,
              characters: -1,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        }

      } else {
        resolve({
          statusCode: 500,
          body: {
            error: "Error, no input text or source language!",
            params_body: params.body,
            detection: "",
            translations: "",
            words: -1,
            characters: -1,
          },
          headers: { 'Content-Type': 'application/json' }
        });
      }


      
         
    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
