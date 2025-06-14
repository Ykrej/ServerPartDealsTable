<script lang="ts"  generics="RowData">
    import { ModuleRegistry, themeQuartz, colorSchemeDarkBlue, type ColDef, type GridOptions, createGrid, ClientSideRowModelModule } from "ag-grid-community";
    import { onMount } from "svelte"

    ModuleRegistry.registerModules([ClientSideRowModelModule]);

    export let columnDefs: ColDef[] = []
    export let rowData: RowData[] = []

    const darkTheme = themeQuartz.withPart(colorSchemeDarkBlue).withParams({
        backgroundColor: '#212121',
        foregroundColor: '#ffffff',
        headerBackgroundColor: '#37474f',
        headerTextColor: '#cfd8dc',
        oddRowBackgroundColor: '#263238'
    });


    let gridDiv: HTMLDivElement;

    onMount(() => {
        const gridOptions: GridOptions<RowData> = {
            theme: darkTheme,
            columnDefs,
            rowData,
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

<div bind:this={gridDiv} style="height: 800px; width: 100%;"></div>
