import { useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { useDebounce } from '../../hooks/useDebounce'
import { useFilteredExercises } from '../../hooks/catalog/useFilteredExercise'
import { ExerciseCatalogItem } from '../../api/exerciseCatalog'
import { ExerciseInfoModal } from '../exercises/ExerciseInfoModal'

export default function ExerciseSearch() {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)
  const { filtered } = useFilteredExercises(debounced, true)
  const [selected, setSelected] = useState<ExerciseCatalogItem | null>(null)

  return (
    <>
      <Autocomplete
        freeSolo
        options={filtered}
        getOptionLabel={o => typeof o === 'string' ? o : o.name}
        inputValue={query}
        onInputChange={(_, v) => setQuery(v)}
        onChange={(_, value) => {
          if (value && typeof value !== 'string') {
            setSelected(value)
          }
        }}
        renderInput={params => (
          <TextField {...params} placeholder="Search exercises..." fullWidth />
        )}
      />
      <ExerciseInfoModal open={!!selected} exercise={selected} onClose={() => setSelected(null)} />
    </>
  )
}