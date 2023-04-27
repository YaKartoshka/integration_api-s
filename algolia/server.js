const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = "BXA7IJ4YMB"
const ALGOLIA_API_KEY = "795bab92e3e84b1428dea3a70872317d"
const ALGOLIA_INDEX_NAME ="docs"

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const largeText="Counter-Strike: Global Offensive (CS:GO) is a 2012 multiplayer tactical first-person shooter developed by Valve and Hidden Path Entertainment. It is the fourth game in the Counter-Strike series. Developed for over two years, Global Offensive was released for OS X, PlayStation 3, Windows, and Xbox 360 in August 2012, and for Linux in 2014. Valve still regularly updates the game, both with smaller balancing patches and larger content additions."
const dataToIndex = {
    objectID: '1',
    text: largeText,
  };
  
index.saveObject(dataToIndex, (err, content) => {
    if (err) throw err;
    console.log('Data indexed successfully:', content);
  });
var objectIDs=[]

const searchDoc=async()=>{
    index.search('CSGO').then(({ hits }) => {
        console.log(hits);
        
    //     objectIDs.concat(hits)
    //    hits.forEach(data => {
    //     index.deleteObject(data.objectID)
    //    });
      });
   
}
searchDoc()
 
