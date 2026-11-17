import React from 'react';
import { LegalPage } from './LegalPage';

const SECTIONS = [
  {
    heading: 'This is entertainment, in both directions',
    body: [
      'Time Machine produces imaginative, astrology-inspired fiction about a life you did not live. 2050 produces speculative fiction about a year that has not happened. Neither is a statement of fact, a historical record, a prediction, or a forecast.',
      'Nothing produced here is professional advice of any kind — not medical, psychological, legal, financial or career advice. If you are making a real decision, consult someone qualified to help with it.',
    ],
  },
  {
    heading: 'What the readings will not do',
    body: [
      'A reading will not attribute real suffering, illness, disability, bereavement or hardship to past actions, karma, or anything you supposedly did in another life.',
      'A projection will not make claims about your real lifespan, health, fertility, finances, legal outcomes or relationships. It is a story in which someone with your name does a job that does not exist yet.',
    ],
  },
  {
    heading: 'Generated content',
    body: [
      'Chronicles and portraits are produced by automated systems. Output is fictional by design and may contain inaccuracies, anachronisms, or descriptions that bear no resemblance to anything real — that is the intended behaviour, not a defect.',
      'Characters, places, organisations and events in any reading are invented. Any resemblance to real people or institutions is coincidental.',
    ],
  },
  {
    heading: 'Your photograph',
    body: [
      'Only upload a photograph of yourself, or one you have the clear right to use. Do not upload images of other people without their permission, and do not upload images of children.',
      'Uploading is always optional. Every reading works, and is just as complete, without one.',
    ],
  },
  {
    heading: 'Acceptable use',
    body: [
      'Do not use this service to impersonate a real person, to produce material that harasses or defames anyone, or to represent any output as a genuine historical record or a real prediction about someone.',
      'Readings may be shared, exported and printed for personal use. Do not present them to other people as factual.',
    ],
  },
  {
    heading: 'No warranty',
    body: [
      'The service is provided as-is. Generation can fail, a provider can be unavailable, and readings expire on a schedule. Export anything you want to keep.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      pageTitle="Terms — Time Machine"
      eyebrow="Terms"
      title="The terms, plainly"
      updated="12 November 2026"
      intro="Everything here is fiction on both sides of now, nothing here is advice, and anything you want to keep should be exported."
      sections={SECTIONS}
    />
  );
}
