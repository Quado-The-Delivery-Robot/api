<script lang="ts">
    export let restaurant: any;
</script>

<div class="h-full rounded-lg p-4 border border-backgroundSecondary bg-background flex items-center justify-start gap-4 snap-start w-[290px] shrink-0" style="background-color: {restaurant.colors[0]};">
    <img class="w-14 h-14" src={restaurant.image} alt={restaurant.name} />

    <div class="h-full py-1.5 flex flex-col justify-between items-start">
        <p class="font-semibold text-lg" style="color: {restaurant.colors[1]};">{restaurant.name}</p>
        <p class="text-sm text-ellipsis" style="color: {restaurant.colors[2]};">{restaurant.tags.join(", ")}</p>
    </div>
</div>
