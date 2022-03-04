<script>
    export let params = {};
    params;

</script>

<svelte:head>
    <title>Page Not Found</title>
</svelte:head>

<main>
    <div class="error">
        <div class="container error-container">
            <div class="flex-container">
                <div class="code">404 </div>
                <div class="message">PAGE NOT FOUND </div>
            </div>
            <a href="#/" class="button-a">
                <div class="button">
                    Vrátiť sa na domovskú stránku
                </div>
            </a>
        </div>
    </div>
</main>
<style>
    .error{
        height: 500px;
        background: var(--secondary-color);
        position: relative;
    }
    .error-container{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .flex-container{
        display: flex;
    }
    .code{
        color: var(--blue-font-color);
        border-right: 3px solid;
        font-size: 55px;
        padding: 0 10px 0 10px;
        text-align: center;
    }
    .message{
        color: var(--blue-font-color);
        font-size: 40px;
        text-align: center;
        padding: 10px;
    }
    .button{
		background: var(--blue-font-color);
		color: var(--font-color-unchanged);
		font-weight: 600;
		text-align: center;
		padding: 15px;
		margin-top: 55px;
		cursor: pointer;
		transition: .5s;
	}
	.button:hover{
		background: var(--font-color);
		color: var(--primary-color);
		box-shadow: 0 0 15px -6px rgba(0, 0, 0, 0.41);
		transition: .5s;
	}
	.button-a{
		color: var(--font-color-unchanged);
		display: block;
		width: 300px;
		height: 100%;
        margin: 20px auto;
		transition: .5s;
	}
	.button-a:hover{
		color: var(--secondary-color);
		transition: .5s;
	}
</style>