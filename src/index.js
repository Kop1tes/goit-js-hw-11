import './css/styles.css';  // подключение css файла
import {Loading, Notify} from 'notiflix'; // подключение Notify библиотеки (оповещения)
import NewsApiService from './js/service'; // подключение файла где подключен пубичный сервер
import LoadMoreBtn from './js/load-more-btn'; // подключение кнопки "Load more..."
import SimpleLightbox from "simplelightbox"; // подключение библиотеки для галлереи
import "simplelightbox/dist/simple-lightbox.min.css"; // подключение оформаление библиотеки для галлереи

const refs = { // выбор элементов которые будем использовать
    searchForm: document.querySelector('#search-form'), // выбор инпута для ввода слова
    gallery: document.querySelector('.gallery'), // выбор отдела под галерею
    btnSubmit: document.querySelector('.search_button'), // выбор кнопки для поиска
    btnLoadMore: document.querySelector('.load-more'), // выбор кнопки для Load more...
}

refs.searchForm.addEventListener('submit', onSearchSubmit); // добавляем слушателя для инпута

const newsApiService = new NewsApiService(); // вызов класса для этого файла с файла service.js
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn); // вызов класса для кнопки "Load more..." с функцией
const simpleLightBox = new SimpleLightbox('.gallery a', { captionDelay: 250 }); // вызов класса для галлереи с дилеем 250ms (из настроек документации) 

async function onSearchSubmit(e) { // создаем асинхронную функцию для инпута
    e.preventDefault(); // для отключения перезагрузки страницы после нажатия на клавишу

    newsApiService.query = e.currentTarget.elements.searchQuery.value.trim(); // достаем слово которое ввели в инпут и с помощью trim() убираем пробелы

    if (newsApiService.query === '') { // создаем условие, если инпут пустой то вылезает оповещение с ошибкой
        Notify.warning('Enter something');  // оповещение ошибки от Notify с текстом
        return; // возвращаем функцию для повтора
    }

    newsApiService.resetPage(); // вызываем функцию сброса страницы из файла service.js
    
    try { // проверка на ошибку
        const { hits, totalHits } = await newsApiService.fetchApi(); // разкладываем данные чтобы получить только hits(кол-во пришедших картинок) и totalHits(общее количество картинок), await для того чтобы ждать пока эта функция выполнится
        if (totalHits === 0) { // создаем условие, если общее количество картинок равно 0(то есть по запросу нет ничего), то вылезает оповещение с ошибкой
            Notify.warning('Sorry, there are no images matching your search query. Please try again.'); // оповещение ошибки с текстом
            refs.gallery.innerHTML = ''; // очищение инпута с помощью innerHTML после неудачного запроса
            loadMoreBtn.hide(); // прячем кнопку снова после неудачного запроса
            return; // возвращаем функцию для повтора
        }
        Notify.success(`Hooray! We found ${totalHits} images.`); // оповещение с удавшегося запроса с текстом в котором указывается количесво найденных картинок по запросу 
        refs.gallery.innerHTML = ''; // очищение инпута с помощью innerHTML после неудачного запроса
        renderPictures(hits); // вызываем функцию создания галлереи с разметкой из картинок, которые пришли
        simpleLightBox.refresh(); // используем библиотеку для галлереи, с методом, который уничтожает и снова использует библиотеку
        loadMoreBtn.show(); // показываем кнопку Load more... после удачного запроса
    } catch (error) { // если ловим ошибку то вылезает оповещение с ошибкой
        Notify.failure('Something is wrong'); // оповещение ошибки от Notify с текстом
    }
}

function renderPictures(hits) { // создаем функцию для создания разметки под галлерею из пришедших картинок
    const images = hits // создаем переменную для картинок
        .map( // создаем новый массив через map и  перебираем его свойства
            ({
                webformatURL, // путь картинки
                largeImageURL, // ссылка на большую картинку
                tags, // теги описывающие картинку
                likes, // кол-во лайков
                views, // кол-во просмотров
                comments, // кол-во комментариев
                downloads, //кол-во загрузок
            }) => { // возвращаем форму и подставляем свойства которые достали через map
                return `<div class="photo-card"> 
                    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes: </b>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views: </b>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments: </b>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads: </b>${downloads}
                        </p>
                    </div>
                </div>`
            }
    ).join(''); // соединяем элементы массива в строку
    
    
    refs.gallery.insertAdjacentHTML('beforeend', images); // добавляем элементы строки с HTML тегами перед концом
}

async function onLoadMoreBtn() { // создаем ассинхронную функцию для кнопки  Load more...
    loadMoreBtn.loading(); // добавляем видимость загрузки для пользователя
    try {   // проверка на ошибку
        const { hits } = await newsApiService.fetchApi(); // задакем переменную где выделяем картинки которые пришли и ждем пока выполнится загрузка картинок с сервера
        renderPictures(hits); // создаем галлерею с разметкой с теми картинками которые пришли
        simpleLightBox.refresh(); // используем библиотеку для галлереи, с методом, который уничтожает и снова использует библиотеку 
        loadMoreBtn.endLoading(); // убираем видимость загрузки с кнопки
        if (hits.length < 40) { // добавляем условие, если картинок осталось меньше 40, то вылетает оповещение о том что вы достигли конца поиска
            loadMoreBtn.hide(); // кнопка Load more... пропадает
            Notify.info("We're sorry, but you've reached the end of search results."); // оповещение информационное что достигли конца поиска
        }
    } catch (error) { // если ловим ошибку то вылетает оповещение с ошибкой
        Notify.failure('Something is wrong'); // оповещение ошибки с текстом
    }
}
    
