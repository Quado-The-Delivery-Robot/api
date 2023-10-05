<script lang="ts">
    import MiniContainer from "./containers/mini.svelte";
    import FullContainer from "./containers/full.svelte";
    import { onMount } from "svelte";

    export let endpoint: string;
    export let type: "mini" | "full";

    let restaurants: any = [];
    let loading: boolean = true;

    onMount(async () => {
        const result = await fetch(endpoint);
        const { restaurants: recommendedRestaurants } = await result.json();
        restaurants = recommendedRestaurants;
        loading = false;
    });
</script>

<div class="rounded-lg overflow-hidden">
    {#if loading === true}
        <p class="text-base text-primary-800 text-left font-light">Loading...</p>
    {:else}
        <div class="sectionBodyInner flex gap-4 w-full overflow-x-scroll snap-x snap-mandatory">
            {#each restaurants as restaurant}
                {#if type == "mini"}
                    <MiniContainer {restaurant} />
                {:else}
                    <FullContainer {restaurant} />
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .sectionBodyInner::-webkit-scrollbar {
        display: none;
    }

    .sectionBodyInner {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
