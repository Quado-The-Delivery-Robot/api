<script lang="ts">
    import ArrowRight from "$lib/components/images/arrowRight.svelte";
    import SectionBody from "./sectionBody.svelte";

    export let endpoint: string;
    export let sectionName: string;
    export let type: "mini" | "full";
</script>

<div class="w-full">
    <div class="flex justify-between items-center mb-1">
        <p class="text-lg font-semibold">{sectionName}</p>
        <a href="/{sectionName}/all" class="flex items-center text-sm opacity-50 font-light">See all <ArrowRight classes="aspect-square h-3.5 stroke-white" /></a>
    </div>

    <SectionBody {endpoint} {type} />
</div>
