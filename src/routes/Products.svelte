<script>
    import Product from '../components/Product.svelte';

    import products from "../products";
    import categories from '../categories'

    export let params = {};
    
    let category = categories.filter( x => 
        x.title.toLowerCase() == params.category.split('_').join(' ')
        );

    if (category.length == 0) {
        location.replace("#/NotFound");
    }

    let products_filtered = products.filter( x => 
        x.category == category[0].id
        );

    $: products_filtered;

    let selected;

    function changedOption(){
        if (selected == "1") {
            products_filtered = products_filtered.sort((a, b) => (a.id > b.id) ? 1 : (a.id === b.id) ? 1 : -1);
        }
        else if (selected == "2") {
            products_filtered = products_filtered.sort((a, b) => ((a.discount_bollean ? a.discount_price : a.price) > (b.discount_bollean ? b.discount_price : b.price)) ? 1 : ((a.discount_bollean ? a.discount_price : a.price) === (b.discount_bollean ? b.discount_price : b.price)) ? 1 : -1);
        }
        else if (selected == "3") {
            products_filtered = products_filtered.sort((a, b) => ((a.discount_bollean ? a.discount_price : a.price) < (b.discount_bollean ? b.discount_price : b.price)) ? 1 : ((a.discount_bollean ? a.discount_price : a.price) === (b.discount_bollean ? b.discount_price : b.price)) ? 1 : -1);
        }
        else if (selected == "4") {
            products_filtered = products_filtered.sort((a, b) => (a.title > b.title) ? 1 : (a.title === b.title) ? 1 : -1);
        }
        else if (selected == "5") {
            products_filtered = products_filtered.sort((a, b) => (a.title < b.title) ? 1 : (a.title === b.title) ? 1 : -1);
        }
}
</script>

<svelte:head>
    <title>{category[0].title}</title>
</svelte:head>

<main>
    <div class="container">
        <div class="title">{category[0].title}</div>
        <div class="nav">
            <a href="./#">Domov</a> / <a href="./#/obchod">Obchod</a> / <span class="blue">{category[0].title}</span>
        </div>
        <div class="filter">
            <form on:change|preventDefault="{changedOption}">
                <select bind:value={selected}>
                    <option value="1">Zoradiť podľa: odporúčané</option>
                    <option value="2">Zoradiť podľa: najlacnejšie</option>
                    <option value="3">Zoradiť podľa: najdrahšie</option>
                    <option value="4">Zoradiť podľa: od A po Z</option>
                    <option value="5">Zoradiť podľa: od Z po A</option>
                </select>
            </form>
        </div>
        <Product products="{products_filtered}"/>
    </div>
</main>

<style>
    main{
        background: var(--primary-color);
    }
    .title{
        text-align: center;
        padding-top: 25px;
        font-size: 40px;
        font-weight: 500;
    }
    .nav{
        text-align: center;
    }
    form{
        position: relative;
        padding-bottom: 30px;
    }
    select {
        width: 200px;
        margin-top: 10px;
        height: 30px;
        font-size: .8em;
        border-radius: 5px;
        border: none;
        padding-left: 10px;
        border: 1px solid var(--grey-font-color);
        transition: .5s;
        background: var(--secondary-color);
        position: absolute;
        right: 0;
    }
    select:focus {
        outline: none;
        border: 1px solid var(--blue-font-color);
        transition: .5s;
    }
    @media only screen and (max-width: 750px){
        .title{
            margin-top: 80px;
        }
        select{
            margin-top: 30px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    @media only screen and (max-width: 520px){
        .title{
            font-size: 1.5em;
        }
        .nav{
            padding: 0 10px;
            font-size: 1em;
            line-height: 1.5em;
            margin-top: 20px;
        }
    }
</style>