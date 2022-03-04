<script>
    import categories from '../categories';

    export let best_products;
</script>

<main>
    <div class="best-products container">
        {#each best_products as product}
            <div class="best-product">
                <div class="information-card">
                    <div class="category">{categories[product.category].title}</div>
                    <div class="p-title">{product.title} {product.version}</div>
                    <div class="btn-price">
                        <a href="#/obchod/{categories[product.category].title.toLowerCase().split(' ').join('_')}/{(product.title + ' ' + product.version).toLowerCase().split(' ').join('_')}" class="shop-btn">
                            <i class="fas fa-shopping-cart"></i>
                            Nakúpovať
                        </a> 
                        <div class="price">{product.price.toString().split('.').join(',')} €</div>
                    </div>
                </div>
                <div class="right-image">
                    <img src="{product.png_image}" alt="{product.title}">
                </div>
            </div>
        {/each}
    </div>
</main>

<style> 
    .best-products {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 50px;
    }

    .best-product {
        width: 48%;
        height: 240px;
        display: flex;
        justify-content: space-between;
        border-radius: 5px;
        box-shadow: -1px 1px 60px -53px rgba(0, 0, 0, 0.65);
        user-select: none;
        margin-bottom: 10px;
    }

    .best-product:first-child {
        background: #fff0e6;
    }

    .best-product:last-child {
        background: #d5e1fc;
    }

    .information-card {
        position: relative;
        width: 50%;
        margin-left: 20px;
        height: 160px;
        margin-top: 40px;
    }

    .category {
        font-weight: 500;
        color: #7e7e7e;
    }

    .p-title {
        padding: 10px 0;
        font-weight: 600;
        font-size: 1.7em;
        color: #212529;
    }

    .btn-price {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 260px;
    }

    .shop-btn {
        display: block;
        width: 150px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 1em;
        background: var(--blue-font-color);
        color: var(--font-color-unchanged);
        border-radius: 5px;
        font-weight: 500;
        transition: .5s;
    }

    .shop-btn:hover {
        background: var(--dark-color-unchanged);
        color: var(--font-color-unchanged);
        border-radius: 5px;
        font-weight: 500;
        box-shadow: -1px 1px 60px -53px rgba(0, 0, 0, 0.65);
        transition: .5s;
    }

    .shop-btn i {
        color: var(--font-color-unchanged);
        margin-right: 5px;
        transition: .5s;
    }

    .shop-btn:hover i {
        color: var(--blue-font-color);
        transition: .5s;
    }

    .price {
        font-size: 1.3em;
        line-height: 45px;
        font-weight: 500;
        color: var(--blue-font-color);
        padding-left: 20px;
    }

    .right-image {
        position: relative;
    }

    .right-image img {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 240px;
        width: auto;
    }
        
</style>