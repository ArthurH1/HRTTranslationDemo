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
  * main() will be run when the action is invoked
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
  const defaultLanguage = 'en';

  return new Promise(function (resolve, reject) {

    try {
      // *******TODO**********
      // - Call the language identification API of the translation service
      // see: https://cloud.ibm.com/apidocs/language-translator?code=node#identify-language
      // - if successful, resolve exactly like shown below with the
      // language that is most probable the best one in the "language" property
      // and the confidence it got detected in the "confidence" property

      // in case of errors during the call resolve with an error message according to the pattern 
      // found in the catch clause below
      
      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        authenticator: new IamAuthenticator({
          apikey: 'anZY7RWMgf4XoiosyDOLAQ-COFjeAUoYqRcoIBXJkDIh',
        }),
        url: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/a15c1a1e-21d0-48af-82e7-a859b98c7930',
      });
      
      const identifyParams = {
        text: "Rise and Shine, Mr. Freeman.."
      };

      
      languageTranslator.identify(identifyParams)
        .then(identifiedLanguages => {
          console.log("We succeded!");
          resolve({
            statusCode: 200,
            body: {
              text: identifyParams.text,
              language: identifiedLanguages.result.languages[0].language,
              confidence: identifiedLanguages.result.languages[0].confidence,
            },
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .catch(err => {
          console.log("BAD, VERY BAD!");
          console.log('error:', err);

          resolve({
            statusCode: 500,
            body: {
              text: "THAT DIDN'T FUCKING WORK!!!",
              text2: "I DIDN'T FUCKING ALLOW YOU TO RESOLVE THISSSSSSSSSSSSSSSSSSSS!!!"
            },
            headers: { 'Content-Type': 'application/json' }
          });
        });

        console.log("Done");


    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
