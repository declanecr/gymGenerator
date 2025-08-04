import api from "./axios";

export interface ProgressPoint {
    date: string
    volume: number
}
export async function fetchProgress(exerciseId: number): Promise<ProgressPoint[]> {
    const res = await api.get<ProgressPoint[]>(`/workouts/progress/exercise?exerciseId=${exerciseId}`);
    console.log('fetchProgress: ', res.data);
    if (!res.data) {
        throw new Error("No progress data found");
    }
    return res.data;
}