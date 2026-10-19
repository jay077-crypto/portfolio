console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/jay077-crypto', title: 'GitHub' },
];

const BASE_PATH =
    location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        ? '/'
        : '/portfolio/';

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }

    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}