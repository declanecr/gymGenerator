import api from "./axios";

export interface ProgressPoint {
    date: string
    weight: number
}
export async function fetchProgress(exerciseId: number): Promise<ProgressPoint[]> {
    const res = await api.get<ProgressPoint[]>(`/progress/${exerciseId}`);
    return res.data;
}