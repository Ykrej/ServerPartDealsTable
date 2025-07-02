<script lang="ts">
  import type { ColDef, GridApi, SortDirection } from 'ag-grid-community'
  import Grid from './Grid.svelte'
  import type { ServerPartsRecord } from '../../clientLib/serverPartDeals'
  import Spinner from './Spinner.svelte'
  import CheckBoxFilter from './CheckBoxFilter.svelte'
  import { mount } from 'svelte'
  import CellLink from './CellLink.svelte'
  import RangeFilter from './RangeFilter.svelte'

  const uid = $props.id()
  const { rowData } = $props()
  let filterMenuOpen = $state(true)

  const filterDivClass =
    'm-1 rounded-sm border-1 bg-gray-50 px-1 drop-shadow-md'

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
      headerName: 'Warranty',
      valueFormatter: ({ data }: { data: ServerPartsRecord }) => {
        if (!Number.isFinite(data.warrantyDays)) return 'NaN'

        let remainingDays = Math.floor(data.warrantyDays)
        const years = Math.floor(remainingDays / 365)
        remainingDays = remainingDays % 365

        const months = Math.floor(remainingDays / 30)
        remainingDays = remainingDays % 30

        let text = ''
        if (years > 0) text += `${years} Year${years > 1 ? 's' : ''}`
        if (months > 0) text += ` ${months} Month${months > 1 ? 's' : ''}`
        if (remainingDays > 0)
          text += ` ${remainingDays} Day${remainingDays > 1 ? 's' : ''}`

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
      minWidth: 42,
      maxWidth: 42,
      cellRenderer: ({ value }: { value: string }) => {
        let element = document.createElement('div')

        mount(CellLink, {
          target: element,
          props: { href: value },
        })

        return element
      },
    },
  ].map((baseColDef: ColDef) => ({
    ...baseColDef,
    suppressHeaderFilterButton: true,
    flex: 1,
    minWidth: baseColDef.minWidth ?? 96,
  }))

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
  <div class="h-screen flex-none {filterMenuOpen ? 'w-48' : 'w-6'}">
    <button
      onclick={() => (filterMenuOpen = !filterMenuOpen)}
      class="m-0 w-full drop-shadow-sm hover:bg-sky-50 hover:drop-shadow-md {filterMenuOpen
        ? ''
        : 'h-screen'}"
    >
      {#if filterMenuOpen}
        <div class="flex p-1 px-2">
          <span>Filters</span>
        </div>
      {:else}
        <div class="flex -translate-1/2">
          <span class="-rotate-90">Filters</span>
        </div>
      {/if}
    </button>
    {#if gridApi && filterMenuOpen}
      {#each checkboxFilterDefs as { label, column } (`${uid}-${column}`)}
        <div class={filterDivClass}>
          <span>{label}</span>
          <CheckBoxFilter {gridApi} {rowData} {column} field={column} />
        </div>
      {/each}
      <div class={filterDivClass}>
        <span>Capacity</span>
        <RangeFilter
          {gridApi}
          column="capacityGb"
          placeholder="TB"
          valueGetter={(value) => value * 1000}
        />
      </div>
      <div class={filterDivClass}>
        <span>Warranty Months</span>
        <RangeFilter
          {gridApi}
          column="warrantyDays"
          placeholder="Months"
          valueGetter={(value) => value * 30}
        />
      </div>
    {:else if filterMenuOpen}
      <Spinner class="justify-items-end" />
    {/if}
  </div>
  <div class="flex-1">
    <Grid bind:gridApi {rowData} {columnDefs} />
  </div>
</div>
