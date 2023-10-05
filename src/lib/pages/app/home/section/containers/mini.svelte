<script lang="ts">
    export let restaurant: any;
</script>

<div class="w-fit h-fit rounded-lg p-4 border border-backgroundSecondary snap-start shrink-0" style="background-color: {restaurant.colors[0]};">
    <img class="w-14 h-14" src={restaurant.image} alt={restaurant.name} />
</div>
