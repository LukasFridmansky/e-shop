<script>
    import Product from '../components/Product.svelte';

    import products from "../products";
    import categories from '../categories'
    export let params = {};
    import {addToCart} from '../main';
    import {addToWishlist} from '../main';
    
    let category = categories.filter( x => 
        x.title.toLowerCase() == params.category.split('_').join(' ')
        );
    
    if (category.length == 0) {
        location.replace("#/NotFound");
    }

    let products_filtered = products.filter( x => 
        x.category == category[0].id
        );
    
    if (products_filtered.length == 0) {
        location.replace("#/NotFound");
    }

    let product = products_filtered.filter( x => 
        (x.title.toLowerCase() + ' ' + x.version.toLowerCase()) == params.product.split('_').join(' ')
        );
    if (product.length == 0) {
        location.replace("#/NotFound");
    }

    let selected_color = product[0].colors[0];
    let count = 1;
    let img = 0;

</script>

<svelte:head>
    <title>{product[0].title + ' ' + product[0].version}</title>
</svelte:head>

<main>
    <div class="title-container">
        <div class="title">{product[0].title + ' ' + product[0].version}</div>
        <div class="nav">
            <a href="./">Domov</a> / <a href="./#/obchod">Obchod</a> / <a href="./#/obchod/{params.category}">{category[0].title}</a> / <span class="blue">{product[0].title + ' ' + product[0].version}</span>
        </div>
    </div>
    <div class="container">
        <div class="product-container">
            <div class="left-container">
                <div class="product-images">
                    <img src="{product[0].image_urls[img]}" alt="">
                    {#if product[0].discount_bollean}
                        <div class="sale-box">Zľava</div>
                    {/if}
                    <div class="img-index">{img + 1} / {product[0].image_urls.length}</div>
                </div>
                <div class="arrows">
                    {#if product[0].image_urls.length > 1}
                    <i class="fas fa-chevron-left {img == 0 ? 'active' : ''}" on:click="{() => img > 0 ? img -= 1 : img}"></i>
                    <i class="fas fa-chevron-right {img == (product[0].image_urls.length - 1) ? 'active' : ''}" on:click="{() => img < (product[0].image_urls.length - 1) ? img += 1 : img}"></i>
                    {/if}
                </div>
            </div>
            <div class="product-information">
                <div class="product-title">{product[0].title + ' ' + product[0].version}</div>
                <div class="price">
                    {#if product[0].discount_bollean}
                        <div class="old-price">{product[0].price.toFixed(2).toString().split('.').join(',')} €</div>
                        <div class="new-price">{product[0].discount_price.toFixed(2).toString().split('.').join(',')} €</div>
                    {:else}
                        <div class="new-price">{product[0].price.toFixed(2).toString().split('.').join(',')} €</div>
                    {/if}
                </div>
                <div class="short-description">{product[0].short_description}</div>
                <div class="producer product-info">Výrobca: <b>{product[0].producer}</b></div>
                <div class="availability product-info">Dostupnosť: <b>{product[0].availability}</b></div>
                <div class="category product-info">Typ produktu: <b>{category[0].title}</b></div>
                <div class="color-title product-info"><b>Farba:</b></div>
                <div class="color">
                    <form>
                        {#each product[0].colors as color}
                            <label style="--radio-color: {color.hex}">
                                <div class="description">{color.title}<i class="fas fa-caret-down arrow"></i></div>
                                <input type="radio" name="color" bind:group={selected_color} value="{color}">
                                <span class="design"></span>
                            </label>
                        {/each}
                    </form>
                </div>
                <div class="info-links">
                    <div class="shipping link"><a href="#/shipping"><i class="fas fa-truck"></i> Doprava</a></div>
                    <div class="question link"><a href="#/kontakt"><i class="fas fa-envelope"></i> Opýtajte sa k tomuto produktu</a></div>
                </div>
                <div class="add-to-card-counter">
                    <div class="counter">
                        {count}
                        <div class="counter-arrows">
                            <div on:click={() => count < 10 ? count += 1 : count}><i class="fas fa-chevron-up"></i></div>
                            <div on:click={() => count > 1 ? count -= 1 : count}><i class="fas fa-chevron-down"></i></div>
                        </div>
                    </div>
                    <div class="add-to-card" on:click="{addToCart(product[0], selected_color, count)}">
                        <i class="fas fa-cart-plus"></i> Pridať do košíka
                    </div>
                </div>
                <div class="add-to-wishlist" on:click="{() => addToWishlist(product[0])}">
                    <i class="fas fa-heart"></i> Pridať do wishlistu
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    main{
        background: var(--primary-color);
    }
    .title{
        text-align: center;
        font-size: 40px;
        font-weight: 500;
    }
    .nav{
        text-align: center;
    }
    .title-container{
        padding: 50px 0;
        background: var(--secondary-color);
    }
    .left-container{
        user-select: none;
    }
    .product-container{
        display: flex;
        margin-top: 50px;
    }
    .product-images{
        width: 500px;
        height: 500px;
        overflow: hidden;
        position: relative;
    }
    .product-images img{
        width: auto;
        height: 100%;
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
        left: 10px;
    }
    .img-index{
        position: absolute;
        bottom: 15px;
        right: 15px;
        color: var(--dark-color-unchanged);
        font-weight: 500;
    }
    .arrows{
        width: 90px;
        height: 40px;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        margin-top: 20px;
    }
    .arrows i{
        display: block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: var(--blue-font-color);
        border-radius: 5px;
        color: var(--primary-color);
        cursor: pointer;
    }
    .arrows i.active{
        cursor: default;
        background: var(--darkblue-font-color);
    }
    .arrows i.active:hover{
        cursor: default;
        background: var(--darkblue-font-color);
    }
    .arrows i:hover{
        background: var(--font-color);
    }
    .product-information{
        margin-left: 35px;
    }
    .product-title{
        font-size: 1.6em;
        font-weight: 500;
    }
    .price{
        display: flex;
        font-weight: 500;
        padding: 15px 0;
    }
    .old-price{
        margin-right: 10px;
        text-decoration: line-through;
        color: var(--grey-font-color);
    }
    .new-price{
        color: var(--blue-font-color);
    }
    .short-description{
        font-size: 1.1em;
        line-height: 1.8em;
        width: 80%;
        font-weight: 500;
        padding-bottom: 25px;
    }
    .product-info{
        line-height: 2em;
        font-size: 1.1em;
    }
    .color form{
        display: flex;
    }
    label {
        display: flex;
        margin-bottom: 12px;
        margin-right: 5px;
        cursor: pointer;
        position: relative;
    }
    input {
        opacity: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
    }
    .design {
        width: 1.4em;
        height: 1.4em;
        border: 1px solid var(--font-color);
        border-radius: 100%;
        background: var(--radio-color);
        position: relative;
    }
    .design::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        position: absolute;
        transform: scale(0);
    }
    .design:before {
        background: var(--radio-color);
        opacity: 0;
        transition: .3s;
    }
    input:hover+.design,
    input:focus+.design,
    input:checked+.design {
        background: rgb(19, 99, 174);
        border: 1px solid rgb(19, 99, 174);
    }
    input:hover+.design:before,
    input:focus+.design:before,
    input:checked+.design::before {
        background: var(--radio-color);
        opacity: 1;
        transform: scale(.8);
    }
    label .description{
        display: none;
        position: absolute;
        text-align: center;
        font-size: .5em;
        padding: 5px;
        line-height: 15px;
        background: var(--font-color);
        color: var(--primary-color);
        position: absolute;
        left: 50%;
        top: -35px;
        margin-left: -25px;
        width: 50px;
    }
    label .description .arrow{
        position: absolute;
        width: 5px;
        font-size: 2.2em;
        left: 50%;
        bottom: -8px;
        margin-left: -5px;
        color: var(--font-color);
    }
    label:hover .description .arrow{
        color: var(--font-color);
    }
    label:hover .description{
        display: block;
    }
    .info-links{
        display: flex;
        text-transform: uppercase;
        font-weight: 500;
        padding: 15px 0;
    }
    .shipping{
        margin-right: 15px;
    }
    .link a{
        transition: .5s;
    }
    .link i{
        transition: .5s;
    }
    .link:hover a,
    .link:hover i{
        color: var(--blue-font-color);
        transition: .5s;
    }
    .add-to-card-counter{
        display: flex;
    }
    .counter{
        width: 140px;
        height: 50px;
        background: var(--secondary-color);
        font-size: 1.3em;
        line-height: 50px;
        text-align: center;
        position: relative;
        top: 50%;
        transform: translate( 0 -50%);
        user-select: none;
        margin-right: 15px;
    }
    .counter-arrows{
        line-height: .8em;
        opacity: 0;
        font-size: .4em;
        position: absolute;
        top: 50%;
        right: 2px;
        transform: translateY(-50%);
        transition: .5s;
    }
    .counter:hover .counter-arrows{
        opacity: 1;
        transition: .5s;
    }
    .counter-arrows i{
        padding: 1px 2px;
    }
    .counter-arrows i:hover{
        color: var(--grey-font-color);
    }
    .add-to-card{
        width: 180px;
        height: 50px;
        line-height: 50px;
        background: var(--blue-font-color);
        text-align: center;
        font-weight: 500;
        font-size: 1.1em;
        cursor: pointer;
        color: var(--font-color-unchanged);
        transition: .5s;
        user-select: none;
    }
    .add-to-card i{
        color: var(--font-color-unchanged);
        transition: .5s;
    }
    .add-to-card:hover{
        background: var(--font-color);
        color: var(--primary-color);
        box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
        transition: .5s;
    }
    .add-to-card:hover i{
        color: var(--primary-color);
        transition: .5s;
    }
    .add-to-wishlist{
        margin: 20px 0;
        cursor: pointer;
        transition: .5s;
    }
    .add-to-wishlist i{
        transition: .5s;
    }
    .add-to-wishlist:hover,
    .add-to-wishlist:hover i{
        color: var(--blue-font-color);
        transition: .5s;
    }
</style>