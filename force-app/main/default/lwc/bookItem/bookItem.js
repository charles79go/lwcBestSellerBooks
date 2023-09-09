import { LightningElement, api } from 'lwc';

export default class BookItem extends LightningElement {
    @api bookItem;

    previewBookFn(event){
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('previewbook', {detail: {
            title: this.bookItem.title,
            author: this.bookItem.author,
            primary_isbn10: this.bookItem.primary_isbn10
        }}));
    }
}