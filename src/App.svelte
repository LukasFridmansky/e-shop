<script>
	import Router from "svelte-spa-router";
    import services from './services';

	import Home from "./routes/Home.svelte";
	import Shop from "./routes/Shop.svelte";
	import Products from "./routes/Products.svelte";
	import Product from "./routes/Product.svelte";
	import Contact from "./routes/Contact.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import CartRoute from "./routes/Cart.svelte";
	import Wishlist from "./routes/Wishlist.svelte";
	import SearchRoute from "./routes/Search.svelte";
	
	import BackToTop from "./components/BackToTop.svelte";
	import Cart from "./components/Cart.svelte";
	import Search from "./components/Search.svelte";
	import Loader from "./components/Loader.svelte";

	import {hamburgerMenu} from './main'
	
	import {location} from 'svelte-spa-router';
	$: {$location; window.scrollTo(0, 0)}

	let routes = {
		"/": Home,
		"/obchod": Shop,
		"/obchod/:category": Products,
		"/obchod/:category/:product": Product,
		"/kontakt": Contact,

		"/kosik": CartRoute,
		"/wishlist": Wishlist,
		
		"/vyhladavanie=/:search_value": SearchRoute,
		
		"*": NotFound
	};

	let scroll_position;

	$: cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
	$: totalSum = JSON.parse(localStorage.getItem("totalSum")) ? JSON.parse(localStorage.getItem("totalSum")) : 0;
	function IsCartChanged(){
		cart = JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")) : [];
		totalSum = JSON.parse(localStorage.getItem("totalSum")) ? JSON.parse(localStorage.getItem("totalSum")) : 0;
		setTimeout(() => {
			IsCartChanged();
		}, 100);
	}
	IsCartChanged();

	let show = false;
    let random_num = Math.random();

    function showCartPreview(){
        show = true;
        random_num = Math.random();
    }

    let random_num_search = Math.random();

	function showSearch(){
        random_num_search = Math.random();
    }
</script>


