<script>
    import products from "../products";
    import categories from '../categories'

    export let random_num_search;
    let show_search = false;

    
    document.addEventListener('keydown', keyPush);

    function keyPush(event) {
    switch (event.key) {
        case 'Enter':
            if (search_value.length > 0) {
                hideSearch();
                window.location.href = "#/vyhladavanie=/" + search_value;
            }
            else{
                emptyValue();
            }
            break;
        }
    }
    $: {random_num_search; show_search = true}

    function hideSearch(){
        show_search = false;
    }

    let search_value = '';
    let searched_items_categories = [];
    let searched_items_products = [];
    let red_text = false;

    function search(){
        red_text = false;
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
    $: {search_value; search()};

    function emptyValue(){
        red_text = true;
    }

</script>

<main class="search {show_search ? 'active' : ''}" on:load="{hideSearch()}">
    <div class="background-1 background"></div>
    <div class="background-2 background"></div>
    <div class="search-container background {search_value.length > 0 ? 'active' : ''}">
        <form action="javascript:void(0);">
            <div class="input">
                <input type="text" placeholder="Vyhľadavať..." class="{red_text ? 'red' : ''}" bind:value={search_value}>>
                {#if search_value.length == 0}
                    <div class="icon" on:click="{emptyValue}">
                        <i class="fas fa-search"></i>
                    </div>
                {:else}
                    <a href="./#/vyhladavanie=/{search_value}" class="icon" type="submit" on:click="{hideSearch}" on:click="{window.reload}">
                        <i class="fas fa-search"></i>
                    </a>
                {/if}
            </div>
        </form>
        <div class="results">
            {#if searched_items_categories.length != 0}
                <div class="results-title">
                    Kategórie
                </div>
            {/if}
            {#each searched_items_categories as category}
                <a href="#/obchod/{category.title.toLowerCase().split(' ').join('_')}" class="category" on:click="{hideSearch}" on:click="{window.reload}">
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
                <a href="#/obchod/{categories[product.category].title.toLowerCase().split(' ').join('_')}/{(product.title + ' ' + product.version).toLowerCase().split(' ').join('_')}" class="product" on:click="{hideSearch}" on:click="{window.reload}">
                    <div class="product-img">
                        <img src="{product.image_urls[0]}" alt="{product.title + ' ' + product.version}">
                    </div>
                    <div class="result-title">
                        {product.title + ' ' + product.version}
                    </div>
                </a>
            {/each}
            {#if searched_items_categories.length == 0 && searched_items_products == 0 && search_value != 0}
                <div class="nothing-title">Neboli najdené žiadne výsledky</div>
            {/if}
        </div>
        <div class="quit" on:click="{() => hideSearch()}">
            <i class="fas fa-times"></i>
        </div>
    </div>
</main>

<style>
    .background{
        position: fixed;
        top: 0;
        left: 100%;
        width: 100vw;
        height: 100vh;
    }
    .search.active .background{
        left: 0;
    }
    .search.active .background-1{
        background: var(--background1);
        z-index: 98;
        animation: background-1 .8s;
    }
    @keyframes background-1{
        0%{
            left: 100%;
        }
        100%{
            left: 0%;
        }
    }
    .search.active .background-2{
        background: var(--background2);
        z-index: 97;
        animation: background-2 1.5s;
    }
    @keyframes background-2{
        0%{
            left: 100%;
        }
        20%{
            left: 100%;
        }
        100%{
            left: 0%;
        }
    }
    .search.active .search-container{
        background: var(--background3);
        z-index: 99;
        animation: background-3 2.2s;
    }
    @keyframes background-3{
        0%{
            left: 100%;
        }
        20%{
            left: 100%;
        }
        40%{
            left: 100%;
        }
        100%{
            left: 0%;
        }
    }
    .input{
        display: flex;
        background: var(--primary-color);
        width: 500px;
        height: 60px;
        border-radius: 45px;
        color: var(--primary-color);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: .5s;
    }
    .search-container.active .input{
        top: 10%;
        left: 50%;
        transform: translate(-50%, -10%);
        transition: .5s;
    }
    input{
        color: var(--font-color);        
        border: none;
        outline: none;
        background: none;
        padding-left: 25px;
        font-size: 1.1em;
        font-weight: 400;
        width: 440px;
    }
    .red::placeholder{
        color: var(--red-font-color);
    }
    i{
        transition: .5s;
    }
    .icon{
        background: var(--blue-font-color);
        width: 50px;
        height: 50px;
        position: absolute;
        right: 5px;
        top: 5px;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        font-size: 1.3em;
        cursor: pointer;
    }
    .icon i{
        color: var(--primary-color);
    }
    .icon:hover{
        background: var(--font-color);
    }
    .results{
        position: absolute;
        width: 560px;
        padding: 0 30px;
        height: 500px;
        overflow-y: scroll;
        top: 120%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        transition: .5s;
        user-select: none;
    }
    .search-container.active .results{
        top: 20%;
        transition: .5s;
    }
    .results-title{
        color: var(--primary-color);
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
    .quit{
        position: absolute;
        top: 25px;
        right: 50px;
        font-size: 2.5em;
        cursor: pointer;
    }
    .quit i{
        color: var(--primary-color);
        transition: .5s;
    }
    .quit:hover i{
        color: var(--blue-font-color);
        transition: .5s;
    }
    .nothing-title{
        font-size: 1.5em;
        font-weight: 600;
        margin-top: 15px;
        color: var(--primary-color);
    }
    @media only screen and (max-width: 600px){
        .input{
            width: 300px;
            height: 40px;
            border-radius: 30px;
            font-size: .8em;
        }
        input{
            width: 260px;
        }
        .icon{
            width: 30px;
            height: 30px;
            line-height: 30px;
        }
        .results{
            width: 340px;
            padding: 0 20px;
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
        .quit{
            top: 10px;
            right: 20px;
            font-size: 1.2em;
        }
    }
</style>