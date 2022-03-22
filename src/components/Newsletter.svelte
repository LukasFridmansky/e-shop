<script>
    $: show = true;
    function hideIt(){
        show = false;
        localStorage.setItem("newsletter", true);
    }
</script>

<main>
    <div class="newsletter-container {show ? '' : 'hide'}">
        <div class="newsletter">
            <div class="quit" on:click="{hideIt}"><i class="fas fa-times"></i></div>
            <div class="title">NEWSLETTER</div>
            <div class="subtitle">Prihláste sa k odberu nášho newslettera a už vám nič neujde.</div>
            <a href="#/newsletter" class="button" on:click="{hideIt}">Odoberať newsletter</a>
        </div>
    </div>
</main>

<style>
    .newsletter-container{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 200;
        background: var(--background2);
    }
    .hide{
        display: none;
    }
    .newsletter{
        position: absolute;
        top: calc(50% - 150px);
        left: calc(50% - 250px);
        width: 500px;
        height: 300px;
        background: var(--primary-color);
        text-align: center;
        box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.25);
    }
    .quit{
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px 10px;
        font-size: 1.5em;
        cursor: pointer;
    }
    .title{
        font-size: 2em;
        margin-top: 50px;
        padding: 10px 0 20px 0;
        font-weight: 800;
    }
    .subtitle{
        font-size: 1.1em;
        padding: 0 40px;
    }
    .button{
        display: block;
        width: 200px;
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translate(-50%);
        height: 45px;
        margin: 0 auto;
        line-height: 45px;
        font-size: 1.1em;
        border-radius: 5px;
        background: var(--blue-font-color);
        color: var(--font-color-unchanged);
        font-weight: 600;
        cursor: pointer;
        transition: .5s;
    }
    .button:hover{
        background: var(--font-color);
        color: var(--primary-color);
        box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
        transition: .5s;
    }
    @media only screen and (max-width: 600px){
        .newsletter{
            width: 400px;
            height: 220px;
            font-size: .8em;
        }
        .title{
            margin-top: 20px;
        }
        .button{
            bottom: 30px;
        }
        .newsletter{
            top: calc(50% - 110px);
            left: calc(50% - 200px);
        }
    }
    @media only screen and (max-width: 420px){
        .newsletter{
            width: 80%;
            height: 170px;
            font-size: .6em;
        }
        .title{
            margin-top: 15px;
        }
        .button{
            bottom: 25px;
            width: 130px;
            height: 30px;
            line-height: 30px;
        }
        .newsletter{
            top: calc(50% - 85px);
            left: 10%;
            transform: translateX(0);
        }
    }
</style>