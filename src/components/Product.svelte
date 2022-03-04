<script>

    import categories from "../categories";
    import allProducts from '../products'
    export let products;
    import ProductPreview from '../components/ProductPreview.svelte';
    import {addToCart} from '../main';
    import {addToWishlist} from '../main';

    let show = false;
    let random_num = Math.random();

    let product_index = 0;

    function showProductPreview(index){
        product_index = index;
        show = true;
        random_num = Math.random();
    }
</script>

<main>
    <ProductPreview product="{allProducts[product_index]}" {show} {random_num} selected_color="{allProducts[product_index].colors[0]}"/>
    <div class="products container">
        {#each products as product}
            <div class="product">
                <div class="image-box">
                    <div class="image-box-background"></div>
                    {#if product.discount_bollean}
                        <div class="sale-box">Zľava</div>
                    {/if}
                    <div class="product-img">
                        <img src="{product.image_urls[0]}" alt="{product.title}">
                    </div>
                    <div class="links">
                        <div class="add-to-basket link" on:click="{addToCart(product, product.colors[0], 1)}"><div class="description">Pridať do košíka<i class="fas fa-caret-down arrow"></i></div><i class="fas fa-cart-plus"></i></div>
                        <div class="add-to-wishlist link" on:click="{() => addToWishlist(product)}"><div class="description">Pridať do wishlistu<i class="fas fa-caret-down arrow"></i></div><i class="fas fa-heart"></i></div>
                        <div class="show-details link" on:click="{showProductPreview(product.id)}"><div class="description">Pozrieť náhľad<i class="fas fa-caret-down arrow"></i></div><i class="fas fa-search-plus"></i></div>
                    </div>
                </div>
                <a href="#/obchod/{categories[product.category].title.toLowerCase().split(' ').join('_')}/{(product.title + ' ' + product.version).toLowerCase().split(' ').join('_')}" class="product-link">
                    <div class="product-title">{product.title} {product.version}</div>
                </a>
                <div class="price">
                    {#if product.discount_bollean}
                        <div class="old-price">{product.price.toFixed(2).toString().split('.').join(',')} €</div>
                        <div class="new-price">{product.discount_price.toFixed(2).toString().split('.').join(',')} €</div>
                    {:else}
                        <div class="new-price">{product.price.toFixed(2).toString().split('.').join(',')} €</div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    .products{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 40px 0;
    }
    .product{
        width: 290px;
        height: 360px;
        margin-right: 30px;
        margin-bottom: 30px;
    }
    .product:nth-child(4n){
        margin-right: 0;
    }
    .sale-box{
        width: 38px;
        height: 18px;
        text-align: center;
        background: var(--red-font-color);
        color: var(--font-color-unchanged);
        font-size: .6em;
        font-weight: 500;
        line-height: 18px;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .image-box{
        width: 100%;
        height: 290px;
        position: relative;
        box-shadow: -1px 1px 60px -53px rgba(0, 0, 0, 0.65);
        user-select: none;
    }
    .image-box-background{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #00000000;
        transition: .8s;
    }
    .product:hover .image-box-background{
        background: #000000a8;
        transition: .8s;
    }
    .image-box .product-img{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .image-box .product-img img{
        height: 100%;
    }
    .links{
        display: flex;
        width: 130px;
        justify-content: space-between;
        position: absolute;
        left: 70px;
        bottom: 0;
        opacity: 0;
        transition: .5s;
    }
    .link{
        background: var(--primary-color);
        font-size: 1.1em;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        box-shadow: -1px 1px 60px -53px rgba(0, 0, 0, 0.65);
        border-radius: 100%;
        cursor: pointer;
        position: relative;
    }
    .link:hover{
        background: var(--blue-font-color);
    }
    .link:hover i{
        color: var(--primary-color);
        transition: .5s;
    }
    .link i{
        transition: .5s;
    }
    .links .description{
        display: none;
        position: absolute;
        font-size: .5em;
        padding: 5px;
        line-height: 15px;
        background: var(--font-color);
        color: var(--primary-color);
        position: absolute;
        left: 50%;
        top: -35px;
        margin-left: -50px;
        width: 100px;
    }
    .description .arrow{
        position: absolute;
        width: 5px;
        font-size: 2.2em;
        left: 50%;
        bottom: -10px;
        margin-left: -5px;
        color: var(--font-color);
    }
    .link:hover .description .arrow{
        color: var(--font-color);
    }
    .link:hover .description{
        display: block;
    }
    .product:hover .links{
        opacity: 1;
        bottom: 30px;
        transition: .8s;
    }
    .product-title{
        padding: 20px 0 10px 0;
        font-size: 1.2em;
        font-weight: 600;
    }
    a:hover .product-title{
        color: var(--blue-font-color);
        transition: .5s;
    }
    a .product-title{
        transition: .5s;
    }
    .price{
        display: flex;
        font-weight: 500;
    }
    .old-price{
        margin-right: 10px;
        text-decoration: line-through;
        color: var(--grey-font-color);
    }
    .new-price{
        color: var(--blue-font-color);
    }
</style>