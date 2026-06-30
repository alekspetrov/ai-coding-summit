import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpeakerRow } from '@/components/speaker/SpeakerRow';
import type { Speaker } from '@/lib/schema';

const speaker: Speaker = {
  id: 'sp-1',
  name: 'Ada Lovelace',
  company: 'Analytical Engines',
  tagline: 'Mathematician & first programmer',
  bio: 'Wrote the first algorithm.',
  initials: 'AL',
  tint: '#61DAFB',
};

describe('SpeakerRow', () => {
  it('renders name, tagline, initials and links to the speaker', () => {
    render(<SpeakerRow speaker={speaker} href="/speakers/sp-1" />);
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Mathematician & first programmer')).toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/speakers/sp-1');
  });
});
