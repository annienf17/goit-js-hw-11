import {fetchImgs, pageLimit} from './finder-api';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const form = document.querySelector("#search-form");
const formInput = document.querySelector('#search-form [name="searchQuery"]');
// const searchIcon = document.querySelector();
const gallery = document.querySelector(".gallery");
let pageNumber = 1;
let inputValue = null;
let numberOfPage = 0; 
const loadMoreBttn = document.querySelector(".load");

let galleryLightBox = new SimpleLightbox(".photo-card a");

form.addEventListener("submit", submitForm);

loadMoreBttn.addEventListener("click", loadMoreImages);

async function submitForm(event) {
    event.preventDefault();

    inputValue = formInput.value;
    loadMoreBttn.classList.add("ishidden");

    if(inputValue === "") {
        Notify.failure("Fill in the field");
        return false;
    } 

    event.currentTarget.reset();
    gallery.innerHTML = "";
    Loading.pulse("Loading data...");

    try {
        await LoadingImages(pageNumber, inputValue);
        
        Loading.remove();
    }
    catch(error){
        console.log(error);
    }
}

    async function LoadingImages(pageNumber, inputValue) {

    try {
        const images = await fetchImgs(inputValue, pageNumber) 
        const searchResult = images.hits; // totalHits tu 500
        numberOfPage = Math.ceil(images.totalHits/pageLimit) //tu exportuje 40 stron z pagLimit
        
            if(images.totalHits === 0) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            }

            if(images.totalHits !== 0) {
                Notify.success(`"Hooray! We found ${images.totalHits} images."`);

                createImages(searchResult);
                galleryLightBox.refresh();
            }

            if(images.totalHits > pageLimit) {
         
                loadMoreBttn.classList.remove("ishidden");
                if(window.innerHeight+window.scrollY >= document.body.scrollHeight) {
                    loadMoreImages();   
                }
            }
    }
            catch(error){
            console.log(error);
        }
}

function createImages(searchResult) {
    const generateHtml = searchResult.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
       
        return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info__item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info__item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info__item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info__item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`
    }).join("");
    
    gallery.insertAdjacentHTML("beforeend", generateHtml)
}

async function loadMoreImages() {
    
        pageNumber+=1;

        try {
            const images = await fetchImgs(inputValue, pageNumber) 
            const searchResult = images.hits; 

            createImages(searchResult);
            galleryLightBox.refresh();

        }
        catch(error){
            console.log(error);
        }
}
