import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import MindMapView from '../components/MindMapView';
import type { MindMapData, TaskMindMap, UserInput } from '../types';
import {
  LogoIcon, SparklesIcon, SunIcon, MoonIcon, PlusIcon,
  SettingsIcon, TrashIcon, EditIcon, PaletteIcon, FileTextIcon,
  HistoryIcon, XIcon,
  ClockIcon,
  LinkIcon,
  TaskListIcon
} from '../components/Icons';
import { translations } from '../translations';
import clsx from 'clsx';
import { generateBusinessMindMap, generateTaskMindMap } from '@/services/geminiService';

type SelectedNodeType = {
  type: 'central' | 'problem' | 'idea';
  title: string;
  description?: string;
  id: string;
  actionItems?: TaskMindMap;
} | null;


// const CategoryBadge: React.FC<{ category: ActionItem }> = ({ category }) => {
//     const styles = {
//         RESEARCH: 'bg-blue-50 text-blue-600 border-blue-100',
//         OUTREACH: 'bg-purple-50 text-purple-600 border-purple-100',
//         FINANCE: 'bg-green-50 text-green-600 border-green-100',
//         DEVELOPMENT: 'bg-amber-50 text-amber-600 border-amber-100',
//         MARKETING: 'bg-rose-50 text-rose-600 border-rose-100',
//     };

//     return (
//         <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${styles[category.phase]}`}>
//             {category.phase}
//         </span>
//     );
// };

const MindMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [taskMindMapData, setTaskMindMapData] = useState<TaskMindMap[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isModalOpen, setIsModalOpen] = useState(true); // Start with modal open
  
  const [selectedNode, setSelectedNode] = useState<SelectedNodeType>(null);

  const t = (key: keyof typeof translations.en) => translations[language][key] || key;

  const handleGenerate = async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setMindMapData(null);
    setIsModalOpen(false);

    try {
      const data = await generateBusinessMindMap(userInput, language);
      setMindMapData(data);
      setIsLoading(false);
      const taskPromises = data.problems.map((problem) => problem.businessIdeas.map(async (idea) => {
        return await generateTaskMindMap(userInput.skills, idea.title, language, idea.id);
      }));
      const taskResults = await Promise.all(taskPromises.flat());
      console.log(taskResults);
      
      setTaskMindMapData(taskResults);

    } catch (err) {
      console.error(err);
      // setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (type: 'central' | 'problem' | 'idea', title: string, id: string, description?: string,) => {

    if (id === null) {
      return;
    }
    
    setSelectedNode({ type, title, id, description, actionItems: taskMindMapData?.find(task => task.projectId === id)});
  };

  const ThemeSwitcher = () => (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
      aria-label={theme === 'dark' ? t('toggleThemeLight') : t('toggleThemeDark')}
    >
      {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );

  const LanguageSwitcher = () => (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition ${language === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition ${language === 'vi' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
      >
        VI
      </button>
    </div>
  );

  return (
    <div className={clsx(`relative w-screen h-screen overflow-hidden bg-white ${theme == 'dark' && `dark:bg-slate-900`}  text-slate-900 dark:text-slate-100 font-sans selection:bg-yellow-200 dark:selection:bg-cyan-900`)}>
      {/* Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 "
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <header className={clsx(`absolute top-0 left-0 right-0 z-20 h-16 bg-white/80 ${theme == 'dark' && `dark:bg-slate-900/80`} backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6`)}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="bg-yellow-400 rounded-full p-1.5 text-black">
              <LogoIcon className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-yellow-400">{t('headerTitle')}</h1>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-5 rounded-full text-sm transition shadow-sm">
            {t('saveProject')}
          </button> */}
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar" className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="absolute inset-0 pt-16 pb-20 z-10 overflow-hidden flex">

        {/* Mind Map View (Left/Center) */}
        <div className="flex-1 relative h-full w-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center  backdrop-blur-sm z-50">
              <SparklesIcon className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
              <h2 className="text-lg font-semibold">{t('generatingButton')}</h2>
            </div>
          )}

          {!isLoading && !mindMapData && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-60">
              <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center max-w-md text-center">
                <SparklesIcon className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('awaitingInputTitle')}</h3>
                <p className="text-slate-500">{t('awaitingInputDescription')}</p>
              </div>
            </div>
          )}

          {mindMapData && <MindMapView data={mindMapData} t={t} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />}
        </div>

        {/* Right Properties Panel (Floating) */}
        <aside className={` z-10 absolute w-[700px] right-6 top-24 bottom-24 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col transition-transform duration-300 ${selectedNode ? 'translate-x-0' : 'translate-x-[120%]'}`}>
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{t('nodeProperties')}</h3>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-0.5 truncate max-w-[200px]">
                {t('selected')}: {selectedNode?.title}
              </p>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            {/* <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition text-left">
              <EditIcon className="h-4 w-4 text-slate-500" /> {t('editNodeText')}
            </button> */}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition text-left">
              <FileTextIcon className="h-4 w-4 text-slate-500" /> {t('taskList')}
            </button>

            {/* <div className="pt-4 pb-2 px-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">{t('contextImage')}</p>
              <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video relative group">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b43?auto=format&fit=crop&q=80&w=400" 
                  alt="Context" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
                  <button className="bg-white/90 p-2 rounded-full shadow-sm"><EditIcon className="h-4 w-4 text-slate-700"/></button>
                </div>
              </div>
            </div> */}

            {selectedNode?.description && (
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedNode.description}</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
              {selectedNode?.actionItems?.development_phases?.length > 0 && selectedNode.actionItems.development_phases.map((action, index) => (
                <div className="group relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      {action.phase}
                    </h3>
                    {/* <CategoryBadge category={action.phase} /> */}
                  </div>

                  {
                    action.tasks.map((taskItem, taskIndex) => (<p className="flex items-center text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {/* {action.description} */}
                      <TaskListIcon />
                      <span className="text-xs text-slate-400 ml-2">{taskItem.task}</span>
                      <span className="text-xs text-slate-400 ml-2">({taskItem.duration})</span>
                    </p>))
                  }

                  <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <ClockIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">{action.duration}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
                            <LinkIcon className="h-4 w-4" />
                            <span className="text-xs font-medium">{action.resource}</span>
                        </div> */}
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl">
            <button className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-full text-sm shadow-sm transition flex items-center justify-center gap-2">
              <PlusIcon className="h-4 w-4" /> {t('saveProject')}
            </button>
          </div>
        </aside>
      </main>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition flex items-center gap-2"
        >
          <SparklesIcon className="h-5 w-5" />
          {t('generateSuggestions')}
        </button>
      </div>

      {/* Input Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
              <div>
                <h2 className="text-xl font-bold  text-yellow-400">{t('headerTitle')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('headerDescription')}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <InputForm onSubmit={handleGenerate} isLoading={isLoading} t={t} />
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded-lg border border-red-100 dark:border-red-900/30">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMapPage;