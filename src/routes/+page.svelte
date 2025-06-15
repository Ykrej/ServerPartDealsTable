<script lang="ts">
    import Grid from "./components/Grid.svelte";

    let { data } = $props()

    const columns = ["brand", "capacityGb", "condition", "formFactor", "type", "priceUsd", "sku", "interface", "interfaceSpeedGbPerSecond", "warrantyDays"].map(field => ({
        field,
        filter: true
    }))
</script>

<Grid columnDefs={columns} rowData={data.serverPartsData} />
