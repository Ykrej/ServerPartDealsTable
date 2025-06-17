<script lang="ts"  generics="RowData">
    import { ModuleRegistry, type GridOptions, createGrid, ClientSideRowModelModule, type GridApi } from "ag-grid-community";
    import { onMount } from "svelte"

    const { columnDefs, rowData } = $props()

    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    let gridDiv: HTMLDivElement;
    onMount(() => {
        const gridOptions: GridOptions<RowData> = {
            columnDefs,
            rowData: Array.isArray(rowData) ? rowData: [],
            defaultColDef: {
                sortable: true,
                filter: true
            }
        }

        if (gridDiv) {
            createGrid(gridDiv, gridOptions)
        }
    })
</script>

<div bind:this={gridDiv} style="height: 100vh"></div>
