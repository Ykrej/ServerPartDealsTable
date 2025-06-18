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
  let selected = $state(options[0])

  $effect(() => {
    if (!selected) return
    gridApi.setFilterModel({
      ...gridApi.getFilterModel(),
      [column]: {
        filterType: 'text',
        type: 'equals',
        filter: selected,
      },
    })
    console.log('Set Filter', selected)
    console.log('Current Filter', gridApi.getFilterModel())
  })
</script>

<div>
  {#each options as option (`${uid}-${option}`)}
    <div>
      <input
        type="radio"
        id={`${uid}-${option}`}
        bind:group={selected}
        value={option}
      />
      <label for={`${uid}-${option}`}>{option}</label>
    </div>
  {/each}
</div>
