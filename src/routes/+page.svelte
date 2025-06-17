<script lang="ts">
    import ServerPartsGrid from "./components/ServerPartsGrid.svelte";

    let { data } = $props()
</script>

<ServerPartsGrid rowData={data.serverPartsData} />
