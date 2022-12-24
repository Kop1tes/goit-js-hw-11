import './css/styles.css';
import {Loading, Notify} from 'notiflix';
import NewsApiService from './js/service';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnSubmit: document.querySelector('.search_button'),
    btnLoadMore: document.querySelector('.load-more'),
}

refs.searchForm.addEventListener('submit', onSearchSubmit);

const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);
const simpleLightBox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

async function onSearchSubmit(e) {
    e.preventDefault();

    newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

    if (newsApiService.query === '') {
        Notify.warning('Enter something');
        return;
    }

    newsApiService.resetPage();
    
    try {
        const { hits, totalHits } = await newsApiService.fetchApi();
        if (totalHits === 0) {
            Notify.warning('Sorry, there are no images matching your search query. Please try again.');
            refs.gallery.innerHTML = '';
            loadMoreBtn.hide();
            return;
        }
        Notify.success(`Hooray! We found ${totalHits} images.`);
        refs.gallery.innerHTML = '';
        renderPictures(hits);
        simpleLightBox.refresh();
        loadMoreBtn.show();
    } catch (error) {
        Notify.failure('Something is wrong');
    }
}

function renderPictures(hits) {
    const images = hits
        .map(
            ({
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }) => {
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
    ).join('');
    
    
    refs.gallery.insertAdjacentHTML('beforeend', images);
}

async function onLoadMoreBtn() {
    loadMoreBtn.loading();
    try {
        const { hits } = await newsApiService.fetchApi();
        renderPictures(hits);
        simpleLightBox.refresh();
        loadMoreBtn.endLoading();
        if (hits.length < 40) {
            loadMoreBtn.hide();
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    } catch (error) {
        Notify.failure('Something is wrong');
    }
}
    
