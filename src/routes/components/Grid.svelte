<script lang="ts" generics="RowData">
  import {
    ModuleRegistry,
    type GridOptions,
    createGrid,
    ClientSideRowModelModule,
    NumberFilterModule,
    TextFilterModule,
  } from 'ag-grid-community'
  import { onMount } from 'svelte'

  let { columnDefs, rowData, gridApi = $bindable() } = $props()

  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    NumberFilterModule,
    TextFilterModule,
  ])

  let gridDiv: HTMLDivElement
  onMount(() => {
    const gridOptions: GridOptions<RowData> = {
      columnDefs,
      rowData: Array.isArray(rowData) ? rowData : [],
      defaultColDef: {
        sortable: true,
        filter: true,
      },
    }

    if (gridDiv) {
      gridApi = createGrid(gridDiv, gridOptions)
    }
  })
</script>

<div bind:this={gridDiv} style="height: 100vh"></div>
