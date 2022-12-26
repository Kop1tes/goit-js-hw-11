export default class LoadMoreBtn { // создаем класс для экспорта для кнопки Load more...
    constructor(className, onLoadMoreClick) { // создаем конструктор и выделяем 2 переменных
        document.body.insertAdjacentHTML("beforeend", `<button type="button" class="${className}">Load more</button>`); // добавляем элементы строки с HTML тегами перед концом
        this.loadMoreBtnRef = document.querySelector(`.${className}`); // выбираем кнопку Load more... для работы с ней
        this.loadMoreBtnRef.addEventListener('click', onLoadMoreClick); // добавляем слушателя на кнопку с функцией
        this.hide(); // скрываем кнопку
    };

    hide() { // функция для скрытия кнопки
        this.loadMoreBtnRef.style.display = 'none'; // добавляем класс чтобы убрать видимость кнопки
    }

    show() { // функция для показа кнопки
        this.loadMoreBtnRef.style.display = 'block'; // добавляем класс для видимости кнопки
        
    }

    loading() { // функция для показа загрузки
        this.loadMoreBtnRef.textContent = 'Loading...'; // меняем контент кнопки с Load more... на Loading...
    }

    endLoading() { // функция для отмены видимости загрузки
        this.loadMoreBtnRef.textContent = 'Load more'; // меняем контент кнопки с Loading... на Load more...
    }
}