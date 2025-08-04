import { useQuery } from "@tanstack/react-query";
import { fetchProgress, ProgressPoint } from "../../api/progress";

export function useProgress(exerciseId: number) {
    return useQuery<ProgressPoint[]>({
        queryKey: ["progress", exerciseId],
        queryFn: () => fetchProgress(exerciseId as number),
        enabled: !!exerciseId,
    });
}