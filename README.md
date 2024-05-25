# Video Translation Client Library

## Overview

This library will allow the client to request the status of the video being translated on the server. 

### Running the Server

1. Install the required dependencies:
    ```
    npm install 
    ```
The above command will install all the required packages from package.json 

2. Start the server:
    ```
    npm run dev
    ```
The above command will start the server
### Using the Client Library

1. Import the `Client` and create an instance:
    ```typescript
    import Client from "./client.ts"

    (async () => {
        const client = new Client('http://localhost:3000');
        const result = await client.completeRequest();
        console.log(`Final status: ${result}`);
    })();
    ```
2. To disconnect the client: 
   ```typescript
   client.disconnectClient()
   ```

The client was built with customer mindset: 
- The client has a log in `data/stats.json` to see recent jobs 
and the average amount of time the job took along with the total video processing time and other parameters 
- The client library has strong error handling & console logging to keep the user updated with server status 
- The client library has the ability to start a job and in case of a disconnection the job will continue on the 
server side. In order to check up on the job the client has to pass in the same jobID to a new `Client` instance 
and record job progress. [WIP / SEMI-FUNCTIONAL]
	- The `data/jobs.json` is a semi-functional cache which updates the status of the most recent job
- The client library times out after a certain number of retries to not overload the server with excess requests 

### Running Integration Test

1. Run the integration test to see the client in action:
    ```
    npm run test
    ```

## Configuration

- The server has a configurable delay (`videoLength`) set in `server.ts`. This configurable delay represents 
the time it takes the server to process the video. 
- The client library uses exponential backoff to handle status checks appropriately. The `initialDelay` is set to 1000ms
and the maxDelay is set to 5000ms. Both parameters can be changed as part of an `options` object passed to `Client` instance. 

## Recommendations

- [FOR NIKUNJ]: I recommend that you manually go to `server.ts` and updated the `videoLength` to be a longer time so you can watch the client
interact with the server in action and appropriately test the features you need to! (I recommend a long time ~30 seconds)
- One of the files is me using Mocha/Chai to create an integration testing suite which I wasn't able to fully complete, but the main test should be on `integration.ts` anyways.  
