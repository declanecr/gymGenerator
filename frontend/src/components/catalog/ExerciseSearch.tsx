import { useState } from 'react'
import { Autocomplete, Box, TextField } from '@mui/material'
import { useDebounce } from '../../hooks/useDebounce'
import { useFilteredExercises } from '../../hooks/catalog/useFilteredExercise'
import { ExerciseCatalogItem } from '../../api/exerciseCatalog'
import { ExerciseInfoModal } from '../exercises/ExerciseInfoModal'

interface ExerciseSearchProps {
    onSelect?: (exercise: ExerciseCatalogItem) => void
}

export default function ExerciseSearch({ onSelect }: ExerciseSearchProps) {
    const [query, setQuery] = useState('')
    const debounced = useDebounce(query, 300)
    const { filtered } = useFilteredExercises(debounced, true)
    const [selected, setSelected] = useState<ExerciseCatalogItem | null>(null)

    return (
        <Box sx={{width: '100%', minWidth: 200}} >
            <Autocomplete
                freeSolo
                options={filtered}
                getOptionLabel={o => typeof o === 'string' ? o : o.name}
                inputValue={query}
                onInputChange={(_, v) => setQuery(v)}
                onChange={(_, value) => {
                    if (value && typeof value !== 'string') {
                        setSelected(value)
                        onSelect?.(value)
                    }
                }}
                renderInput={params => (
                    <TextField {...params} placeholder="Search exercises..." fullWidth />
                )}
                fullWidth
            />
            <ExerciseInfoModal open={!!selected} exercise={selected} onClose={() => setSelected(null)} />
        </Box>
    )
}