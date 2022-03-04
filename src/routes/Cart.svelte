<script>
    import {removeItemFromCart, calculateTotalSum} from '../main';
    import categories from '../categories';

    $: cart_list = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
	$: totalSum = JSON.parse(localStorage.getItem("totalSum")) ? JSON.parse(localStorage.getItem("totalSum")) : 0;
    $: num_of_items = 0;
    let shipping = 3.50;

    function calculateNumOfItems(){
        num_of_items = 0;
        for (let i = 0; i < cart_list.length; i++) {
            num_of_items+= cart_list[i][2];
        }
    }

	function IsCartChanged(){
		cart_list = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
		totalSum = JSON.parse(localStorage.getItem("totalSum")) ? JSON.parse(localStorage.getItem("totalSum")) : 0;
        calculateNumOfItems()
		setTimeout(() => {
			IsCartChanged();
		}, 100);
	}
	IsCartChanged();
	
    function changeNumOfItems(index, count){
        if (count > 0 && count <= 10) {
            cart_list[index][2] = count;
            localStorage.setItem("cart", JSON.stringify(cart_list));
            calculateNumOfItems();
            localStorage.setItem("totalSum", calculateTotalSum(cart_list));
        }
    }
    
</script>

<main>
    <div class="title-container">
        <div class="title">Košík</div>
        <div class="nav">
            <a href="./public">Domov</a> / <span class="blue">Košík</span>
        </div>
    </div>
    <div class="container cart">
        <div class="cart-title">Tvoj košík ({cart_list.length})</div>
        <div class="lines">
            <div class="blue-line"></div>
            <div class="line"></div>
        </div>
        <table>
            {#if cart_list.length > 0}
                <tr>
                    <th>Produkt</th>
                    <th>Farba</th>
                    <th>Cena <span class="per-piece">za ks</span></th>
                    <th>Množstvo</th>
                    <th>Cena</th>
                </tr>
            {/if}
            {#each cart_list as cart, i}
                <tr class="cart-item">
                    <td><a href="#/obchod/{categories[cart[0].category].title.toLowerCase().split(' ').join('_')}/{(cart[0].title + ' ' + cart[0].version).toLowerCase().split(' ').join('_')}">{cart[0].title + ' ' + cart[0].version}</a></td>
                    <td>{cart[1].title}</td>
                    <td class="price">
                        <span class="price-num">
                            {#if cart[0].discount_bollean}
                                <b class="old-price">{cart[0].price.toString().split('.').join(',')} €</b>
                                {cart[0].discount_price.toString().split('.').join(',')} €
                            {:else}
                                {cart[0].price.toString().split('.').join(',')} €
                            {/if}
                        </span>
                    </td>
                    <td class="counter">
                        {cart[2]}
                        <div class="counter-arrows">
                            <div on:click={() => changeNumOfItems(i, cart[2] + 1)}><i class="fas fa-chevron-up"></i></div>
                            <div on:click={() => changeNumOfItems(i, cart[2] - 1)}><i class="fas fa-chevron-down"></i></div>
                        </div>
                    </td>
                    <td class="price">
                        <span class="price-num">
                            {#if cart[0].discount_bollean}
                                {(cart[0].discount_price*cart[2]).toFixed(2).toString().split('.').join(',')} €
                            {:else}
                                {(cart[0].price*cart[2]).toFixed(2).toString().split('.').join(',')} €
                            {/if}
                        </span>
                        <span class="icons">
                            <span class="remove-from-cart icon">
                                <i class="fas fa-trash" on:click="{() => removeItemFromCart(i)}"></i>
                            </span>
                        </span>
                    </td>
                </tr>
            {:else}
                Tvoj košík je prázdny
                <a href="#/obchod">
                    <div class="button">Prezerať obchod</div>
                </a>
            {/each}
            {#if cart_list.length > 0}
                <tr class="subtotal">
                    <td>Medisúčet</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{num_of_items}</td>
                    <td>{totalSum.toFixed(2).toString().split('.').join(',')} €</td>
                </tr>
                <tr>
                    <td>Doprava</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{shipping.toFixed(2).toString().split('.').join(',')} €</td>
                </tr>
                <tr class="total">
                    <td>Spolu</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{num_of_items}</td>
                    <td>{(totalSum + shipping).toFixed(2).toString().split('.').join(',')} €</td>
                </tr>
            {/if}
        </table>
        {#if cart_list.length > 0}
            <div class="button-container">
                <a href="#/login">
                    <div class="button b-login">Pre dokončenie objednávky sa prihláste</div>
                </a>
            </div>
        {/if}
    </div>
</main>

<svelte:head>
    <title>Košík</title>
</svelte:head>

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
        margin-top: 20px;
    }
    .title-container{
        padding: 40px 0;
        background: var(--secondary-color);
    }
    .cart-title{
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
    td:nth-child(1){
        width: 35%;
    }
    td:nth-child(2){
        width: 15%;
    }
    td:nth-child(3){
        width: 15%;
    }
    td:nth-child(4){
        width: 15%;
    }
    td:nth-child(5){
        width: 20%;
    }
    th{
        text-transform: uppercase;
        font-size: 1.1em;
    }
    td{
        font-size: 1em;
        font-weight: 300;
    }
    .per-piece{
        text-transform: lowercase;
        font-weight: 400;
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
    .button{
        background: var(--blue-font-color);
        color: var(--font-color-unchanged);
        font-weight: 600;
        cursor: pointer;
        transition: .5s;
        width: 200px;
        font-size: 1.1em;
        line-height: 50px;
        text-align: center;
        margin-top: 20px;
        border-radius: 5px;
    }
    .button:hover {
        background: var(--font-color);
        color: var(--primary-color);
        box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
        transition: .5s;
    }
    .b-login{
        width: 350px;
    }
    .button-container{
        margin-top: 30px;
        padding-top: 40px;
        padding-left: 40px;
        width: 100%;
        height: 150px;
        background: var(--secondary-color);
    }
    .counter{
        position: relative;
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
    .subtotal td{
        font-weight: 600;
        text-transform: uppercase;
    }
    .total td{
        font-weight: 800;
        color: var(--blue-font-color);
        text-transform: uppercase;
    }
</style>