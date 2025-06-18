<script lang="ts">
  import type { ColDef, GridApi } from 'ag-grid-community'
  import Grid from './Grid.svelte'
  import type { ServerPartsRecord } from '../../clientLib/serverPartDeals'
  import Spinner from './Spinner.svelte'
  import CheckBoxFilter from './CheckBoxFilter.svelte'

  const { rowData } = $props()

  let gridApi: GridApi | undefined = $state()

  const columnDefs: ColDef[] = [
    { field: 'brand' },
    {
      field: 'capacityGb',
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
      colId: 'pricePerCapacity',
      headerName: 'Price / Capacity',
      valueGetter: ({ data }: { data: ServerPartsRecord }) => {
        return `$${(data.priceUsd / (data.capacityGb / 1000)).toFixed(2)} / TB`
      },
    },
    {
      field: 'priceUsd',
      headerName: 'Price',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.priceUsd)) return 'NaN'

        return `$${data.priceUsd.toFixed(2)}`
      },
    },
    { field: 'sku' },
    { field: 'interface' },
    {
      field: 'interfaceSpeed',
      headerName: 'Interface Speed',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.interfaceSpeedGbPerSecond)) return `NaN`

        return `${data.interfaceSpeedGbPerSecond} GB/s`
      },
    },
    {
      field: 'warrantyDays',
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
  <div class="h-screen w-48 flex-none">
    {#if gridApi}
      <div class="m-1 rounded-sm border-1 bg-gray-50 px-1 drop-shadow-md">
        <span>Storage Type</span>
        <CheckBoxFilter {gridApi} {rowData} column="type" field="type" />
      </div>
      <div class="m-1 rounded-sm border-1 bg-gray-50 px-1 drop-shadow-md">
        <span>Interface</span>
        <CheckBoxFilter
          {gridApi}
          {rowData}
          column="interface"
          field="interface"
        />
      </div>
    {:else}
      <Spinner class="justify-items-end" />
    {/if}
  </div>
  <div class="flex-1">
    <Grid bind:gridApi {rowData} {columnDefs} />
  </div>
</div>
