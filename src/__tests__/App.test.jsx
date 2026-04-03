import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Inicio from '../components/INICIO/Inicio';

describe('Inicio', () => {
  it('renders login form', () => {
    render(<Inicio />);
    expect(screen.getByText(/TICKETERA/i)).toBeInTheDocument();
  });
});
