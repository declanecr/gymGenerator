import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exampleSchema, Example } from '../schemas/exampleSchema';

export const ExampleForm = () => {
  const { register, handleSubmit } = useForm<Example>({
    resolver: zodResolver(exampleSchema),
  });

  const onSubmit = (data: Example) => {
    // TODO: handle form submission
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
      <button type="submit">Submit</button>
    </form>
  );
};
