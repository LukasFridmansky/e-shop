import App from './App.svelte';

const app = new App({
    target: document.body,
    props: {}
});

export default app;

// hamburger menu
const hamburger = document.querySelector(".hamburger");
const header = document.querySelector("header");
const nav = document.querySelector(".navigation");

export function hamburgerMenu(width) {
    if (width <= 750 || nav.classList.contains('active')) {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        header.classList.toggle('active');
    }
}

// dark-mode toggle
const body = document.querySelector('main');
const toggle = document.querySelector('#toggle');

let theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light';

if (theme == 'dark') {
    body.classList.toggle('dark');
    document.querySelector(".sun-logo").classList.toggle("animate-sun");
    document.querySelector(".moon-logo").classList.toggle("animate-moon");
}

toggle.onclick = function() {
    body.classList.toggle('dark');
    document.querySelector(".sun-logo").classList.toggle("animate-sun");
    document.querySelector(".moon-logo").classList.toggle("animate-moon");

    if (theme == 'light') {
        theme = 'dark';
    } else if (theme == 'dark') {
        theme = 'light';
    }

    localStorage.setItem('theme', theme);
}

// cart
let cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];

let added_to_cart = document.querySelector('.added-to-cart');
let cart_includes = document.querySelector('.cart-includes-item');
let deleted_item = document.querySelector('.item-deleted');
let added_to_wish = document.querySelector('.added-to-wish');
let wish_includes = document.querySelector('.wish-includes-item');
let deleted_item_from_wish = document.querySelector('.item-deleted-from-wish');

export function addToCart(product, color, quantity) {
    cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
    let card_includes_item = true;
    let cart_item = [product, color, quantity];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i][0].id == cart_item[0].id && cart[i][1].title == cart_item[1].title) {
            card_includes_item = false;
        }
    }
    if (card_includes_item) {
        cart_includes.classList.remove('active');
        deleted_item.classList.remove('active');
        wish_includes.classList.remove('active');
        deleted_item_from_wish.classList.remove('active');
        added_to_wish.classList.remove('active');
        cart.push(cart_item);
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("totalSum", calculateTotalSum(cart));

        if (!added_to_cart.classList.contains('active')) {
            added_to_cart.classList.add('active');
            setTimeout(() => {
                added_to_cart.classList.remove('active');
            }, 5000);
        }
    } else {
        added_to_cart.classList.remove('active');
        deleted_item.classList.remove('active');
        wish_includes.classList.remove('active');
        deleted_item_from_wish.classList.remove('active');
        added_to_wish.classList.remove('active');

        if (!cart_includes.classList.contains('active')) {
            cart_includes.classList.add('active');
            setTimeout(() => {
                cart_includes.classList.remove('active');
            }, 5000);
        }
    }
}

export function removeItemFromCart(item_index) {
    cart_includes.classList.remove('active');
    added_to_cart.classList.remove('active');
    wish_includes.classList.remove('active');
    deleted_item_from_wish.classList.remove('active');
    added_to_wish.classList.remove('active');
    cart.splice(item_index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalSum", calculateTotalSum(cart));


    if (!deleted_item.classList.contains('active')) {
        deleted_item.classList.add('active');
        setTimeout(() => {
            deleted_item.classList.remove('active');
        }, 5000);
    }
}

export function calculateTotalSum(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i][0].discount_bollean) {
            total += cart[i][0].discount_price * cart[i][2];
        } else {
            total += cart[i][0].price * cart[i][2];
        }
    }
    return total.toFixed(2);
}

// wishlist
let wishlist = JSON.parse(localStorage.getItem("wishlist")) ? JSON.parse(localStorage.getItem("wishlist")) : [];


export function addToWishlist(product) {
    wishlist = JSON.parse(localStorage.getItem("wishlist")) ? JSON.parse(localStorage.getItem("wishlist")) : [];
    let wish_includes_item = true;
    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id == product.id) {
            wish_includes_item = false;
        }
    }
    if (wish_includes_item) {
        cart_includes.classList.remove('active');
        deleted_item.classList.remove('active');
        added_to_cart.classList.remove('active');
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        wish_includes.classList.remove('active');
        deleted_item_from_wish.classList.remove('active');
        if (!added_to_wish.classList.contains('active')) {
            added_to_wish.classList.add('active');
            setTimeout(() => {
                added_to_wish.classList.remove('active');
            }, 5000);
        }
    } else {
        added_to_wish.classList.remove('active');
        cart_includes.classList.remove('active');
        deleted_item.classList.remove('active');
        added_to_cart.classList.remove('active');
        deleted_item_from_wish.classList.remove('active');
        if (!wish_includes.classList.contains('active')) {
            wish_includes.classList.add('active');
            setTimeout(() => {
                wish_includes.classList.remove('active');
            }, 5000);
        }
    }
}
export function removeItemFromWish(item_index) {
    added_to_wish.classList.remove('active');
    wish_includes.classList.remove('active');
    cart_includes.classList.remove('active');
    deleted_item.classList.remove('active');
    added_to_cart.classList.remove('active');
    wishlist.splice(item_index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (!deleted_item_from_wish.classList.contains('active')) {
        deleted_item_from_wish.classList.add('active');
        setTimeout(() => {
            deleted_item_from_wish.classList.remove('active');
        }, 5000);
    }
}