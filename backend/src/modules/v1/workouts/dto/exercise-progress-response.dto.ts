export class ExerciseProgressResponseDto {
  date: string;
  volume: number;

  constructor(data: { date: string; volume: number }) {
    this.date = data.date;
    this.volume = data.volume;
  }
}
