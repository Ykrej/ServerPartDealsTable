<script lang="ts">
  import type { ColDef } from 'ag-grid-community'
  import Grid from './Grid.svelte'

  const { rowData } = $props()
  const columnDefs: ColDef[] = [
    { field: 'brand' },
    {
      field: 'capacityGb',
      headerName: 'Capacity',
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
    {
      field: 'priceUsd',
      headerName: 'Price',
      valueFormatter: ({ value }) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return 'NaN'

        return `$${value.toFixed(2)}`
      },
    },
    { field: 'sku' },
    { field: 'interface' },
    {
      field: 'interfaceSpeedGbPerSecond',
      headerName: 'Interface Speed',
      valueFormatter: ({ value }) => {
        if (typeof value !== 'number' || !Number.isFinite) return `NaN`

        return `${value} GB/s`
      },
    },
    {
      field: 'warrantyDays',
      headerName: 'Warranty Duration',
      valueFormatter: ({ value }) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return 'NaN'

        const totalDays = Math.floor(value)
        const years = Math.floor(totalDays / 365)
        const days = totalDays % 365

        let text = ''
        if (years > 0) text += `${years} Year${years > 1 ? 's' : ''}`
        if (days > 0) text += ` ${days} Day${days > 1 ? 's' : ''}`

        text = text.trim()

        return text ? text : '0 Days'
      },
    },
  ]
</script>

<div class="flex">
  <div class="w-48 flex-none">
    <p>Hello World</p>
  </div>
  <div class="flex-1">
    <Grid {rowData} {columnDefs} />
  </div>
</div>
