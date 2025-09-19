import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reward: number;
  completed: boolean;
  duration: string;
}

export interface CompletedModule {
  id: string;
  user_id: string;
  module_id: string;
  module_title: string;
  coins_earned: number;
  completed_at: string;
}

const defaultModules: LearningModule[] = [
  {
    id: "1",
    title: "What is a Stock?",
    description: "Learn the basics of what stocks are and how they work",
    difficulty: "Beginner",
    reward: 50,
    completed: false,
    duration: "5 min"
  },
  {
    id: "2", 
    title: "How to Read Stock Prices",
    description: "Understand stock prices and what the numbers mean",
    difficulty: "Beginner",
    reward: 75,
    completed: false,
    duration: "8 min"
  },
  {
    id: "3",
    title: "Risk and Reward",
    description: "Learn about investment risk and potential rewards",
    difficulty: "Intermediate",
    reward: 100,
    completed: false,
    duration: "12 min"
  },
  {
    id: "4",
    title: "Building a Portfolio",
    description: "How to diversify your investments across different stocks",
    difficulty: "Advanced",
    reward: 150,
    completed: false,
    duration: "15 min"
  }
];

export function useLearning() {
  const { user } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>(defaultModules);
  const [completedModules, setCompletedModules] = useState<CompletedModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCompletedModules();
    } else {
      setModules(defaultModules);
      setCompletedModules([]);
      setLoading(false);
    }
  }, [user]);

  const fetchCompletedModules = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching learning progress:', error);
      } else {
        setCompletedModules(data || []);
        
        // Update modules with completion status
        const updatedModules = defaultModules.map(module => ({
          ...module,
          completed: data?.some(completed => completed.module_id === module.id) || false
        }));
        setModules(updatedModules);
      }
    } catch (error) {
      console.error('Error fetching learning progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeModule = async (moduleId: string) => {
    if (!user) return false;

    const module = modules.find(m => m.id === moduleId);
    if (!module || module.completed) return false;

    try {
      const { error } = await supabase
        .from('learning_progress')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          module_title: module.title,
          coins_earned: module.reward,
        });

      if (error) {
        console.error('Error completing module:', error);
        return false;
      }

      await fetchCompletedModules();
      return true;
    } catch (error) {
      console.error('Error completing module:', error);
      return false;
    }
  };

  return {
    modules,
    completedModules,
    loading,
    completeModule,
    fetchCompletedModules,
  };
}