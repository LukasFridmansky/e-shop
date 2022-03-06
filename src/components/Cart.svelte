<script>
    import categories from '../categories';

    export let show;
    export let random_num;
	export let cart;
	export let totalSum;

    $: {random_num; show = true}

    function hideCartPreview(){
        show = false;
    }
	
    import {removeItemFromCart} from '../main';

</script>

<main on:load="{hideCartPreview()}">
	{#if show}
		<div class="full-page-container">
			<div class="cart-container">
				<div class="top">
					<div class="top-title">Môj košík ({cart.length})</div>
					<div class="quit" on:click="{hideCartPreview}"><i class="fas fa-times"></i></div>
				</div>
				<div class="products">
					{#each cart as product}
						<div class="product">
							<div class="product-container">
								<div class="img-product">
									<img src="{product[0].image_urls[0]}" alt="{product[0].title + ' ' + product[0].version}">
								</div>
								<div class="product-info-container">
									<div class="p-title"><a href="#/obchod/{categories[product[0].category].title.toLowerCase().split(' ').join('_')}/{(product[0].title + ' ' + product[0].version).toLowerCase().split(' ').join('_')}" on:click="{hideCartPreview}">{product[0].title + ' ' + product[0].version}</a></div>
									<div class="p-color">{product[1].title}</div>
									{#if product[0].discount_bollean}
										<div class="p-price">{product[2]}x{product[0].discount_price.toFixed(2).toString().split('.').join(',')} €</div>
									{:else}
										 <div class="p-price">{product[2]}x{product[0].price.toFixed(2).toString().split('.').join(',')} €</div>
									{/if}
								</div>
							</div>
							<div class="trash" on:click="{removeItemFromCart(cart.indexOf(product))}"><i class="fas fa-trash"></i></div>
						</div>
					{:else}
						<div class="product">
							Košík neobsahuje žiadne produkty
						</div>
					{/each}
				</div>
				<div class="total">
					<span>SPOLU</span>
					<b>{totalSum.toFixed(2).toString().split('.').join(',')} €</b>
				</div>
				<a href="#/kosik" class="button-to-cart-a" on:click="{hideCartPreview}">
					<div class="button-to-cart">
						Prejsť do košíka
					</div>
				</a>
			</div>
		</div>
	{/if}
</main>

<style>
    .full-page-container{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--font-color-light);
		z-index: 99;
	}
	.cart-container{
		width: 320px;
		min-height: 100vh;
		max-height: 100vh;
		background: var(--secondary-color);
		position: absolute;
		top: 0;
		right: 0;
		padding: 20px;
		overflow-y: scroll;
	}
	.cart-container::-webkit-scrollbar {
    	width: 0px;
    	height: 0px;
	}
	.top{
		display: flex;
		justify-content: space-between;
		font-size: 1.2em;
		text-transform: uppercase;
		font-weight: 500;
	}
	.quit{
		cursor: pointer;
	}
	.product{
		padding: 15px 0;
		position: relative;
		border-bottom: 1px dashed var(--font-color-light);
	}
	.product-container{
		display: flex;
	}
	.img-product{
		width: 60px;
		height: 60px;
		overflow: hidden;

	}
	.img-product img{
		width: auto;
		height: 100%;
	}
	.product-info-container{
		padding-left: 10px;
	}
	.p-title{
		font-weight: 500;
	}
	.p-color{
		color: var(--grey-font-color);
	}
	.p-price{
		color: var(--blue-font-color);
	}
	.trash{
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
		font-size: .8em;
		cursor: pointer;
		opacity: 0;
		transition: .5s;
	}
	.product:hover .trash{
		opacity: 1;
		transition: .5s;
	}
	.total{
		padding: 15px 0;
		border-bottom: 1px dashed var(--font-color-light);
		display: flex;
		justify-content: space-between;
	}
	.button-to-cart{
		background: var(--blue-font-color);
		color: var(--font-color-unchanged);
		font-weight: 600;
		text-align: center;
		padding: 15px;
		margin-top: 15px;
		cursor: pointer;
		transition: .5s;
	}
	.button-to-cart:hover{
		background: var(--font-color);
		color: var(--primary-color);
		box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
		transition: .5s;
	}
	.button-to-cart-a{
		color: var(--font-color-unchanged);
		display: block;
		width: 100%;
		height: 100%;
		transition: .5s;
	}
	.button-to-cart-a:hover{
		color: var(--secondary-color);
		transition: .5s;
	}
	@media only screen and (max-width: 1000px){
		.trash{
			opacity: 1;
		}
		}
</style>