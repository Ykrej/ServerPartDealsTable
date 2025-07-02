<script lang="ts" generics="TData">
  import type { GridApi } from 'ag-grid-community'

  const uid = $props.id()
  let {
    gridApi,
    rowData,
    column,
    field,
  }: {
    gridApi: GridApi<TData>
    rowData: TData[]
    column: string
    field: keyof TData
  } = $props()

  const options = Array.from(
    new Set(rowData.map((record) => record[field]))
  ).sort()
  let selected = $state(Array.from({ length: options.length }).map(() => true))

  $effect(() => {
    const filterValues = selected
      .map((s, i) => (s ? options[i] : false))
      .filter((v) => !!v)
    if (!filterValues || filterValues.length === options.length) {
      gridApi
        .setColumnFilterModel(column, null)
        .then(() => gridApi.onFilterChanged())
      return
    }

    const filter = {
      filterType: 'text',
      operator: 'OR',
      conditions: filterValues.map((val) => ({
        filterType: 'text',
        type: 'equals',
        filter: val,
      })),
    }

    gridApi
      .setColumnFilterModel(column, filter)
      .then(() => gridApi.onFilterChanged())
  })
</script>

<div>
  {#each options as option, i (`${uid}-${option}`)}
    <div>
      <input
        type="checkbox"
        id={`${uid}-${option}`}
        bind:checked={selected[i]}
        value={option}
      />
      <label for={`${uid}-${option}`}>{option}</label>
    </div>
  {/each}
</div>
