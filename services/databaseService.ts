import { supabase } from './supabaseClient';
import { UserProfile, DailyPlan } from '../types';

export const databaseService = {
  async saveProfile(userId: string, profile: UserProfile): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          current_weight: profile.currentWeight,
          target_weight: profile.targetWeight,
          goal: profile.goal,
          activity_level: profile.activityLevel,
          region: profile.region,
          restrictions: profile.restrictions || null,
          preferences: profile.preferences || null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        const errorMsg = `Erro ao salvar perfil no Supabase: ${error.message}`;
        console.error(errorMsg, error);
        return { success: false, error: errorMsg };
      }

      console.log('Perfil salvo no Supabase com sucesso', data);
      return { success: true };
    } catch (error) {
      const errorMsg = `Exceção ao salvar perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      console.error(errorMsg, error);
      return { success: false, error: errorMsg };
    }
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erro ao buscar perfil do Supabase:', error);
        return null;
      }

      if (!data) return null;

      const profile: UserProfile = {
        age: data.age,
        gender: data.gender,
        height: data.height,
        currentWeight: data.current_weight,
        targetWeight: data.target_weight,
        goal: data.goal,
        activityLevel: data.activity_level,
        region: data.region,
        restrictions: data.restrictions,
        preferences: data.preferences
      };

      return profile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  },

  async saveDailyPlan(userId: string, date: string, plan: DailyPlan): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('daily_plans')
        .upsert({
          user_id: userId,
          plan_date: date,
          plan_data: plan
        }, {
          onConflict: 'user_id,plan_date'
        })
        .select();

      if (error) {
        const errorMsg = `Erro ao salvar plano no Supabase: ${error.message}`;
        console.error(errorMsg, error);
        return { success: false, error: errorMsg };
      }

      console.log('Plano salvo no Supabase com sucesso', data);
      return { success: true };
    } catch (error) {
      const errorMsg = `Exceção ao salvar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      console.error(errorMsg, error);
      return { success: false, error: errorMsg };
    }
  },

  async getDailyPlan(userId: string, date: string): Promise<DailyPlan | null> {
    try {
      const { data, error } = await supabase
        .from('daily_plans')
        .select('plan_data')
        .eq('user_id', userId)
        .eq('plan_date', date)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Erro ao buscar plano do Supabase:', error);
        return null;
      }

      return data?.plan_data || null;
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      return null;
    }
  },

  async getAllPlans(userId: string, limit: number = 30): Promise<Array<{ date: string; plan: DailyPlan }>> {
    try {
      const { data, error } = await supabase
        .from('daily_plans')
        .select('plan_date, plan_data')
        .eq('user_id', userId)
        .order('plan_date', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar planos do Supabase:', error);
        return [];
      }

      return (data || []).map(item => ({
        date: item.plan_date,
        plan: item.plan_data
      }));
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      return [];
    }
  }
};

export function generateUserId(): string {
  const existingId = localStorage.getItem('nutrigpt_user_id');
  if (existingId) return existingId;

  const newId = crypto.randomUUID();
  localStorage.setItem('nutrigpt_user_id', newId);
  return newId;
}
