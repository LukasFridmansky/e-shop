<script>
    import products from '../products';
    import Sale from '../components/Sale.svelte';
    	
    let product_price = products[0].price.toString().split('.').join(',');

    let product_url = (products[0].title + ' ' + products[0].version).toLowerCase().split(' ').join('_');
    
</script>

<svelte:head>
    <title>Domov</title>
</svelte:head>

<main>
    <div class="slider">
        <div class="container slider-con">
            <div class="product-info">
                <div class="subtitle">Najpredavanejší</div>
                <div class="title">{products[0].title} <span class="ultra-blue">{products[0].version}</span></div>
                <div class="description">{products[0].short_description}</div>
                <div class="btn-price">
                    <a href="#/obchod/smartfóny/{product_url}" class="shop-btn">
                        <i class="fas fa-shopping-cart"></i>
                        Nakúpovať
                    </a> 
                    <div class="price">{product_price} €</div>
                </div>
            </div>
            <div class="product-img">
                <img src="{products[0].png_image}" alt="{products[0].title}">
            </div>
        </div>
    </div>
    <div class="about">
        <div class="container about-container">
            <div class="left">
                <div class="subtitle">Veríme v lepšie zajtrajšky</div>
                <div class="title">Vitajte v ElektroX! Prinášame naším zákaznikom širokú ponuku produktov z viacerých kategórii</div>
                <div class="text">Naša spoločnosť je na trhu už 15 rokov. Už 15 rokov prinášame naším zákaznikom prijemný pocit z nákupovania. Ponúkame Vám širokú ponuku produktov z viacerých kategórii, ktoré si objednáte z pohodlia Vášho domova a my Vám vaš nákup doručime až domov.</div>
                <div class="text2">Tak neváhajte a nakúpte u nás už teraz</div>
            </div>
            <div class="right">
                <img src="https://www.thehindubusinessline.com/migration_catalog/article18241793.ece/ALTERNATES/LANDSCAPE_1200/ct09_lady.jpg" alt="Nákupy z pohodlia domova">
            </div>
        </div>
    </div>
    <div class="statistics">
        <div class="statistics-container container">
            <div class="statistic">
                <div class="title">10M</div>
                <div class="subtitle">Šťastných Zákaznikov</div>
            </div>
            <div class="statistic">
                <div class="title">20M</div>
                <div class="subtitle">Globálnch Zákaznikov</div>
            </div>
            <div class="statistic">
                <div class="title">99+</div>
                <div class="subtitle">Odborných Zamestnancov</div>
            </div>
            <div class="statistic">
                <div class="title">30+</div>
                <div class="subtitle">Získaných Ocenení</div>
            </div>
        </div>
    </div>
    <div class="sales">
        <Sale shop_now_btn={true}/>
        <div class="sponsors container">
            <div class="sponsor">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png" alt="Samsung">
            </div>
            <div class="sponsor">
                <img src="https://hochwald.net/wp-content/uploads/2017/12/Apple.png" alt="Apple">
            </div>
            <div class="sponsor">
                <img src="https://www.freepnglogos.com/uploads/huawei-logo-png/huawei-logo-picture-4.png" alt="Huawei">
            </div>
            <div class="sponsor">
                <img src="https://logos-world.net/wp-content/uploads/2020/05/Xiaomi-Logo.png" alt="Xiaomi">
            </div>
            <div class="sponsor">
                <img src="https://logos-world.net/wp-content/uploads/2020/09/Nokia-Logo.png" alt="Nokia">
            </div>
        </div>
    </div>
</main>

