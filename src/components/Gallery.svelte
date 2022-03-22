<script>
    export let active_img;
    export let show;
    export let random_num;
    export let images;
    export let product_title;

    $: {random_num; show = true}

    function hideGallery(){
        show = false;
    }
</script>

<main on:load="{hideGallery()}">
    {#if show}
        <div class="container-gallery">
            <div class="top-bar">
                <div class="title-gallery">{product_title}: Obrázok: {active_img + 1} / {images.length}</div>
                <div class="quit-gallery" on:click="{hideGallery}"><i class="fas fa-times"></i></div>
            </div>
            <div class="main-img-gallery">
                <img src="{images[active_img]}" alt="{product_title}, obrázok: {active_img + 1} / {images.length}">
                <div class="arrows">
                    {#if images.length > 1}
                    <i class="fas fa-chevron-left {active_img == 0 ? 'active' : ''}" on:click="{() => active_img > 0 ? active_img -= 1 : active_img}"></i>
                    <i class="fas fa-chevron-right {active_img == (images.length - 1) ? 'active' : ''}" on:click="{() => active_img < (images.length - 1) ? active_img += 1 : active_img}"></i>
                    {/if}
                </div>
            </div>
            <div class="small-images-gallery">
                {#each images as img, i}
                    <div class="small-img {active_img == i ? 'active' : ''}" on:click="{() => active_img = i}">
                        <img src="{img}" alt="{product_title}, obrázok: {i + 1} / {images.length}">
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</main>

<style>
    .container-gallery{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: 200;
        background: #fff;
        user-select: none;
    }
    .top-bar{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: var(--primary-color);
        line-height: 50px;
        text-align: center;
        font-size: 1.1em;
        font-weight: 700;
    }
    .quit-gallery{
        position: absolute;
        top: 0;
        font-size: 1.3em;
        right: 20px;
        cursor: pointer;
    }
    .main-img-gallery{
        margin-top: 100px;
        text-align: center;
        height: 60%;
        padding: 25px;
        overflow: hidden;
    }
    .main-img-gallery img{
        height: 100%;
        width: auto;
    }
    .arrows i{
        color: var(--primary-color);
        cursor: pointer;
        padding: 5px;
        transition: .5s;
    }
    .arrows i:hover{
        color: var(--blue-font-color);
        transition: .5s;
    }
    .arrows i.active{
        color: var(--grey-font-color);
        cursor: default;
    }
    .arrows{
        position: absolute;
        top: 50%;
        width: 90%;
        left: 5%;
        transform: translateY(-50%);
        font-size: 2em;
        display: flex;
        justify-content: space-between;
    }
    .small-images-gallery{
        position: absolute;
        bottom: 10px;
        width: 90%;
        left: 5%;
        padding: 5px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .small-img{
        width: 130px;
        padding: 5px;
        height: 90px;
        text-align: center;
        overflow: hidden;
        margin: 6px 3px;
        border-radius: 4px;
        cursor: pointer;
    }
    .small-img.active, .small-img:hover{
        box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.25);
    }
    .small-img img{
        height: 100%;
        width: auto;
    }
    @media only screen and (max-width: 600px){
        .container-gallery{
            display: none;
        }
    }
</style>