<main>
	<Loader />
	<Search {random_num_search} />
	<Cart {show} {random_num} {cart} {totalSum} />
	<header>
		<div class="container header">	
			<div class="basic-info">
				<div class="mobile_number">
					<a href="tel:+421234567890">
						<i class="fa fa-phone"></i>+421 234 567 890
					</a>
				</div>
				<div class="address">
					<a href="https://maps.google.com/?q=1910 Blvd, The Bronx, NY, USA" target="_blank"><i class="fas fa-map-marker-alt"></i>1910 Blvd, The Bronx, NY, USA</a>
				</div>
			</div>
			<div class="toggle" id="toggle">
				<i class="indicator">
					<div class="sun sun-logo">
						<i class="fas fa-sun"></i>
					</div>
					<div class="moon moon-logo">
						<i class="fas fa-moon"></i>
					</div>
				</i>
			</div>
		</div>
	</header>
	<nav class="{scroll_position > 150 ? 'scrolled' : ''}">
		<div class="container navigation">
			<div class="logo">
				<a href="./">
					<i class="fas fa-bolt"></i>
					Electro<span class="x-blue">X</span>
				</a>
			</div>
			<div class="nav-bar">
				<ul>
					<li class="nav-item">
						<a href="./#" on:click="{() => hamburgerMenu(window.innerWidth)}">Domov</a>
					</li>
					<li class="nav-item">
						<a href="#/obchod" on:click="{() => hamburgerMenu(window.innerWidth)}">Obchod</a>
					</li>
					<li class="nav-item">
						<a href="#/kontakt" on:click="{() => hamburgerMenu(window.innerWidth)}">Kontakt</a>
					</li>
				</ul>
			</div>
			<div class="nav-icons">
				<div class="wishlist nav-icon">
					<a href="#/wishlist" on:click="{() => hamburgerMenu(window.innerWidth)}">
						<i class="fas fa-heart"></i>
					</a>
				</div>
				<div class="basket nav-icon" on:click="{() => {showCartPreview();hamburgerMenu(window.innerWidth)}}">
					<i class="fas fa-shopping-bag"></i>
					<div class="num-of-items">{cart.length}</div>
				</div>
				<div class="search nav-icon" on:click="{() => {showSearch();hamburgerMenu(window.innerWidth)}}">
					<i class="fas fa-search"></i>
				</div>
			</div>
			<div class="hamburger" on:click="{() => hamburgerMenu(window.innerWidth)}">
                    <span class="h-line"></span>
                    <span class="h-line"></span>
                    <span class="h-line"></span>
            </div>
		</div>
	</nav>
	<Router {routes} />
	<div class="pre-footer">
		<div class="container services">
			{#each services as service}
				<div class="service">
					<div class="icon">
						<i class="{service.icon}"></i>
					</div>
					<div class="service-info">
						<div class="s-title">{service.title}</div>
						<div class="s-subtitle">{service.subtitle}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<footer>
		<div class="container footer">
			<div class="column">
				<div class="logo">
					<a href="./">
						<i class="fas fa-bolt"></i>
						Electro<span class="x-blue">X</span>
					</a>
				</div>
				<div class="contact-menu">
					<div class="tel-number menu-item">
						<b>Tel. č.:</b> <a href="tel:+421234567890">+421 234 567 890</a>
					</div>
					<div class="mail menu-item">
						<b>Email:</b> <a href="mailto:info@elektrox.sk">info@elektrox.sk</a>
					</div>
					<div class="address menu-item">
						<b>Adresa:</b> <a href="https://maps.google.com/?q=1910 Blvd, The Bronx, NY, USA" target="_blank">1910 Blvd, The Bronx, NY, USA</a>
					</div>
					<div class="social-icons">
						<a href="https://facebook.com">
							<i class="fab fa-facebook"></i>
						</a>
						<a href="https://twitter.com">
							<i class="fab fa-twitter"></i>
						</a>
						<a href="https://instagram.com">
							<i class="fab fa-instagram"></i>
						</a>
						<a href="https://linkedin.com">
							<i class="fab fa-linkedin"></i>
						</a>
						<a href="https://pinterest.com">
							<i class="fab fa-pinterest"></i>
						</a>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="column-title">Informácie</div>
				<div class="blue-line"></div>
				<div class="informations-menu">
					<ul>
						<li><a href="#/">O nás</a></li>
						<li><a href="#/kontakt">Kontakt</a></li>
						<li><a href="#/zasady_ochrany_osobnych_udajov">Zásady ochrany osobných údajov</a></li>
						<li><a href="#/podmienky">Podmienky</a></li>
						<li><a href="#/doprava">Informácie o dodaní</a></li>
						<li><a href="#/reklamacie">Objednávky a vrátenie tovaru</a></li>
					</ul>
				</div>
			</div>
			<div class="column">
				<div class="column-title">Zákaznik</div>
				<div class="blue-line"></div>
				<div class="informations-menu">
					<ul>
						<li><a href="#/faqs">Pomoc a FAQs</a></li>
						<li><a href="#/login">Môj účet</a></li>
						<li><a href="#/login">História objednávok</a></li>
						<li><a href="#/wishlist">Wishlist</a></li>
						<li><a href="#/newsletter">Newsletter</a></li>
						<li><a href="#/zasady_nakupu">Zásady nákupu</a></li>
					</ul>
				</div>
			</div>
			<div class="column">
				<div class="column-title">Newsletter</div>
				<div class="blue-line"></div>
				<div class="column-subtitle">Prihláste sa k odberu nášho newslettera a už vám nič neujde.</div>
				<form action="javascript:void(0);">
					<input type="email" placeholder="Zadaj svoju emailovú adresu">
					<input type="submit" value="Odoberať newsletter">
				</form>
			</div>
		</div>
	</footer>
	<div class="copyright-footer">
		<div class="container copyright">
			<div class="copy-left">Copyright 2022 ElektroX. Vytvoril <a href="../../" class="name">Lukáš Fridmanský</a> na základe dizajnu z <a href="https://medq-react.envytheme.com/" target="_blank" class="name">Envytheme</a></div>
			<div class="copy-right">
				Akceptujeme platbu cez: 
				<a href="https://visa.sk"><i class="fab fa-cc-visa"></i></a>
				<a href="https://mastercard.sk"><i class="fab fa-cc-mastercard"></i></a>
				<a href="https://pay.google.com"><i class="fab fa-google-pay"></i></a>
				<a href="https://apple.com/sk/apple-pay/"><i class="fab fa-apple-pay"></i></a>
				<a href="https://paypal.com"><i class="fab fa-cc-paypal"></i></a>
			</div>
		</div>
	</div>
	<div class="added-to-cart info-card">
		Produkt bol úspešne pridaný do košíka
		<div class="card-line"></div>
	</div>
	<div class="cart-includes-item info-card">
		Produkt sa už nachádza v košíku
		<div class="card-line"></div>
	</div>
	<div class="item-deleted info-card">
		Produkt bol úspešne odstranený z košíka
		<div class="card-line"></div>
	</div>
	<div class="added-to-wish info-card">
		Produkt bol úspešne pridaný do wishlistu
		<div class="card-line"></div>
	</div>
	<div class="wish-includes-item info-card">
		Produkt sa už nachádza vo wishliste
		<div class="card-line"></div>
	</div>
	<div class="item-deleted-from-wish info-card">
		Produkt bol úspešne odstranený z wishlistu
		<div class="card-line"></div>
	</div>
	<BackToTop />
</main>

<svelte:window bind:scrollY="{scroll_position}" />