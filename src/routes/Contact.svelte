<script>
    // your script goes here
</script>

<svelte:head>
    <title>Kontakt</title>
</svelte:head>


<main>
    <div class="title-container">
        <div class="title">Kontaktujte nás</div>
        <div class="nav">
            <a href="./">Domov</a> / <span class="blue">Kontakt</span>
        </div>
    </div>
    <div class="contact-info container">
        <div class="contact-info-item">
            <div class="item-icon"><i class="fas fa-map-marker-alt"></i></div>
            <div class="contact-item-title">Adresa</div>
            <div class="contact-item-info">1910 Blvd, The Bronx, NY, USA</div>
        </div>
        <div class="contact-info-item">
            <div class="item-icon"><i class="fas fa-phone-alt"></i></div>
            <div class="contact-item-title">Telefón</div>
            <div class="contact-item-info">+421 234 567 890</div>
        </div>
        <div class="contact-info-item">
            <div class="item-icon"><i class="fas fa-envelope"></i></div>
            <div class="contact-item-title">Email</div>
            <div class="contact-item-info">info@elektrox.sk</div>
        </div>
    </div>
    <div class="form container">
        <div class="form-subtitle">
            Kontaktujte nás
        </div>
        <div class="form-title">
            Kontakujte nás pomocou formuláru
        </div>
        <div class="flex-container">
            <form action="javascript:void(0);">
                <label>
                    <div class="label-title">Meno a priezvisko</div>
                    <input type="text" class="i-text">
                </label>
                <label>
                    <div class="label-title">Email</div>
                    <input type="email" class="i-text">
                </label>
                <label>
                    <div class="label-title">Telefónne číslo</div>
                    <input type="tel" class="i-text">
                </label>
                <label>
                    <div class="label-title">Predmet</div>
                    <input type="text" class="i-text">
                </label>
                <label class="textarea">
                    <div class="label-title">Vaša správa</div>
                    <textarea cols="30" rows="10"></textarea>
                </label>
                <input type="submit" value="Odoslať správu">
            </form>
            <div class="contact-img">
                <img src="img/contact.png" alt="">
            </div>    
        </div>
    </div>
    <div class="map">
        <div class="mapouter"><div class="gmap_canvas">
            <iframe class="gmap_iframe" width="100%" title="Map" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=1532&amp;height=426&amp;hl=en&amp;q=University of Oxford&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
        </div>
    </div>
</main>

<style>
    main{
        background: var(--primary-color);
    }
    .title{
        text-align: center;
        font-size: 2.4em;
        font-weight: 500;
    }
    .nav{
        text-align: center;
        margin-top: 20px;
    }
    .title-container{
        padding: 60px 0;
        background: var(--secondary-color);
    }
    .contact-info{
        margin-top: 50px;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .contact-info-item{
        width: 280px;
        height: 200px;
        background: var(--primary-color);
        margin: 0 10px;
        box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.25);
    }
    .item-icon i{
        font-size: 2.7em;
        margin-top: 30px;
        color: var(--blue-font-color);
    }
    .contact-item-title{
        font-size: 1.2em;
        margin-top: 15px;
        font-weight: 600;
    }
    .contact-item-info{
        font-size: 1.1em;
        margin-top: 15px;
        font-weight: 400;
        color: var(--grey-font-color);
    }
    .form{
        margin-top: 50px;
    }
    .form-subtitle{
        color: var(--blue-font-color);
        padding: 15px 0;
        font-weight: 500;
    }
    .form-title{
        font-size: 1.5em;
        font-weight: 600;
    }
    .flex-container{
        display: flex;
        justify-content: space-between;
    }
    .contact-img{
        width: 35%;
        position: relative;
    }
    .contact-img img{
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    form{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 60%;
        margin-top: 15px;
    }
    label{
        width: 48%;
        margin-top: 15px;
    }
    .label-title{
        padding: 10px 0;
        font-weight: 500;
    }
    input.i-text{
        width: 100%;
        height: 50px;
        outline: none;
        border: 1px solid var(--primary-color);
        background: var(--secondary-color);
        padding: 0 15px;
        font-size: 1.1em;
        border-radius: 5px;
        transition: .5s;
    }
    input.i-text:focus{
        background: var(--primary-color);
        border: 1px solid var(--blue-font-color);
        transition: .5s;
    }
    .textarea{
        width: 100%;
    }
    textarea{
        max-width: 100%;
        min-width: 100%;
        outline: none;
        border: 1px solid var(--primary-color);
        background: var(--secondary-color);
        padding: 15px;
        font-size: 1.1em;
        border-radius: 5px;
        transition: .5s;
    }
    textarea:focus{
        background: var(--primary-color);
        border: 1px solid var(--blue-font-color);
        transition: .5s;
    }
    input[type=submit]{
        width: 180px;
        height: 50px;
    }
    .mapouter{
        position: relative;
        text-align: right;
        margin-top: 100px;
        width: 100%;
        height: 500px;
    }
    .gmap_canvas{
        overflow: hidden;
        background: none !important;
        width: 100%;
        height: 500px;
    }
    .gmap_iframe{
        height: 500px !important;
    }
    @media only screen and (max-width: 900px){
        .contact-img{
            display: none;
        }
        .form{
            width: 100%;
        }
        form{
            width: 100%;
        }
        .contact-info{
            font-size: .8em;
            flex-wrap: wrap;
        }
        .contact-info-item{
            width: 230px;
            height: 160px;
            margin-top: 20px;
        }
        .mapouter{
            height: 300px;
        }
        .gmap_canvas{
            height: 300px;
        }
        .gmap_iframe{
            height: 300px !important;
        }
    }
    @media only screen and (max-width: 750px){
        .title-container{
            padding: 120px 0 60px 0;
            font-size: .8em;
        }
    }
    @media only screen and (max-width: 525px){
        .form{
            font-size: .8em;
        }
        label{
            width: 100%;
            margin-top: 15px;
        }
        input[type=submit]{
            width: 120px;
            height: 40px;
        }
    }
</style>