import {
  BedrockRuntimeClient,
  InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // console.log(event.queryStringParameters)
  // return {
  //     statusCode: 200,
  // //  Uncomment below to enable CORS requests
  //   headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Headers": "*"
  //   },
  //     body: event.queryStringParameters.param,
  // };

  const bedrock = new BedrockRuntimeClient({
    serviceId: 'bedrock',
    region: 'ap-south-1',
    });
    const userInput = 'What aws bedrock?';
    const prompt = `Human:${userInput}\n\nAssistant:`;
    
    const result = await bedrock.send(
    new InvokeModelCommand({
      modelId: 'amazon.titan-text-express-v1',
      contentType: 'application/json',
      accept: '*/*',
      body: JSON.stringify({
        prompt,
        // LLM costs are measured by Tokens, which are roughly equivalent
        // to 1 word. This option allows you to set the maximum amount of
        // tokens to return
        max_tokens_to_sample: 2000,
        // Temperature (1-0) is how 'creative' the LLM should be in its response
        // 1: deterministic, prone to repeating
        // 0: creative, prone to hallucinations
        temperature: 1,
        top_k: 250,
        top_p: 0.99,
        // This tells the model when to stop its response. LLMs
        // generally have a chat-like string of Human and Assistant message
        // This says stop when the Assistant (Claude) is done and expects
        // the human to respond
        stop_sequences: ['\n\nHuman:'],
        anthropic_version: 'bedrock-2023-05-31'
      })
    })
    );

    return {
      statusCode: 200,
  //  Uncomment below to enable CORS requests
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    },
      body: result,
  };



};


