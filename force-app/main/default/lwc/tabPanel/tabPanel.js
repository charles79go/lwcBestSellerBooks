import { LightningElement } from 'lwc';
import getBookList from '@salesforce/apex/BooksCtrl.getBookList';
import getBookDetails from '@salesforce/apex/BooksCtrl.getBookDetails';
import searchBooks from '@salesforce/apex/BooksCtrl.searchBooks';

export default class TabPanel extends LightningElement {
    categorySelected = 'food-and-fitness';
    bookList = [];
    searchResults = [];

    // preview variables
    previewUrl;
    title;
    subtitle;
    author;
    description;
    imgUrl;

    // search variables
    searchInput;

    initDetailView = false;

    showListSpinner = false;
    hasListError = false;

    showSearchSpinner = false;
    hasSearchError = false;

    showDetailSpinner = false;
    hasDetailError = false;
    frameReady = false;

    categoryOptions = [
        {
            label: 'Advice, How-To & Miscellaneous',
            value: 'advice-how-to-and-miscellaneous'
        },
        { label: 'Business', value: 'business-books' },
        { label: "Children's Middle Grade", value: 'childrens-middle-grade' },
        {
            label: 'Combined Print and Ebook Fiction',
            value: 'combined-print-and-e-book-nonfiction'
        },
        { label: 'Culture', value: 'culture' },
        { label: 'Education', value: 'education' },
        { label: 'Food and Diet', value: 'food-and-fitness' },
        { label: 'Health', value: 'health' },
        { label: 'Humor', value: 'humor' },
        { label: 'Manga', value: 'manga' },
        { label: 'Parenthood and Family', value: 'family' },
        { label: 'Science', value: 'science' },
        { label: 'Sports and Fitness', value: 'sports' },
        { label: 'Young Adult', value: 'young-adult' }
    ];

    connectedCallback() {
        this.getBooks(this.categorySelected);
    }

    async getBooks(category) {
        try {
            this.showListSpinner = true;
            //
            // get books list from NT times
            let data = await getBookList({ category });
            data = JSON.parse(data);
            //
            // set the booklist with response data
            this.bookList = data.results.books;
            //
            this.hasListError = false;
            this.showListSpinner = false;
        } catch (e) {
            console.log('error', e);
            this.hasListError = true;
            this.showListSpinner = false;
        }
    }

    categorySelectFn(evt) {
        this.categorySelected = evt.detail.value;

        // get the best seller list from NYT api.
        this.getBooks(this.categorySelected);
    }

    async previewBookFn(evt) {
        try {
            this.showDetailSpinner = true;
            //
            this.resetPreview();
            //
            // get book details from google books api
            let response = await getBookDetails({
                title: evt.detail.title,
                isbn: evt.detail.primary_isbn10
            });
            let data = await JSON.parse(response);
            //
            // process response data to get correct information
            let bookProcessResult = this.processDetails(data);
            if (bookProcessResult === 'no data') {
                this.frameReady = false;
                this.hasDetailError = true;
                this.showDetailSpinner = false;
                return;
            }
            //
            this.showDetailSpinner = false;
            this.hasDetailError = false;
        } catch (e) {
            console.log('error', e);
            this.frameReady = false;
            this.hasDetailError = true;
            this.showDetailSpinner = false;
        }
    }

    processDetails(response) {
        // response coming from google books api
        if (response?.items?.length === 0) return 'no data';
        //
        // if there is data, get the first one only.
        let bookData = response.items[0];
        //
        // set component variables from response
        this.title = bookData.volumeInfo.title;
        this.subtitle = bookData.volumeInfo.title;
        this.author = bookData.volumeInfo.authors.join(', ');
        this.description = bookData.volumeInfo.description;
        this.imgUrl = bookData?.volumeInfo?.imageLinks?.thumbnail;
        this.previewUrl = `${bookData.volumeInfo.previewLink}&output=embed`;
        //
        // only show the iframe if there is a preview for it.
        this.frameReady = this.previewUrl.includes('frontcover');
        //
        // show book details
        this.initDetailView = true;
        //
        return 'success';
    }

    async searchInputFn(evt) {
        // if enter key is pressed
        if (evt.keyCode === 13) {
            let searchTerm = this.refs.searchInput.value;
            //
            // if searchTerm is blank, exit out.
            if (searchTerm.length === 0) return;
            //
            try {
                this.showSearchSpinner = true;
                //
                // search books in google books
                let response = await searchBooks({ searchString: searchTerm });
                this.searchResults = this.processSearchResult(response);
                //
                this.hasSearchError = false;
                this.showSearchSpinner = false;
            } catch(e) {
                console.log('error', e);
                this.hasSearchError = true;
                this.showSearchSpinner = false;
            }
        }
    }

    processSearchResult(response) {
        let data = JSON.parse(response);
        let books = data.items.map((book) => {
            let author =
                book?.volumeInfo?.authors?.length > 0
                    ? book.volumeInfo.authors[0]
                    : '';
            let isbn;
            book.volumeInfo.industryIdentifiers.forEach((isbnObj) => {
                if (isbnObj.type === 'ISBN_10') isbn = isbnObj.identifier;
            });
            return {
                book_image: book?.volumeInfo?.imageLinks?.thumbnail,
                title: book?.volumeInfo?.title,
                author,
                primary_isbn10: isbn
            };
        });

        return books;
    }

    resetPreview(){
        this.previewUrl = '';
        this.title = '';
        this.subtitle = '';
        this.author = '';
        this.description = '';
        this.imgUrl = '';
    }
}
