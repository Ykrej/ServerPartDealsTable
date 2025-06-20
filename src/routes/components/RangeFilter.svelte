<script lang="ts" generics="TData">
  import type { GridApi } from 'ag-grid-community'

  const uid = $props.id()

  let {
    gridApi,
    column,
    placeholder,
  }: {
    gridApi: GridApi<TData>
    column: string
    placeholder?: string
  } = $props()

  let min: number | null = $state(null)
  let max: number | null = $state(null)

  $effect(() => {
    const conditions = []

    if (typeof min === 'number')
      conditions.push({
        filterType: 'number',
        type: 'greaterThanOrEqual',
        filter: min * 1000,
      })

    if (typeof max === 'number')
      conditions.push({
        filterType: 'number',
        type: 'lessThanOrEqual',
        filter: max * 1000,
      })

    let filter
    if (conditions.length)
      filter = {
        filterType: 'number',
        operator: 'AND',
        conditions,
      }

    gridApi
      .setColumnFilterModel(column, filter)
      .then(() => gridApi.onFilterChanged())
  })
</script>

<div>
  <div>
    <input
      type="number"
      id={`${uid}-min`}
      placeholder={placeholder ?? ''}
      class="w-12"
      bind:value={min}
    />
    <label for={`${uid}-min`} class="flex-grow">Minimum</label>
  </div>
  <div>
    <input
      type="number"
      id={`${uid}-max`}
      placeholder={placeholder ?? ''}
      class="w-12"
      bind:value={max}
    />
    <label for={`${uid}-max`} class="flex-grow">Maximum</label>
  </div>
</div>
