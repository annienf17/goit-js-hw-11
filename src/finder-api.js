import axios from "axios";

const URL = "https://pixabay.com/api/";
const API_KEY = "5341847-0da0fa42220482382c220c44b";
const IMAGE_TYPE = "photo";
const ORIENTATION = "horizontal";
const SAFESEARCH = "true";

export const pageLimit = 40;

const fetchImgs = async (keywordFetch, pageFetch) => {
try {
   const {data} = await axios.get(URL, {params: {
    key: API_KEY,
    q: keywordFetch,
    image_type: IMAGE_TYPE,
    orientation: ORIENTATION,
    safesearch: SAFESEARCH,
    per_page: pageLimit,
    page: pageFetch, 
   }});

   return data; 
} 
catch(error) {
    console.log(error);
}
}

export {fetchImgs};









// const fetchImgs = async (q) => {
//     const response = await fetch(`${URL}/?key=${API_KEY}&q=${q}&image-type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}`);
//     const imgs = await response.json();
//     return imgs;
//   };
  
//   fetchImgs().then(imgs => console.log(imgs));