<style>
    .slider {
        background-color: var(--secondary-color);
        width: 100%;
        height: 600px;
        user-select: none;
    }

    .slider-con {
        display: flex;
        justify-content: space-between;
    }

    .product-info {
        width: 40%;
        height: 320px;
        margin-top: 140px;
        position: relative;
    }

    .product-info .subtitle {
        font-weight: 600;
        color: var(--blue-font-color);
    }

    .product-info .title {
        font-weight: 700;
        font-size: 3.5em;
        padding: 10px 0 20px 0;
    }

    .ultra-blue {
        color: var(--blue-font-color);
    }

    .description {
        color: var(--grey-font-color);
        font-size: 1.1em;
        line-height: 1.5em;
    }

    .btn-price {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 250px;
        justify-content: space-between;
    }

    .shop-btn {
        display: block;
        width: 150px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        font-size: 1.1em;
        background: var(--blue-font-color);
        color: var(--font-color-unchanged);
        border-radius: 5px;
        font-weight: 500;
        transition: .5s;
    }

    .shop-btn:hover {
        background: var(--font-color);
        color: var(--primary-color);
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
        font-weight: 600;
        color: var(--blue-font-color);
    }

    .product-img {
        width: 480px;
        height: 480px;
        box-shadow: -1px 1px 60px -53px rgba(0, 0, 0, 0.65);
        background: var(--light-blue-color);
        border-radius: 100%;
        overflow: hidden;
        margin-top: 60px;
        margin-right: 60px;
    }

    .product-img img {
        width: 100%;
        height: 100%;
    }

    .about {
        background: var(--primary-color);
    }

    .about-container {
        padding: 100px 0;
        display: flex;
        justify-content: space-between;
    }

    .left {
        width: 46%;
    }

    .left .subtitle {
        color: var(--blue-font-color);
        font-weight: 500;
    }

    .left .title {
        padding: 15px 0;
        font-weight: 600;
        font-size: 2em;
    }

    .left .text,
    .left .text2 {
        color: var(--grey-font-color);
        line-height: 1.7em;
    }

    .left .text2 {
        padding-top: 10px;
    }

    .right {
        width: 46%;
    }

    .right img {
        width: 100%;
        height: auto;
    }

    .statistics {
        background: var(--primary-color);
        padding-bottom: 80px;
    }

    .statistics-container {
        display: flex;
        justify-content: space-around;
    }

    .statistic {
        width: 200px;
        text-align: center;
    }

    .statistic .title {
        font-size: 2.8em;
        font-weight: 700;
        color: var(--blue-font-color);
    }

    .statistic .subtitle {
        padding-top: 5px;
        font-size: 1.1em;
        font-weight: 500;
    }

    .sales {
        background: var(--secondary-color);
        padding: 10px 0 25px 0;
    }

    .sponsors {
        height: 120px;
        display: flex;
        justify-content: space-between;
    }

    .sponsor {
        width: 150px;
        position: relative;
    }

    .sponsor img {
        width: 100%;
        height: auto;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    @media only screen and (max-width: 1380px) {
        .about-container {
            padding: 100px 50px;
        }
        .sales {
            padding: 20px 20px;
        }
    }

    @media only screen and (max-width: 1100px) {
        .slider {
            height: 500px;
        }
        .slider-con {
            font-size: .8em;
        }
        .product-info {
            height: 320px;
            margin-top: 90px;
        }
        .product-img {
            width: 300px;
            height: 300px;
            margin-top: 100px;
            margin-right: 100px;
        }
    }

    @media only screen and (max-width: 1000px) {
        .left {
            width: 100%;
        }
        .right {
            display: none;
        }
        .sponsors {
            flex-wrap: wrap;
            justify-content: center;
            height: 250px;
        }
        .sponsor {
            margin: 10px;
        }
    }

    @media only screen and (max-width: 900px) {
        .product-info {
            width: 50%;
        }
        .product-img {
            width: 280px;
            height: 280px;
            margin-top: 110px;
            margin-right: 0px;
        }
    }

    @media only screen and (max-width: 750px) {
        .slider {
            height: 640px;
        }
        .slider-con {
            padding-top: 20px;
            display: block;
            justify-content: space-between;
        }
        .product-info {
            width: 100%;
            height: 180px;
            text-align: center;
            margin-top: 100px;
            position: relative;
        }
        .product-info .title {
            font-size: 2.7em;
        }
        .description {
            font-size: 1em;
            max-width: 300px;
            margin: 0 auto;
            line-height: 1.2em;
        }
        .btn-price {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%);
            display: flex;
            width: 200px;
            justify-content: space-between;
        }
        .shop-btn {
            width: 120px;
            height: 40px;
            line-height: 40px;
            font-size: 1em;
        }
        .price {
            font-size: 1.1em;
            line-height: 40px;
        }
        .product-img {
            width: 250px;
            height: 250px;
            margin: 0 auto;
            margin-top: 25px;
        }
        .about-container,
        .statistics {
            font-size: .8em;
        }
        .statistics-container {
            flex-wrap: wrap;
        }
        .statistic {
            padding: 15px;
        }
    }

    @media only screen and (max-width: 480px) {
        .statistic {
            padding: 10px;
            width: 150px;
        }
    }

    @media only screen and (max-width: 430px) {
        .slider {
            height: 660px;
        }
        .product-info {
            height: 220px;
        }
        .product-info .title {
            font-size: 2.5em;
        }
        .shop-btn {
            width: 120px;
            height: 40px;
            line-height: 40px;
            font-size: 1em;
        }
        .price {
            font-size: 1.1em;
            line-height: 40px;
        }
        .product-img {
            width: 250px;
            height: 250px;
            margin: 0 auto;
            margin-top: 25px;
        }
        .sponsor {
            width: 100px;
        }
    }
</style>