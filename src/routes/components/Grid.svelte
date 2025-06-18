<script lang="ts" generics="RowData">
  import { dev } from '$app/environment'
  import {
    ModuleRegistry,
    type GridOptions,
    type GridApi,
    createGrid,
    ClientSideRowModelModule,
    NumberFilterModule,
    TextFilterModule,
    type ColDef,
    ValidationModule,
  } from 'ag-grid-community'
  import { onMount } from 'svelte'

  let {
    columnDefs,
    rowData,
    gridApi = $bindable(),
  }: {
    columnDefs: ColDef[]
    rowData: RowData[]
    gridApi: GridApi<RowData> | undefined
  } = $props()

  const modules = [
    ClientSideRowModelModule,
    NumberFilterModule,
    TextFilterModule,
  ]
  if (dev) modules.push(ValidationModule)
  ModuleRegistry.registerModules(modules)

  let gridDiv: HTMLDivElement
  onMount(() => {
    const gridOptions: GridOptions<RowData> = {
      columnDefs,
      rowData: Array.isArray(rowData) ? rowData : [],
      defaultColDef: {
        sortable: true,
        filter: true,
        filterParams: {
          maxNumConditions: 99,
        },
      },
    }

    if (gridDiv) {
      gridApi = createGrid(gridDiv, gridOptions)
    }
  })
</script>

<div bind:this={gridDiv} style="height: 100vh"></div>
