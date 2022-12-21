import './css/styles.css';
import { Notify } from 'notiflix';

const axios = require('axios').default;

const refs = {
    searchForm: document.querySelector('.search-form'),
    input: document.querySelector('.search-form__input'),
    btnSubmit: document.querySelector('.search-form__button'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
}

let page = 1;
const API_KEY = '32216625-6f7cdca1cd8ffe8b3abf6c6b4';
const BASE_URL = 'https://pixabay.com/api/';

refs.searchForm.addEventListener('submit', formSubmit);
refs.gallery.addEventListener('click', onClick);

function formSubmit(e) {
    e.preventDefault();

}

fetch('https://pixabay.com/api/?key=32216625-6f7cdca1cd8ffe8b3abf6c6b4&q=flowers&image_type=photo&orientation=horizontal&safesearch=true').then(r => r.json()).then(console.log);

