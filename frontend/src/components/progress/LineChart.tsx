import { Grid, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";
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
    progress
}: Props){
    return (
        <Grid sx={{width:'100%', height:'100%'}}>
            {selectedExerciseId &&
                (progress.length ? (
                    <LineChart
                    xAxis={[{
                        data: progress.map(p => new Date(p.date)),
                        scaleType: 'linear',
                        valueFormatter: (d: Date) => dayjs(d).format('MMM D'),
                    }]}
                    series={[{ data: progress.map(p => p.volume) }]}
                    height={undefined}
                    />
                ) : (
                    <Typography>No data yet</Typography>
                )
                )
            }
        </Grid>
    )   
    
}

