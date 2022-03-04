<script>
    import products from '../products';
    import categories from '../categories';

    import BestProducts from '../components/BestProducts.svelte';
    import Sale from '../components/Sale.svelte';
    import Product from '../components/Product.svelte';

    let most_sold_products = [products[0], products[1], products[2], products[3]];
</script>

<svelte:head>
    <title>Náš obchod</title>
</svelte:head>

<main>
    <div class="container">
        <div class="nav">
            <a href="./public">Domov</a> / <span class="blue">Obchod</span>
        </div>
    </div>
    <BestProducts best_products="{[products[0], products[5]]}" />
    <div class="container">
        <div class="title">Kategórie</div>
        <div class="lines">
            <div class="line"></div>
            <div class="line"></div>
        </div>
        <div class="categories">
            {#each categories as category}
                <a href="#/obchod/{category.title.toLowerCase().split(' ').join('_')}">
                    <div class="category-card">
                        <div class="category-image">
                            <img src="{category.image}" alt="{category.title}">
                        </div>
                        <div class="category-title">{category.title}</div>
                    </div>
                </a>
            {/each}
        </div>
        <Sale shop_now_btn={false}/>
        <div class="title">Najpredavanejšie</div>
        <div class="lines">
            <div class="line"></div>
            <div class="line"></div>
        </div>
    </div>
    <Product products="{most_sold_products}"/>
</main>

<style>
    main {
        background: var(--secondary-color);
    }
    .nav{
        margin: 0;
        padding-top: 50px;
    }

    .title {
        padding: 50px 0 10px 0;
        font-size: 1.7em;
        font-weight: 700;
        user-select: none;
    }

    .lines {
        display: flex;
    }

    .line:first-child {
        width: 10%;
        height: 1px;
        background-color: var(--blue-font-color);
    }

    .line:last-child {
        width: 90%;
        height: 1px;
        background-color: var(--grey-font-color);
    }

    .categories {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 40px;
    }

    .category-card {
        width: 230px;
        height: 230px;
        box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
        text-align: center;
        margin-bottom: 20px;
        background: var(--primary-color);
        user-select: none;
    }

    .category-image {
        height: 60%;
        margin: 0 auto;
        padding-top: 40px;
    }

    .category-image img {
        height: 100%;
        transform: scale(.8);
        transition: .5s;
    }

    .category-card:hover img {
        transform: scale(.9);
        transition: .5s;
    }

    .category-title {
        font-size: 1.2em;
        font-weight: 600;
        margin-top: 10px;
    }
</style>