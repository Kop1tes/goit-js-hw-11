import axios from "axios";

const API_KEY = '32216625-6f7cdca1cd8ffe8b3abf6c6b4';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class NewsApiService { 
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchApi() {
        const options = new URLSearchParams({
            key: API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 40,
            page: this.page,
        });

        const { data } = await axios(`?${options}`);
        this.page += 1;
        return data;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }
    
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
