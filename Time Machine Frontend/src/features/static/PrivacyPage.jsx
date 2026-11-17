import React from 'react';
import { LegalPage } from './LegalPage';

const SECTIONS = [
  {
    heading: 'What is collected',
    body: [
      'Only what you type into a wizard: a preferred name if you give one, a date of birth, a star sign, optionally a birth time and birthplace, and the preferences you select. There is no account, no email address and no password.',
      'If you choose to share a photograph, the image file is collected as well. That requires its own separate, explicit consent and is never implied by anything else you agree to.',
    ],
  },
  {
    heading: 'What it is used for',
    body: [
      'Your answers are used to generate one reading and nothing else. They are sent to the generation service that writes the chronicle and renders the portrait, and they are stored against that reading so you can come back to it.',
      'A shared photograph is used solely to preserve your likeness in the portrait for that one reading. It is not used to train anything, it is not shown to other people, and it is not used for any other purpose.',
    ],
  },
  {
    heading: 'Who can see a reading',
    body: [
      'A reading is reachable by its link. Anyone you send that link to can read it, so treat it as you would any other link to something personal.',
      'Destructive actions — deleting a reading, re-rendering a portrait — additionally require an owner token that is stored only in the browser that created the reading. Nobody else can change or delete your reading, even with the link.',
    ],
  },
  {
    heading: 'How long it is kept',
    body: [
      'Readings are deleted automatically 30 days after they are created, along with every asset generated for them and any photograph attached to them.',
      'You can delete a reading sooner at any time from the reading itself or from your archive. Deleting removes the chronicle, the portrait, the stored profile and the uploaded photograph together, and cannot be undone.',
    ],
  },
  {
    heading: 'What is stored in your browser',
    body: [
      'Two things: the owner tokens for readings this browser created, and the archive list that lets you find them again. Both live in localStorage, never leave the device, and are not readable by the server.',
      'Clearing your browser data removes both. The readings themselves will remain on the server until they expire, but you will no longer have the links.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      pageTitle="Privacy — Time Machine"
      eyebrow="Privacy"
      title="What happens to what you tell us"
      updated="12 November 2026"
      intro="Short version: no account, nothing sold or shared, photographs are opt-in twice, and everything deletes itself after thirty days."
      sections={SECTIONS}
    />
  );
}
