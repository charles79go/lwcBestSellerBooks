import { LightningElement } from 'lwc';

export default class TabPanel extends LightningElement {


    categoryOptions = [
        { label: "Advice, How-To & Miscellaneous", value: "advice-how-to-and-miscellaneous" },
        { label: "Business", value: "business-books" },
        { label: "Children's Middle Grade", value: "childrens-middle-grade" },
        { label: "Combined Print and Ebook Fiction", value: "combined-print-and-e-book-nonfiction" },
        { label: "Culture", value: "culture" },
        { label: "Education", value: "education" },
        { label: "Food and Diet", value: "food-and-fitness" },
        { label: "Health", value: "health" },
        { label: "Humor", value: "humor" },
        { label: "Manga", value: "manga" },
        { label: "Parenthood and Family", value: "family" },
        { label: "Science", value: "science" },
        { label: "Sports and Fitness", value: "sports" },
        { label: "Young Adult", value: "young-adult" }
    ];

}