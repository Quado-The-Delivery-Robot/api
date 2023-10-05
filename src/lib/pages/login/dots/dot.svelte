<script lang="ts">
    import { onMount } from "svelte";

    let dot: HTMLDivElement;

    onMount(() => {
        dot.style.left = `${Math.random() * window.innerWidth}px`;
        dot.style.top = `${Math.random() * window.innerHeight}px`;
    });
</script>

<div class="absolute w-[30px] aspect-square rounded-full bg-brand-600" bind:this={dot} />
