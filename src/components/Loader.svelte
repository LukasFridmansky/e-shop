<script>
    let isPageLoaded = false;

    function stopLoading() {
        setTimeout(() => {
            isPageLoaded = true;
            //window.stop();
        }, 3000);
    }
    stopLoading();

    window.addEventListener('load', function () {
		isPageLoaded = true;
	})
</script>

<main>
    {#if !isPageLoaded}
        <div class="body">
            <div class="logo-conatiner">
                <div class="logo">
					<i class="fas fa-bolt"></i>
					Electro<span class="x-blue">X</span>
			    </div>
            </div>
            <div class="container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    {:else}
        <slot/>
    {/if}
</main>

<style>
    .body {
	    width: 100vw;
	    height: 100vh;
        position: fixed;
        z-index: 99999;
	    background: linear-gradient(to right,var(--primary-color), var(--secondary-color));
    }
    .logo-conatiner{
        position: absolute;
        top: 50px;
        left: 50px;
        user-select: none;
    }
    .logo {
        font-size: 1.65em;
        font-weight: 700;
    }

    .logo i,
    .x-blue {
        color: var(--blue-font-color);
        font-weight: 800;
    }
    .container {
        margin: auto;
        position: absolute;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
        height: 300px;
        width: 300px;
    }
    .container .dot {
        position: absolute;
        transform: translate(-50%,-50%);
        top: 52.5%;
        left: 150px;
        height: 20px;
        width: 20px;
        background-color: var(--grey-font-color);
        border-radius: 5rem;
        transition: all 0.15s ease-in-out;
    }
    .container .dot:nth-child(1) {
        left: 80px;
        animation: waveUp 2s, smallExtend 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }
    .container .dot:nth-child(2) {
        left: 115px;
        animation: waveUp 2s, largeExtend 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-delay: 0.15s;
    }
    .container .dot:nth-child(3) {
        animation: waveUp 2s, smallExtend 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-delay: 0.3s;
    }
    .container .dot:nth-child(4) {
        left: 185px;
        animation: waveUp 2s, largeExtend 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-delay: 0.45s;
    }
    .container .dot:nth-child(5) {
        left: 220px;
        animation: waveUp 2s, smallExtend 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-delay: 0.6s;
    }
    @keyframes waveUp {
        0%, 15% {
            top: 50%;
        }
        45%, 65% {
            top: 42.5%;
        }
        85%, 100% {
            top: 50%;
        }
    }
    @keyframes smallExtend {
        0%,8% {
            background-color: var(--grey-font-color);
            height: 20px;
        }
        14%,34% {
            background-color: var(--font-color);
            height: 47.5px;
        }
        46%,100% {
            background-color: var(--grey-font-color);
            height: 20px;
        }
    }
    @keyframes largeExtend {
        0%,8% {
            background-color: var(--grey-font-color);
            height: 20px;
        }
        14%,34% {
            background-color: var(--font-color);
            height: 82.5px;
        }
        46%,100% {
            background-color: var(--grey-font-color);
            height: 20px;
        }
    }
    @media only screen and (max-width: 600px){
        .logo-conatiner{
            position: absolute;
            top: 20px;
            left: 20px;
            user-select: none;
        }
    }
</style>