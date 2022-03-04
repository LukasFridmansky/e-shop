<script>
    import sales from '../sales';
    export let shop_now_btn;
</script>

<main>
    <div class="sales container">
        {#each sales as sale}
            <div class="sale-card">
                <div class="sale-img">
                    <img src="{sale.image}" alt="{sale.title}">
                </div>
                <div class="info">
                    <div class="sale-type">{sale.type}</div>
                    <div class="sale-title">{sale.title}</div>
                    <div class="sale-subtitle">{sale.subtitle} <b>{sale.bold_subtitle}</b></div>
                    {#if shop_now_btn}
                        <div class="shop-now-btn"><a href="#/obchod">Nakúpovať <i class="fas fa-chevron-right"></i></a></div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    .sales{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 20px;
        user-select: none;
    }
    .sale-card{
        width: 400px;
        height: 220px;
        display: flex;
        justify-content: space-between;
    }
    .sale-card:nth-child(n){
        background: #deffe9;
    }
    
    .sale-card:nth-child(n+2){
        background: #fffee2;
    }
    
    .sale-card:nth-child(n+3){
        background: #d8f5ff;
    }
    .sale-img{
        width: 40%;
        margin-top: 50px;
        margin-left: 20px;
    }
    .sale-img img{
        width: 100%;
        transition: .5s;
    }
    .sale-card:hover img{
        transform: scale(1.1);
        transition: .5s;
    }
    .info{
        text-align: right;
        height: 140px;
        margin-top: 40px;
    }
    .sale-type{
        color: var(--grey-color-unchanged);
        font-weight: 500;
        font-size: .8em;
        padding: 0 20px 10px 10px;
    }
    .sale-title{
        color: var(--dark-color-unchanged);
        font-weight: 600;
        font-size: 1.5em;
        padding: 5px 20px;
        border-bottom-left-radius: 20px;
        border-top-left-radius: 20px;
    }

    .sale-subtitle{
        font-size: 1.2em;
        color: var(--dark-color-unchanged);
        padding: 10px 20px;
    }
    .sale-subtitle b{
        text-transform: uppercase;
        color: var(--dark-color-unchanged);
    }
    .sale-card:nth-child(n) .sale-title{
        background: #ade4bf;
    }
    
    .sale-card:nth-child(n+2) .sale-title{
        background: #e6e4a4;
    }
    
    .sale-card:nth-child(n+3) .sale-title{
        background: #a4d7e8;
    }
    .shop-now-btn{
        margin-right: 20px;
        font-weight: 500;
        font-size: 1.1em;
    }
    .shop-now-btn a{
        color: var(--dark-color-unchanged);
        transition: .5s;
    }
    
    .shop-now-btn:hover a,
    .shop-now-btn:hover i{
        color: var(--blue-font-color);
        transition: .5s;
    }
    
    .shop-now-btn i{
        font-size: .8em;
        color: var(--dark-color-unchanged);
    }
    @media only screen and (max-width: 1380px) {
        .sales{
            padding: 0;
        }
    }
    @media only screen and (max-width: 1280px) {
        .sale-card{
            margin: 10px;
        }
        .sales{
            justify-content: center;
        }
    }
    @media only screen and (max-width: 950px) {
        .sale-card{
            width: 300px;
            height: 170px;
            display: flex;
            font-size: .7em;
            justify-content: space-between;
        }.info{
            margin-top: 20px;
        }
    }@media only screen and (max-width: 400px) {
        .sales{
            padding: 0px;
        }
    }
</style>