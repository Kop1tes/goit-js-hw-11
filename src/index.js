import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const refs = {
    searchForm: document.querySelector('.search-form'),
    input: document.querySelector('.search-form__input'),
    btnSubmit: document.querySelector('.search-form__button'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
}

let page = 1;
let query = '';
const API_KEY = '32216625-6f7cdca1cd8ffe8b3abf6c6b4';
const BASE_URL = 'https://pixabay.com/api/';

refs.searchForm.addEventListener('submit', formSubmit);
refs.btnLoadMore.addEventListener('click', onLoadMore)
// refs.gallery.addEventListener('click', onClick);


function formSubmit(e) {
    e.preventDefault();

    const query = e.currentTarget.elements.searchQuery.value.trim();
    if (query === "") {
        return;
    }

    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

    fetch(url).then(r => r.json()).then(console.log);
}

function onLoadMore() {  
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`;

    fetch(url).then(r => r.json()).then(console.log);
}
