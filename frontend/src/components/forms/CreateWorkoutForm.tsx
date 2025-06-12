// src/components/forms/CreateWorkoutForm.tsx
import React from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import type { CreateWorkoutInput } from '../../schemas/createWorkoutSchema';
import type { TemplateWorkout } from '../../api/templateWorkouts';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

interface CreateWorkoutFormProps {
  templates: TemplateWorkout[];
  isLoadingTemplates: boolean;
  form: UseFormReturn<CreateWorkoutInput>;
  onSubmit: (values: CreateWorkoutInput) => void;
}

const CreateWorkoutForm: React.FC<CreateWorkoutFormProps> = ({
  templates,
  isLoadingTemplates,
  form,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormControl
        fullWidth
        margin="normal"
        error={Boolean(errors.workoutTemplateId)}
        disabled={isLoadingTemplates}
      >
        <InputLabel id="template-label">Template (optional)</InputLabel>
        <Controller
          name="workoutTemplateId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value ?? ''} // ensure controlled, fallback to ''
              labelId="template-label"
              label="Template (optional)"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {templates.map((tpl) => (
                <MenuItem key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        <FormHelperText>
          {errors.workoutTemplateId?.message}
        </FormHelperText>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        Create Workout
      </Button>
    </form>
  );
};

export default CreateWorkoutForm;
