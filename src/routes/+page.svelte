<script lang="ts">
    import Grid from "./components/Grid.svelte";

    let { data } = $props()
    console.log("Item Count", data.serverPartsData.length)
    
    const columns = ["brand", "capacityGb", "condition", "formFactor", "type", "priceUsd", "sku", "interface", "interfaceSpeed"].map(field => ({
        field,
        filter: true
    }))
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<h1>Data</h1>
<Grid columnDefs={columns} rowData={data.serverPartsData} />
