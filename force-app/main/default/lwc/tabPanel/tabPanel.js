import { LightningElement } from 'lwc';
import getBookList from '@salesforce/apex/BooksCtrl.getBookList';
import getBookDetails from '@salesforce/apex/BooksCtrl.getBookDetails';

export default class TabPanel extends LightningElement {
    categorySelected = 'food-and-fitness';

    bookList = [];

    showListSpinner = false;
    hasListError = false;

    showDetailSpinner = false;
    hasDetailError = false;
    frameReady = false;

    // preview variables
    previewUrl;
    title;
    subtitle;
    author;
    description;
    imgUrl;

    initDetailView;

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
            let data = await getBookList({ category });
            data = JSON.parse(data);
            this.bookList = data.results.books;

            // this.bookList = this.jsonSample.results.books;

            this.hasListError = false;
            this.showListSpinner = false;
        } catch (e) {
            console.log('error', e);
            this.hasListError = true;
            this.showListSpinner = false;
        }
    }

    categorySelectFn(e) {
        this.categorySelected = e.detail.value;

        // get the best seller list from NYT api.
        this.getBooks(this.categorySelected);
    }

    async previewBookFn(e) {
        // console.log('>>>>>', e.detail.title);
        // console.log('>>>>>', e.detail.author);
        // console.log('>>>>>', e.detail.primary_isbn10);

        try {
            this.showDetailSpinner = true;
            let response = await getBookDetails({
                title: e.detail.title,
                isbn: e.detail.primary_isbn10
            });

            let data = await JSON.parse(response);
            //
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
        if (response.items.length === 0) return 'no data';
        // if there is data, get the first one only.
        let bookData = response.items[0];
        this.title = bookData.volumeInfo.title;
        this.subtitle = bookData.volumeInfo.title;
        this.author = bookData.volumeInfo.authors.join(', ');
        this.description = bookData.volumeInfo.description;
        this.imgUrl = bookData.volumeInfo.imageLinks.thumbnail;
        this.previewUrl = `${bookData.volumeInfo.previewLink}&output=embed`;
        this.frameReady = this.previewUrl.includes('frontcover');
        this.initDetailView = true;
        return 'success';
    }

    jsonSample = {
        status: 'OK',
        copyright:
            'Copyright (c) 2023 The New York Times Company.  All Rights Reserved.',
        num_results: 15,
        last_modified: '2019-08-29T20:54:03-04:00',
        results: {
            list_name: 'Childrens Middle Grade',
            list_name_encoded: 'childrens-middle-grade',
            bestsellers_date: '2015-08-08',
            published_date: '2015-08-23',
            published_date_description: 'latest',
            next_published_date: '',
            previous_published_date: '2015-08-16',
            display_name: "Children's Middle Grade",
            normal_list_ends_at: 10,
            updated: 'WEEKLY',
            books: [
                {
                    rank: 1,
                    rank_last_week: 0,
                    weeks_on_list: 14,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1484720970',
                    primary_isbn13: '9781484720974',
                    publisher: 'Disney Publishing Worldwide',
                    description:
                        "Children of famous villains band together to retrieve the Dragon's Eye; a Descendants novel.",
                    price: '0.00',
                    title: 'THE ISLE OF THE LOST',
                    author: 'Melissa de la Cruz',
                    contributor: 'by Melissa de la Cruz',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781484712955.jpg',
                    book_image_width: 328,
                    book_image_height: 495,
                    amazon_product_url:
                        'http://www.amazon.com/Isle-Lost-The-Descendants-Novel-ebook/dp/B00RY6YYR8?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Isle-Lost-The-Descendants-Novel-ebook/dp/B00RY6YYR8?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781484720974?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781484720974'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FTHE%2BISLE%2BOF%2BTHE%2BLOST%2FMelissa%2Bde%2Bla%2BCruz%2F9781484720974'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781484720974'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781484720974?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/310029df-a039-5158-87be-e4b9aced76ad'
                },
                {
                    rank: 2,
                    rank_last_week: 0,
                    weeks_on_list: 141,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0375869026',
                    primary_isbn13: '9780375869020',
                    publisher: 'Knopf Doubleday Publishing',
                    description:
                        'A boy with a facial deformity enters a mainstream school.',
                    price: '0.00',
                    title: 'WONDER',
                    author: 'R.J. Palacio',
                    contributor: 'by R.J. Palacio',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780375899881.jpg',
                    book_image_width: 329,
                    book_image_height: 495,
                    amazon_product_url:
                        'http://www.amazon.com/Wonder-R-J-Palacio-ebook/dp/B0051ANPZQ?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link:
                        'https://www.nytimes.com/2012/04/08/books/review/wonder-by-r-j-palacio.html',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0375869026',
                            isbn13: '9780375869020'
                        },
                        {
                            isbn10: '037589988X',
                            isbn13: '9780375899881'
                        },
                        {
                            isbn10: '0375969020',
                            isbn13: '9780375969027'
                        },
                        {
                            isbn10: '1524720194',
                            isbn13: '9781524720193'
                        },
                        {
                            isbn10: '1524719773',
                            isbn13: '9781524719777'
                        },
                        {
                            isbn10: '0593378172',
                            isbn13: '9780593378175'
                        },
                        {
                            isbn10: '459353495X',
                            isbn13: '9784593534951'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Wonder-R-J-Palacio-ebook/dp/B0051ANPZQ?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780375869020?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780375869020'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FWONDER%2FR.J.%2BPalacio%2F9780375869020'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780375869020'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780375869020?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/ae6bd2cf-a5d7-535a-99dd-ca8e283c2b01'
                },
                {
                    rank: 3,
                    rank_last_week: 0,
                    weeks_on_list: 1,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1484726383',
                    primary_isbn13: '9781484726389',
                    publisher: 'Disney Publishing Worldwide',
                    description:
                        "It was Maleficent's before it was Mal's; a Descendants book.",
                    price: '0.00',
                    title: "MAL'S SPELL BOOK",
                    author: '',
                    contributor: '',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781484726389.jpg',
                    book_image_width: 330,
                    book_image_height: 427,
                    amazon_product_url:
                        'http://www.amazon.com/Descendants-Mals-Spell-Disney-Group/dp/1484726383?tag=NYTBSREV-20',
                    age_group: 'Ages 8 to 12',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Descendants-Mals-Spell-Disney-Group/dp/1484726383?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781484726389?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781484726389'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FMAL%2527S%2BSPELL%2BBOOK%2F%2F9781484726389'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781484726389'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781484726389?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/98b63e86-8c46-51c5-ab4b-c3f6cf13fda6'
                },
                {
                    rank: 4,
                    rank_last_week: 0,
                    weeks_on_list: 4,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1484726146',
                    primary_isbn13: '9781484726143',
                    publisher: 'Disney Publishing Worldwide',
                    description:
                        'A second chance for the offspring of evil; the junior novelization.',
                    price: '0.00',
                    title: 'DESCENDANTS',
                    author: 'adapted  Rico Green',
                    contributor: 'adapted by Rico Green',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781484726143.jpg',
                    book_image_width: 330,
                    book_image_height: 480,
                    amazon_product_url:
                        'http://www.amazon.com/Descendants-Junior-Novel-Rico-Green/dp/1484726146?tag=NYTBSREV-20',
                    age_group: 'Ages 10 to 14',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Descendants-Junior-Novel-Rico-Green/dp/1484726146?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781484726143?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781484726143'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FDESCENDANTS%2Fadapted%2B%2BRico%2BGreen%2F9781484726143'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781484726143'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781484726143?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/f30d759d-cde6-5546-b3e3-6d7c2c8627ec'
                },
                {
                    rank: 5,
                    rank_last_week: 0,
                    weeks_on_list: 61,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0547577311',
                    primary_isbn13: '9780547577319',
                    publisher: 'Houghton Mifflin Harcourt',
                    description: 'A Sudanese tale of survival.',
                    price: '0.00',
                    title: 'A LONG WALK TO WATER',
                    author: 'Linda Sue Park',
                    contributor: 'by Linda Sue Park',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780547577319.jpg',
                    book_image_width: 328,
                    book_image_height: 495,
                    amazon_product_url:
                        'http://www.amazon.com/Long-Walk-Water-Based-Story/dp/0547577311?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0547577311',
                            isbn13: '9780547577319'
                        },
                        {
                            isbn10: '0547251270',
                            isbn13: '9780547251271'
                        },
                        {
                            isbn10: '0547532849',
                            isbn13: '9780547532844'
                        },
                        {
                            isbn10: '1432875922',
                            isbn13: '9781432875923'
                        },
                        {
                            isbn10: '1432875914',
                            isbn13: '9781432875916'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Long-Walk-Water-Based-Story/dp/0547577311?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780547577319?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780547577319'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FA%2BLONG%2BWALK%2BTO%2BWATER%2FLinda%2BSue%2BPark%2F9780547577319'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780547577319'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780547577319?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/72728168-095d-521b-90d2-2380bdc74220'
                },
                {
                    rank: 6,
                    rank_last_week: 0,
                    weeks_on_list: 3,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0062420399',
                    primary_isbn13: '9780062420398',
                    publisher: 'HarperCollins Publishers',
                    description:
                        'The story of a canine military hero; also a movie.',
                    price: '0.00',
                    title: 'MAX',
                    author: 'Boaz Yakin and Sheldon Lettich',
                    contributor: 'by Boaz Yakin and Sheldon Lettich',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780062420398.jpg',
                    book_image_width: 330,
                    book_image_height: 494,
                    amazon_product_url:
                        'http://www.amazon.com/Max-Best-Friend-Hero-Marine/dp/0062420399?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0062420399',
                            isbn13: '9780062420398'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Max-Best-Friend-Hero-Marine/dp/0062420399?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780062420398?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780062420398'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FMAX%2FBoaz%2BYakin%2Band%2BSheldon%2BLettich%2F9780062420398'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780062420398'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780062420398?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/23d48416-824d-5b8b-af6f-d1941b25d804'
                },
                {
                    rank: 7,
                    rank_last_week: 0,
                    weeks_on_list: 106,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1609580834',
                    primary_isbn13: '9781609580834',
                    publisher: 'American Girl Publishing',
                    description: 'The changing body.',
                    price: '0.00',
                    title: 'THE CARE AND KEEPING OF YOU',
                    author: 'Valorie Schaefer',
                    contributor:
                        'by Valorie Schaefer. Illustrated by Josee Masse',
                    contributor_note: 'Illustrated by Josee Masse',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781609580834.jpg',
                    book_image_width: 294,
                    book_image_height: 475,
                    amazon_product_url:
                        'http://www.amazon.com/The-Care-Keeping-You-Younger/dp/1609580834?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '1609580834',
                            isbn13: '9781609580834'
                        },
                        {
                            isbn10: '1562476661',
                            isbn13: '9781562476663'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/The-Care-Keeping-You-Younger/dp/1609580834?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781609580834?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781609580834'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FTHE%2BCARE%2BAND%2BKEEPING%2BOF%2BYOU%2FValorie%2BSchaefer%2F9781609580834'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781609580834'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781609580834?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/0018c0d6-d3a4-5f79-a2ad-0f216cd2794d'
                },
                {
                    rank: 8,
                    rank_last_week: 0,
                    weeks_on_list: 11,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0763678880',
                    primary_isbn13: '9780763678883',
                    publisher: 'Candlewick',
                    description: "Princess Magnolia's alter ego.",
                    price: '0.00',
                    title: 'THE PRINCESS IN BLACK',
                    author: 'Shannon Hale and Dean Hale',
                    contributor:
                        'by Shannon Hale and Dean Hale. Illustrated by LeUyen Pham',
                    contributor_note: 'Illustrated by LeUyen Pham',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780763665104.jpg',
                    book_image_width: 128,
                    book_image_height: 163,
                    amazon_product_url:
                        'http://www.amazon.com/The-Princess-Black-Shannon-Hale/dp/076366510X?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link:
                        'https://www.nytimes.com/2014/11/09/books/review/pennyroyal-academy-and-the-princess-in-black.html',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '076366510X',
                            isbn13: '9780763665104'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/The-Princess-Black-Shannon-Hale/dp/076366510X?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780763678883?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780763678883'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FTHE%2BPRINCESS%2BIN%2BBLACK%2FShannon%2BHale%2Band%2BDean%2BHale%2F9780763678883'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780763678883'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780763678883?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/8668a63c-66fe-5f15-8e3a-aa911c3d08a3'
                },
                {
                    rank: 9,
                    rank_last_week: 0,
                    weeks_on_list: 17,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '014242286X',
                    primary_isbn13: '9780142422861',
                    publisher: 'Penguin Group',
                    description:
                        'Willow struggles to adjust after the death of her adoptive parents.',
                    price: '0.00',
                    title: 'COUNTING BY 7s',
                    author: 'Holly Goldberg Sloan',
                    contributor: 'by Holly Goldberg Sloan',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780803738553.jpg',
                    book_image_width: 328,
                    book_image_height: 495,
                    amazon_product_url:
                        'http://www.amazon.com/Counting-7s-Holly-Goldberg-Sloan/dp/0803738552?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0803738552',
                            isbn13: '9780803738553'
                        },
                        {
                            isbn10: '014242286X',
                            isbn13: '9780142422861'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Counting-7s-Holly-Goldberg-Sloan/dp/0803738552?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780142422861?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780142422861'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FCOUNTING%2BBY%2B7s%2FHolly%2BGoldberg%2BSloan%2F9780142422861'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780142422861'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780142422861?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/6b8cd8fe-cd27-5f50-bd05-83d6d1d05139'
                },
                {
                    rank: 10,
                    rank_last_week: 0,
                    weeks_on_list: 5,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0553536907',
                    primary_isbn13: '9780553536904',
                    publisher: 'Random House Publishing',
                    description:
                        'More prehistoric havoc; the junior novelization.',
                    price: '0.00',
                    title: 'JURASSIC WORLD',
                    author: 'David Lewman',
                    contributor: 'by David Lewman',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780553536904.jpg',
                    book_image_width: 330,
                    book_image_height: 488,
                    amazon_product_url:
                        'http://www.amazon.com/Jurassic-Special-Edition-Junior-Novelization/dp/0553536907?tag=NYTBSREV-20',
                    age_group: 'Ages 8 to 12',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0553536907',
                            isbn13: '9780553536904'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Jurassic-Special-Edition-Junior-Novelization/dp/0553536907?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780553536904?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780553536904'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FJURASSIC%2BWORLD%2FDavid%2BLewman%2F9780553536904'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780553536904'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780553536904?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/de67efad-a057-5391-9ba0-78b77d41361e'
                },
                {
                    rank: 11,
                    rank_last_week: 0,
                    weeks_on_list: 0,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1627793968',
                    primary_isbn13: '9781627793964',
                    publisher: 'Henry Holt & Company',
                    description:
                        'An account of the collapse of the Third Reich and the death of the Nazi leader.',
                    price: '0.00',
                    title: "HITLER'S LAST DAYS",
                    author: "Bill O'Reilly",
                    contributor: "by Bill O'Reilly",
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781627793971.jpg',
                    book_image_width: 330,
                    book_image_height: 429,
                    amazon_product_url:
                        'http://www.amazon.com/Hitlers-Last-Days-Notorious-Dictator-ebook/dp/B00PP6WQ4C?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '1627793968',
                            isbn13: '9781627793964'
                        },
                        {
                            isbn10: '1627793976',
                            isbn13: '9781627793971'
                        },
                        {
                            isbn10: '1627794557',
                            isbn13: '9781627794558'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Hitlers-Last-Days-Notorious-Dictator-ebook/dp/B00PP6WQ4C?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781627793964?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781627793964'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FHITLER%2527S%2BLAST%2BDAYS%2FBill%2BO%2527Reilly%2F9781627793964'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781627793964'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781627793964?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/b5c8955f-6c81-59a9-8067-cea8c68902c2'
                },
                {
                    rank: 12,
                    rank_last_week: 0,
                    weeks_on_list: 0,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1484709012',
                    primary_isbn13: '9781484709016',
                    publisher: 'Disney Publishing Worldwide',
                    description:
                        'In 1899, children go missing at a sumptuous Vanderbilt estate.',
                    price: '0.00',
                    title: 'SERAFINA AND THE BLACK CLOAK',
                    author: 'Robert Beatty',
                    contributor: 'by Robert Beatty',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781484715116.jpg',
                    book_image_width: 330,
                    book_image_height: 495,
                    amazon_product_url:
                        'http://www.amazon.com/Serafina-Black-Cloak-Robert-Beatty-ebook/dp/B00RY6YXPG?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Serafina-Black-Cloak-Robert-Beatty-ebook/dp/B00RY6YXPG?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781484709016?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781484709016'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FSERAFINA%2BAND%2BTHE%2BBLACK%2BCLOAK%2FRobert%2BBeatty%2F9781484709016'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781484709016'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781484709016?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/35a92e0b-dadb-5d6f-8485-4e91485050be'
                },
                {
                    rank: 13,
                    rank_last_week: 0,
                    weeks_on_list: 0,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0061992275',
                    primary_isbn13: '9780061992278',
                    publisher: 'HarperCollins Publishers',
                    description:
                        'A gorilla living in a mall meets an elephant.',
                    price: '0.00',
                    title: 'THE ONE AND ONLY IVAN',
                    author: 'Katherine Applegate.',
                    contributor:
                        'by Katherine Applegate. Illustrated by Patricia Castelao',
                    contributor_note: 'Illustrated by Patricia Castelao',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780061992278.jpg',
                    book_image_width: 330,
                    book_image_height: 466,
                    amazon_product_url:
                        'http://www.amazon.com/The-Only-Ivan-Katherine-Applegate/dp/0061992275?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0062101986',
                            isbn13: '9780062101983'
                        },
                        {
                            isbn10: '0063014130',
                            isbn13: '9780063014138'
                        },
                        {
                            isbn10: '0063019388',
                            isbn13: '9780063019386'
                        },
                        {
                            isbn10: '0062285300',
                            isbn13: '9780062285300'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/The-Only-Ivan-Katherine-Applegate/dp/0061992275?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780061992278?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780061992278'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FTHE%2BONE%2BAND%2BONLY%2BIVAN%2FKatherine%2BApplegate.%2F9780061992278'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780061992278'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780061992278?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/f6738b4d-ccb6-5abe-9fa1-1db4ff0313c0'
                },
                {
                    rank: 14,
                    rank_last_week: 0,
                    weeks_on_list: 0,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '1416971718',
                    primary_isbn13: '9781416971719',
                    publisher: 'Simon & Schuster',
                    description:
                        'A brilliant girl with cerebral palsy longs to speak.',
                    price: '0.00',
                    title: 'OUT OF MY MIND',
                    author: 'Sharon M. Draper',
                    contributor: 'by Sharon M. Draper',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9781416971719.jpg',
                    book_image_width: 330,
                    book_image_height: 491,
                    amazon_product_url:
                        'http://www.amazon.com/Out-My-Mind-Sharon-Draper/dp/1416971718?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link: '',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '141697170X',
                            isbn13: '9781416971702'
                        },
                        {
                            isbn10: '1416971718',
                            isbn13: '9781416971719'
                        },
                        {
                            isbn10: '1416980458',
                            isbn13: '9781416980452'
                        },
                        {
                            isbn10: '1432863916',
                            isbn13: '9781432863913'
                        },
                        {
                            isbn10: '1508222460',
                            isbn13: '9781508222460'
                        },
                        {
                            isbn10: '1432860755',
                            isbn13: '9781432860752'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Out-My-Mind-Sharon-Draper/dp/1416971718?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9781416971719?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9781416971719'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FOUT%2BOF%2BMY%2BMIND%2FSharon%2BM.%2BDraper%2F9781416971719'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9781416971719'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9781416971719?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/82d77c01-610e-563e-8f14-073084cd4a58'
                },
                {
                    rank: 15,
                    rank_last_week: 0,
                    weeks_on_list: 0,
                    asterisk: 0,
                    dagger: 0,
                    primary_isbn10: '0385743173',
                    primary_isbn13: '9780385743174',
                    publisher: 'Random House Publishing',
                    description: '',
                    price: '0.00',
                    title: 'GOODBYE STRANGER',
                    author: 'Rebecca Stead',
                    contributor: 'by Rebecca Stead',
                    contributor_note: '',
                    book_image:
                        'https://storage.googleapis.com/du-prd/books/images/9780385743174.jpg',
                    book_image_width: 328,
                    book_image_height: 495,
                    amazon_product_url:
                        'http://www.amazon.com/Goodbye-Stranger-Rebecca-Stead/dp/0385743173?tag=NYTBSREV-20',
                    age_group: '',
                    book_review_link: '',
                    first_chapter_link: '',
                    sunday_review_link:
                        'https://www.nytimes.com/2015/08/23/books/review/rebecca-steads-goodbye-stranger.html',
                    article_chapter_link: '',
                    isbns: [
                        {
                            isbn10: '0385743173',
                            isbn13: '9780385743174'
                        },
                        {
                            isbn10: '0307980855',
                            isbn13: '9780307980854'
                        }
                    ],
                    buy_links: [
                        {
                            name: 'Amazon',
                            url: 'http://www.amazon.com/Goodbye-Stranger-Rebecca-Stead/dp/0385743173?tag=NYTBSREV-20'
                        },
                        {
                            name: 'Apple Books',
                            url: 'https://goto.applebooks.apple/9780385743174?at=10lIEQ'
                        },
                        {
                            name: 'Barnes and Noble',
                            url: 'https://www.anrdoezrs.net/click-7990613-11819508?url=https%3A%2F%2Fwww.barnesandnoble.com%2Fw%2F%3Fean%3D9780385743174'
                        },
                        {
                            name: 'Books-A-Million',
                            url: 'https://www.anrdoezrs.net/click-7990613-35140?url=https%3A%2F%2Fwww.booksamillion.com%2Fp%2FGOODBYE%2BSTRANGER%2FRebecca%2BStead%2F9780385743174'
                        },
                        {
                            name: 'Bookshop',
                            url: 'https://bookshop.org/a/3546/9780385743174'
                        },
                        {
                            name: 'IndieBound',
                            url: 'https://www.indiebound.org/book/9780385743174?aff=NYT'
                        }
                    ],
                    book_uri: 'nyt://book/d5afb9ff-40a8-5b8e-992f-88ad82642b70'
                }
            ],
            corrections: []
        }
    };
}
