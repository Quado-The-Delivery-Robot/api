<script lang="ts">
    import Dot from "./dot.svelte";
</script>

<div class="absolute w-screen h-screen blur-lg top-0 left-0 z-[0] overflow-hidden">
    {#each Array(4) as dot}
        <Dot />
    {/each}
</div>
