const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = "BXA7IJ4YMB"
const ALGOLIA_API_KEY = "795bab92e3e84b1428dea3a70872317d"
const ALGOLIA_INDEX_NAME ="docs"

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// const largeText="Counter-Strike: Global Offensive (CS:GO) is a 2012 multiplayer tactical first-person shooter developed by Valve and Hidden Path Entertainment. It is the fourth game in the Counter-Strike series. Developed for over two years, Global Offensive was released for OS X, PlayStation 3, Windows, and Xbox 360 in August 2012, and for Linux in 2014. Valve still regularly updates the game, both with smaller balancing patches and larger content additions."
// const dataToIndex = {
//     objectID: '2',
//     text: largeText,
//   };
  
// index.saveObject(dataToIndex, (err, content) => {
//     if (err) throw err;
//     console.log('Data indexed successfully:', content);
//   });
// var objectIDs=[]

const searchDoc=async()=>{
  const query = 'What is CS:GO?';

  // Set the search parameters
  const searchParams = {
    query: query,
    // Add any other search parameters as needed
  };
  
  // Perform the search
  index
    .search(searchParams)
    .then((content) => {
      if (content.hits.length > 0) {
        // Process the retrieved documents and extract relevant information
        const answers = content.hits.map((hit) => {
          // Extract the necessary information from the hit object
          return {
            title: hit.title,
            description: hit.description,
            // Add any other relevant attributes you want to retrieve
          };
        });
  
        // Display the answers
        console.log(answers);
      } else {
        console.log('No matching documents found.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  
   
}
searchDoc()

