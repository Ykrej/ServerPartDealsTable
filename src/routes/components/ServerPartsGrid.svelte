<script lang="ts">
  import type { ColDef, GridApi, SortDirection } from 'ag-grid-community'
  import Grid from './Grid.svelte'
  import type { ServerPartsRecord } from '../../clientLib/serverPartDeals'
  import Spinner from './Spinner.svelte'
  import CheckBoxFilter from './CheckBoxFilter.svelte'
  import { mount } from 'svelte'
  import CellLink from './CellLink.svelte'

  const uid = $props.id()
  const { rowData } = $props()

  let gridApi: GridApi | undefined = $state()

  const columnDefs: ColDef[] = [
    {
      colId: 'pricePerCapacity',
      headerName: 'Price / Capacity',
      initialSort: 'asc' as SortDirection,
      valueGetter: ({ data }: { data: ServerPartsRecord }) => {
        return data.priceUsd / (data.capacityGb / 1000)
      },
      valueFormatter: ({ value }: { value: number }) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return 'NaN'
        return `$${value.toFixed(2)} / TB`
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
    { field: 'interface' },
    { field: 'formFactor' },
    { field: 'condition' },
    { field: 'type' },
    {
      field: 'interfaceSpeed',
      headerName: 'Interface Speed',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.interfaceSpeedGbPerSecond)) return `NaN`

        return `${data.interfaceSpeedGbPerSecond} GB/s`
      },
    },
    { field: 'brand' },
    {
      field: 'link',
      headerName: '',
      pinned: 'right' as const,
      filter: false,
      sortable: false,
      resizable: false,
      width: 42,
      cellRenderer: ({ value }: { value: string }) => {
        let element = document.createElement('div')

        mount(CellLink, {
          target: element,
          props: { href: value },
        })

        return element
      },
    },
  ].map((baseFilter) => ({ ...baseFilter, suppressHeaderFilterButton: true }))

  const checkboxFilterDefs = [
    {
      label: 'Storage Type',
      column: 'type',
    },
    {
      label: 'Condition',
      column: 'condition',
    },
    {
      label: 'Interface',
      column: 'interface',
    },
    {
      label: 'Form Factor',
      column: 'formFactor',
    },
  ]
</script>

<div class="flex">
  <div class="h-screen w-48 flex-none">
    {#if gridApi}
      {#each checkboxFilterDefs as { label, column } (`${uid}-${column}`)}
        <div class="m-1 rounded-sm border-1 bg-gray-50 px-1 drop-shadow-md">
          <span>{label}</span>
          <CheckBoxFilter {gridApi} {rowData} {column} field={column} />
        </div>
      {/each}
    {:else}
      <Spinner class="justify-items-end" />
    {/if}
  </div>
  <div class="flex-1">
    <Grid bind:gridApi {rowData} {columnDefs} />
  </div>
</div>
