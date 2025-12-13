import React, { useState } from 'react';
import type { UserInput } from '../types';
import { SparklesIcon } from './Icons';
import { translations } from '../translations';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  t: (key: keyof typeof translations.en) => string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, t }) => {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [marketTrends, setMarketTrends] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests.trim() && !skills.trim() && !marketTrends.trim()) {
        alert(t('formEmptyAlert'));
        return;
    }
    onSubmit({ interests, skills, marketTrends });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="interests" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('interestsLabel')}
        </label>
        <textarea
          id="interests"
          rows={2}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder={t('interestsPlaceholder')}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition resize-none"
        />
      </div>
      <div>
        <label htmlFor="skills" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('skillsLabel')}
        </label>
        <textarea
          id="skills"
          rows={2}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder={t('skillsPlaceholder')}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition resize-none"
        />
      </div>
       <div>
        <label htmlFor="marketTrends" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('marketTrendsLabel')}
        </label>
        <textarea
          id="marketTrends"
          rows={2}
          value={marketTrends}
          onChange={(e) => setMarketTrends(e.target.value)}
          placeholder={t('marketTrendsPlaceholder')}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition resize-none"
        />
      </div>
      <div className="pt-2">
        <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-900 font-bold py-3.5 px-4 rounded-full transition-all duration-200 transform active:scale-95 disabled:scale-100 shadow-md"
        >
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('generatingButton')}
            </>
            ) : (
            <>
                <SparklesIcon className="h-5 w-5" />
                {t('generateButton')}
            </>
            )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;