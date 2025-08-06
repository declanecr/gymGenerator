import {  Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";

interface Progress {
    date: string;
    volume: number;
}

interface Props {
    selectedExerciseId: number | null;
    progress: Progress[]
}

export default function ProgressLineChart({
    selectedExerciseId,
    progress,
}: Props){
    return (
        <>
        {selectedExerciseId &&
            (progress.length ? (
                    <LineChart
                    xAxis={[{
                        data: progress.map(p => new Date(p.date)),
                        scaleType: 'linear',
                        valueFormatter: (d: Date) => dayjs(d).format('MMM D'),
                    }]}
                    series={[{ data: progress.map(p => p.volume) }, ]}
                    />
                ) : (
                    <Typography>No data yet</Typography>
                )
                )
            }
        </>
    )   
    
}

