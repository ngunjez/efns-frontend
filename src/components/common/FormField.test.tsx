import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('labels the control and announces its error', () => {
    render(
      <FormField label="Work email" required error="Enter your work email">
        {(control) => <input {...control} />}
      </FormField>,
    );
    const input = screen.getByLabelText(/Work email/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter your work email');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter your work email');
  });
});
