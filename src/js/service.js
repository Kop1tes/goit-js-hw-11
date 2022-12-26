import axios from "axios"; // подключаем библиотеку axios для http запроса

const API_KEY = '32216625-6f7cdca1cd8ffe8b3abf6c6b4'; // создаем переменную в которую закидываем наш личный id сервера

axios.defaults.baseURL = 'https://pixabay.com/api/'; // подключаем через axios сервер

export default class NewsApiService { // создаем класс для экспорта
    constructor() { // создаем конструктор
        this.searchQuery = ''; // добавляем переменную в которую будет записываться то что вводят в инпут
        this.page = 1; // создаем переменную страницы равнйю единицы
    }

    async fetchApi() { // создаем ассинхроную функцию, которая формирует какие данные буду приходить с сервера
        const options = new URLSearchParams({ // вызываем класс с параметрами
            key: API_KEY, // ключ с нашим id
            q: this.searchQuery, // то что мы ищем из поля ввода
            image_type: 'photo', // тип картинки
            orientation: 'horizontal', // ориентацию горизонтальную картинки
            safesearch: 'true', // фильтр по возрасту
            per_page: 40, // количество картинок которые прийдут за один запрос
            page: this.page, // номер страницы
        });

        const { data } = await axios(`?${options}`); // создаем перменную и ждем выполнения создания запроса на сервер с всеми параметрами
        this.page += 1; // увеличиваем номер страницы на единицу
        return data; // возвращаем результат
        
    }

    resetPage() { // функция для сброса страницы
        this.page = 1; // номер страницы равный единице
    }

    get query() { // получаем результат по введенному слову
        return this.searchQuery; // возвращаем результат
    }
    
    set query(newQuery) { // заменяем свойство на то что ввели
        this.searchQuery = newQuery; // записываем в поиск новое свойство
    }
}
