<script>
    export let params = {};

    import products from "../products";
    import categories from '../categories'

    let search_value = params.search_value;
    let searched_items_categories = [];
    let searched_items_products = [];

    $: {params; window.scrollTo(0, 0)}

    function isParamsChanged(){
        search_value = params.search_value;
        search();
        setInterval(() => {
            isParamsChanged()
        }, 100);
    }
    isParamsChanged();

    function search(){
        searched_items_categories = [];
        if (search_value.length > 0) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].title.toLowerCase().includes(search_value.toLowerCase())) {
                    searched_items_categories.push(categories[i]);
                }
            }   
        }
        searched_items_products = [];
        if (search_value.length > 0) {
            for (let i = 0; i < products.length; i++) {
                if (products[i].title.toLowerCase().includes(search_value.toLowerCase()) || categories[products[i].category].title.toLowerCase().includes(search_value.toLowerCase()) || products[i].version.toLowerCase().includes(search_value.toLowerCase()) || products[i].producer.toLowerCase().includes(search_value.toLowerCase())) {
                    searched_items_products.push(products[i]);
                }
            }   
        }
    }
    
</script>

<svelte:head>
    <title>Výsledky vyhľadadvnia pre: {search_value}</title>
</svelte:head>

<main>
    <div class="search-container">
        <div class="title-container">
            <div class="title">Výsledky vyhľadavanie pre: {search_value}</div>
        </div>
        <div class="container">
            <a href="./#" class="button-a">
                <div class="button">
                    Vrátiť sa na domovskú stránku
                </div>
            </a>
            <div class="results">
                {#if searched_items_categories.length != 0}
                    <div class="results-title">
                        Kategórie
                    </div>
                {/if}
                {#each searched_items_categories as category}
                    <a href="#/obchod/{category.title.toLowerCase().split(' ').join('_')}" class="category">
                        <div class="category-icon"><i class="fas fa-folder-open"></i></div>
                        <div class="result-title">
                            {category.title}
                        </div>
                    </a>
                {/each}
                {#if searched_items_products.length != 0}
                    <div class="results-title">
                        Produkty
                    </div>
                {/if}
                {#each searched_items_products as product}
                    <a href="#/obchod/{categories[product.category].title.toLowerCase().split(' ').join('_')}/{(product.title + ' ' + product.version).toLowerCase().split(' ').join('_')}" class="product">
                        <div class="product-img">
                            <img src="{product.image_urls[0]}" alt="{product.title + ' ' + product.version}">
                        </div>
                        <div class="result-title">
                            {product.title + ' ' + product.version}
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>
    .search-container{
        background: var(--primary-color);
    }
    .title{
        text-align: center;
        font-size: 2.4em;
        font-weight: 500;
    }
    .title-container{
        padding: 50px 0;
        background: var(--secondary-color);
    }
    .button{
		background: var(--blue-font-color);
		color: var(--font-color-unchanged);
		font-weight: 600;
		text-align: center;
		padding: 15px;
		margin-top: 15px;
		cursor: pointer;
		transition: .5s;
	}
	.button:hover{
		background: var(--font-color);
		color: var(--primary-color);
		box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
		transition: .5s;
	}
	.button-a{
		color: var(--font-color-unchanged);
		display: block;
		width: 300px;
		height: 100%;
        margin: 20px auto;
		transition: .5s;
	}
	.button-a:hover{
		color: var(--secondary-color);
		transition: .5s;
	}
    i{
        transition: .5s;
    }
    .results{
        position: relative;
        width: 560px;
        padding: 20px 30px;
        transition: .5s;
        user-select: none;
        margin: 0 auto;
    }
    .results-title{
        color: var(--font-color);
        font-size: 1.2em;
        font-weight: 600;
        padding: 15px 0;
    }
    .category, .product{
        display: block;
        width: 100%;
        height: 80px;
        background: var(--secondary-color);
        margin-bottom: 15px;
        border-radius: 10px;
        display: flex;
        line-height: 80px;
    }
    .category:hover .result-title, .category:hover .category-icon i, .product:hover .result-title{
        color: var(--blue-font-color);
        transition: .5s;
    }
    .result-title{
        font-size: 1.2em;
        transition: .5s;
    }
    .category-icon{
        padding: 0 15px 0 30px;
        font-size: 1.5em;
        transition: .5s;
    }
    .product-img{
        border-radius: 0;
        width: 60px;
        height: 60px;
        margin: 10px 15px 10px 30px;
        overflow: hidden;
    }
    .product-img img{
        width: auto;
        height: 100%;
    }
    @media only screen and (max-width: 750px){
        .title-container{
            padding: 150px 0 50px 0;
            background: var(--secondary-color);
        }
    }
    @media only screen and (max-width: 670px){
        .title{
            font-size: 1.4em;
        }
        .button-a{
            width: 200px;
            height: 100%;
            font-size: .8em;
        }
        .results{
            width: 340px;
            padding: 20px 20px;
            font-size: .7em;
        }
        .category, .product{
            height: 60px;
            border-radius: 10px;
            line-height: 60px;
        }
        .product-img{
            width: 40px;
            height: 40px;
            margin: 10px 15px 10px 20px;
            overflow: hidden;
        }
    }
    @media only screen and (max-width: 400px){
        .title{
            font-size: 1.2em;
        }
        .results{
            width: 90%;
            padding: 20px 0;
            font-size: .7em;
        }
        .category, .product{
            height: 50px;
            border-radius: 8px;
            line-height: 50px;
        }
        .product-img{
            width: 36px;
            height: 36px;
            margin: 7px 10px 7px 15px;
            overflow: hidden;
        }
    }
</style>