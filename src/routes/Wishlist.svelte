<script>
    import {addToCart, removeItemFromWish} from '../main';

    $: wishlist = JSON.parse(localStorage.getItem("wishlist")) ? JSON.parse(localStorage.getItem("wishlist")) : [];
	function IsCartChanged(){
		wishlist = JSON.parse(localStorage.getItem("wishlist")) ? JSON.parse(localStorage.getItem("wishlist")) : [];
		setTimeout(() => {
			IsCartChanged();
		}, 100);
	}
	IsCartChanged();
	
</script>

<svelte:head>
    <title>Tvoj wishlist</title>
</svelte:head>


<main>
    <div class="title-container">
        <div class="title">Wishlist</div>
        <div class="nav">
            <a href="./#">Domov</a> / <span class="blue">Wishlist</span>
        </div>
    </div>
    <div class="container wishlist">
        <div class="wish-title">Tvoj wishlist  ({wishlist.length})</div>
        <div class="lines">
            <div class="blue-line"></div>
            <div class="line"></div>
        </div>
        <table>
            {#if wishlist.length > 0}
                <tr>
                    <th>Produkt</th>
                    <th>Cena</th>
                </tr>
            {/if}
            {#each wishlist as wish, i}
                <tr class="wish-item">
                    <td><a href="#/">{wish.title + ' ' + wish.version}</a></td>
                    <td class="price">
                        <span class="price-num">
                            {#if wish.discount_bollean}
                                <b class="old-price">{wish.price.toString().split('.').join(',')} €</b>
                                {wish.discount_price.toString().split('.').join(',')} €
                            {:else}
                                {wish.price.toString().split('.').join(',')} €
                            {/if}
                        </span>
                        <span class="icons">
                            <span class="add-to-cart icon" on:click="{() => addToCart(wish, wish.colors[0], 1)}">
                                <i class="fas fa-cart-plus"></i>
                            </span>
                            <span class="remove-from-wishlist icon" on:click="{() => removeItemFromWish(i)}">
                                <i class="fas fa-trash"></i>
                            </span>
                        </span>
                    </td>
                </tr>
            {:else}
                Tvoj zoznam prijaní je prázdny
                <a href="#/obchod" class="button-a">
                    Prezerať obchod
                </a>
            {/each}
        </table>
    </div>
</main>

<style>
    main{
        background: var(--primary-color);
        min-height: 500px;
    }
    .title{
        text-align: center;
        font-size: 40px;
        font-weight: 500;
    }
    .nav{
        text-align: center;
        margin-top: 20px;
    }
    .title-container{
        padding: 40px 0;
        background: var(--secondary-color);
    }
    .wish-title{
        margin-top: 50px;
        font-weight: 600;
        font-size: 1.5em;
    }
    .lines{
        display: flex;
        padding: 15px 0 30px 0;
    }
    .blue-line{
        width: 50px;
        height: 1px;
        margin: 0;
        background: var(--blue-font-color);
    }
    .line{
        width: 1200px;
        height: 1px;
        background: var(--grey-font-color);
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    tr{
        height: 50px;
    }
    td, th {
        border: 1px solid var(--font-color-light);
        text-align: left;
        padding: 8px;
        padding-left: 20px;
    }
    th{
        text-transform: uppercase;
        font-size: 1.1em;
    }
    td{
        font-size: 1em;
    }
    td:nth-child(1){
        width: 65%;
    }
    td:nth-child(2){
        width: 35%;
    }
    .price{
        position: relative;
    }
    .icons{
        position: absolute;
        right: 20px;
        font-size: .8em;
        opacity: 0;
        transition: .5s;
    }
    tr:hover .icons{
        opacity: 1;
        transition: .5s;
    }
    .icon{
        margin-left: 5px;
    }
    .icon i{
        color: var(--grey-font-color);
        transition: .5s;
        cursor: pointer;
    }
    .icon:hover i{
        color: var(--font-color);
        transition: .5s;
    }
    .old-price{
        color: var(--red-font-color);
        text-decoration: line-through;
    }
    .button-a{
        background: var(--blue-font-color);
        font-weight: 600;
        cursor: pointer;
        transition: .5s;
        width: 200px;
        font-size: 1.1em;
        line-height: 50px;
        text-align: center;
        margin-top: 20px;
        border-radius: 5px;
        display: block;
        color: var(--font-color-unchanged);
    }
    .button-a:hover {
        background: var(--font-color);
        box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
        transition: .5s;
        color: var(--primary-color);
    }
</style>