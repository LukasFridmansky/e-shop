<script>
    export let showOnPx = 150;
    let hidden = true;

    function goTop() {
        document.body.scrollIntoView();
    }

    function scrollContainer() {
        return document.documentElement || document.body;
    }

    function handleOnScroll() {
        if (!scrollContainer()) {
            return;
        }

        if (scrollContainer().scrollTop > showOnPx) {
            hidden = false;
        } else {
            hidden = true;
        }
    }
</script>

<style>
    .back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        background: var(--blue-font-color);
        cursor: pointer;
        font-size: 1.2em;
        user-select: none;
        z-index: 10;
        transition: .5s;
    }
    .back-to-top.hidden {
        bottom: -50px;
        transition: .5s;
    }
    .back-to-top:hover {
        background: var(--font-color);
    }
    .back-to-top i {
        color: var(--primary-color);
    }
</style>

<svelte:window on:scroll={handleOnScroll} />

<div class="back-to-top" on:click={goTop} class:hidden><i class="fas fa-arrow-up"></i></div>
