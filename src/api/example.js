// Import Axios
const axios = require('axios')

// Secret for accessing the API endpoints
let secret = 'YOUR_SECRET_HERE'; // Your secret goes here

// Run a function
fetchAllBans()

// The function lol
async function fetchAllBans() {
    // Initial Fetch
    let request = await axios({
        method: 'get', // GET Request
        url: `https://api.yourdomain.ext/fetchallbans`, // Your domain with your desired API endpoint
        headers: {Accept: 'application/json, text/plain, */*','User-Agent': '*', 'secret': secret } // The secret for accessing the API (if required)
    });
    if(request.data.error) { // If an error is returned
        console.log('Oh no! Something went wrong.\n', request.data.info) // Log the error information
    } else { // If no error is returned
        console.log('Here is what I found!\n', request.data) // Log what is returned
    }
}