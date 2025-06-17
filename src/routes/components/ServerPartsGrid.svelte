<script lang="ts">
  import type { ColDef } from 'ag-grid-community'
  import Grid from './Grid.svelte'

  const { rowData } = $props()
  const columnDefs: ColDef[] = [
    { field: 'brand' },
    {
      field: 'capacityGb',
      valueFormatter: ({ value }) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return 'NaN'
        if (value > 1000) {
          const terabytes = value / 1000
          if (terabytes % 1 !== 0) return `${terabytes.toFixed(2)} TB`
          return `${terabytes} TB`
        }
        return `${value} GB`
      },
    },
    { field: 'condition' },
    { field: 'formFactor' },
    { field: 'type' },
    { field: 'priceUsd' },
    { field: 'sku' },
    { field: 'interface' },
    { field: 'interfaceSpeedGbPerSecond' },
    { field: 'warrantyDays' },
  ]
</script>

<div class="flex">
  <div class="flex-none w-48">
    <p>Hello World</p>
  </div>
  <div class="flex-1">
    <Grid {rowData} {columnDefs} />
  </div>
</div>
