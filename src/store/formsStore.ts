import { create } from 'zustand';
import { DEFAULT_COUNTRIES } from '../utils/forms';
import type { FormSubmission } from '../types/forms';

interface FormsState {
  countries: string[];
  submissions: FormSubmission[];
  addSubmission: (submission: FormSubmission) => void;
  clearSubmissions: () => void;
}

export const useFormsStore = create<FormsState>((set) => ({
  countries: [...DEFAULT_COUNTRIES],
  submissions: [],
  addSubmission: (submission) => set((state) => ({ submissions: [submission, ...state.submissions] })),
  clearSubmissions: () => set({ submissions: [] }),
}));
