<script>
    import categories from '../categories';
    import {addToCart} from '../main';

    export let product;
    export let show;
    export let random_num;
    export let selected_color;

    let count = 1;
    let category = categories.filter( x => 
        x.id == product.category
    );

    $: {random_num; show = true}

    function hideProductPreview(){
        show = false;
    }


</script>

<main on:load="{hideProductPreview()}">
    {#if show}
        <div class="container-preview">
            <div class="background"></div>
            <div class="preview">
                <div class="quit" on:click="{() => {show = false}}"><i class="fas fa-times"></i></div>
                <div class="left-container">
                    <div class="product-images">
                        <img src="{product.image_urls[0]}" alt="">
                        {#if product.discount_bollean}
                            <div class="sale-box">Zľava</div>
                        {/if}
                    </div>
                </div>
                <div class="product-information">
                    <div class="product-title">{product.title + ' ' + product.version}</div>
                    <div class="price">
                        {#if product.discount_bollean}
                            <div class="old-price">{product.price.toString().split('.').join(',')} €</div>
                            <div class="new-price">{product.discount_price.toString().split('.').join(',')} €</div>
                        {:else}
                            <div class="new-price">{product.price.toString().split('.').join(',')} €</div>
                        {/if}
                    </div>
                    <div class="producer product-info">Výrobca: <b>{product.producer}</b></div>
                    <div class="availability product-info">Dostupnosť: <b>{product.availability}</b></div>
                    <div class="category product-info">Typ produktu: <b>{category[0].title}</b></div>
                    <div class="color-title product-info"><b>Farba:</b></div>
                    <div class="color">
                        <form>
                            {#each product.colors as color, i}
                                <label style="--radio-color: {color.hex}">
                                    <div class="description">{color.title}<i class="fas fa-caret-down arrow"></i></div>
                                    <input type="radio" name="color_{product.id}" bind:group={selected_color} value="{color}" class="radio">
                                    <span class="design"></span>
                                </label>
                            {/each}
                        </form>
                    </div>
                    <div class="add-to-card-counter">
                        <div class="counter">
                            {count}
                            <div class="counter-arrows">
                                <div on:click={() => count < 10 ? count += 1 : count}><i class="fas fa-chevron-up"></i></div>
                                <div on:click={() => count > 1 ? count -= 1 : count}><i class="fas fa-chevron-down"></i></div>
                            </div>
                        </div>
                        <div class="add-to-card" on:click="{addToCart(product, selected_color, count)}">
                            <i class="fas fa-cart-plus"></i> Pridať do košíka
                        </div>
                    </div>
                    <div class="show-full-view">
                        <a href="#/obchod/{categories[product.category].title.toLowerCase().split(' ').join('_')}/{(product.title + ' ' + product.version).toLowerCase().split(' ').join('_')}">alebo zobraziť celý náhľad</a>
                    </div>
                </div>
            </div>
        </div>
    {/if}
    <script>
    </script>
</main>

<style>
    .left-container{
        user-select: none;
    }
    .container-preview{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 4;
    }
    .background{
        background: var(--font-color);
        opacity: .3;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
    .preview{
        display: flex;
        width: 900px;
        background: var(--primary-color);
        height: 520px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        box-shadow: -1px 1px 60px -53px rgba(0, 0, 0, 0.65);
    }
    .quit{
        position: absolute;
        top: 0;
        right: 0;
    }
    .product-images{
        width: 400px;
        height: 400px;
        margin-top: 60px;
        margin-left: 40px;
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
    .product-information{
        margin-left: 35px;
        margin-top: 60px;
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
        background: var(--blue-font-color);
        border: 1px solid var(--blue-font-color);
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
    .show-full-view{
        margin: 20px 0;
        cursor: pointer;
        transition: .5s;
        font-weight: 500;
    }
    .show-full-view a{
        transition: .5s;
        text-decoration: underline;
    }
    .show-full-view a:hover{
        color: var(--blue-font-color);
        transition: .5s;
    }
    .quit i{
        font-size: 1.3em;
        padding: 10px 15px;
        transition: .5s;
        cursor: pointer;
    }
    .quit i:hover{
        background: var(--red-font-color);
        color: var(--primary-color);
        transition: .5s;
    }
    @media only screen and (max-width: 900px){
        .container-preview{
            display: none;
        }
    }
</style>