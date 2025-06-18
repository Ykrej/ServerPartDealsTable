<script lang="ts">
  import type { ColDef, GridApi } from 'ag-grid-community'
  import Grid from './Grid.svelte'
  import type { ServerPartsRecord } from '../../clientLib/serverPartDeals'

  const { rowData } = $props()

  let gridApi: GridApi | undefined = $state()
  $effect(() => {
    // gridApi?.setFilterModel({
    //   capacityGb: {
    //     filterType: 'number',
    //     type: 'lessThan',
    //     filter: 2000,
    //   },
    // })
  })

  const columnDefs: ColDef[] = [
    { field: 'brand' },
    {
      headerName: 'Capacity',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.capacityGb)) return 'NaN'
        if (data.capacityGb >= 1000) {
          const terabytes = data.capacityGb / 1000
          if (terabytes % 1 !== 0) return `${terabytes.toFixed(2)} TB`
          return `${terabytes} TB`
        }
        return `${data.capacityGb} GB`
      },
    },
    { field: 'condition' },
    { field: 'formFactor' },
    { field: 'type' },
    {
      headerName: 'Price / Capacity',
      valueGetter: ({ data }: { data: ServerPartsRecord }) => {
        return `$${(data.priceUsd / (data.capacityGb / 1000)).toFixed(2)} / TB`
      },
    },
    {
      headerName: 'Price',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.priceUsd)) return 'NaN'

        return `$${data.priceUsd.toFixed(2)}`
      },
    },
    { field: 'sku' },
    { field: 'interface' },
    {
      headerName: 'Interface Speed',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.interfaceSpeedGbPerSecond)) return `NaN`

        return `${data.interfaceSpeedGbPerSecond} GB/s`
      },
    },
    {
      headerName: 'Warranty Duration',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.warrantyDays)) return 'NaN'

        const totalDays = Math.floor(data.warrantyDays)
        const years = Math.floor(totalDays / 365)
        const days = totalDays % 365

        let text = ''
        if (years > 0) text += `${years} Year${years > 1 ? 's' : ''}`
        if (days > 0) text += ` ${days} Day${days > 1 ? 's' : ''}`

        text = text.trim()

        return text ? text : '0 Days'
      },
    },
  ].map((baseFilter) => ({ ...baseFilter, suppressHeaderFilterButton: true }))
</script>

<div class="flex">
  <div class="w-48 flex-none">
    <p>Hello World</p>
  </div>
  <div class="flex-1">
    <Grid bind:gridApi {rowData} {columnDefs} />
  </div>
</div>
