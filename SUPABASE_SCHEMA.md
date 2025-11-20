# Supabase Database Schema

Este arquivo documenta o schema necessário para o banco de dados Supabase do NutriGPT.

**Nota Importante:** Este schema usa `gen_random_uuid()` da extensão pgcrypto.

**Arquitetura:** O app usa `user_id` (gerado no cliente via `crypto.randomUUID()`) como identificador principal. Os IDs auto-gerados do banco (`id`) são para uso interno do Supabase apenas e não são retornados pela API do app.

## Preparação

Primeiro, habilite a extensão pgcrypto:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Tabelas Necessárias

### 1. Tabela: `profiles`
Armazena os perfis dos usuários.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  height INTEGER NOT NULL,
  current_weight DECIMAL NOT NULL,
  target_weight DECIMAL NOT NULL,
  goal TEXT NOT NULL,
  activity_level TEXT NOT NULL,
  region TEXT NOT NULL,
  restrictions TEXT,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar por user_id
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
```

### 2. Tabela: `daily_plans`
Armazena os planos diários gerados pela IA.

```sql
CREATE TABLE daily_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  plan_date DATE NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir um plano por dia por usuário
  UNIQUE(user_id, plan_date)
);

-- Índices para performance
CREATE INDEX idx_daily_plans_user_id ON daily_plans(user_id);
CREATE INDEX idx_daily_plans_plan_date ON daily_plans(plan_date);
CREATE INDEX idx_daily_plans_user_date ON daily_plans(user_id, plan_date);
```

## Como Criar as Tabelas

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Cole e execute o SQL acima
5. Verifique que as tabelas foram criadas em **Table Editor**

## Configuração de RLS (Row Level Security)

Para segurança, você pode configurar políticas RLS:

```sql
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ler e escrever seus próprios dados
-- Nota: Como não há autenticação, vamos permitir acesso total por enquanto
CREATE POLICY "Allow all access" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all access" ON daily_plans FOR ALL USING (true);
```

**Importante:** Como o app não usa autenticação por enquanto, as políticas permitem acesso total. Para produção, implemente autenticação e ajuste as políticas.

## Estrutura dos Dados

### Dados no Banco (profiles table)
O banco armazena:
- `id` (UUID, auto-gerado) - uso interno do Supabase
- `user_id` (TEXT) - identificador único gerado no cliente
- Todos os campos do perfil (age, gender, height, etc.)
- `created_at`, `updated_at` (timestamps) - uso interno

### Dados Retornados pela API (getProfile)
O serviço retorna apenas os campos necessários para o app:
```typescript
UserProfile {
  age: number;
  gender: 'male' | 'female';
  height: number;
  currentWeight: number;
  targetWeight: number;
  goal: string;
  activityLevel: string;
  region: string;
  restrictions?: string;
  preferences?: string;
}
```

**Nota:** IDs do banco e timestamps são gerenciados internamente e não expostos pela API do app.

### Daily Plans (daily_plans table)
O banco armazena:
- `id` (UUID, auto-gerado) - uso interno
- `user_id` (TEXT) - identificador do usuário
- `plan_date` (DATE) - data do plano
- `plan_data` (JSONB) - objeto DailyPlan completo
- `created_at` (timestamp) - uso interno

O serviço retorna apenas o objeto `DailyPlan` do campo `plan_data`.

## Migração de localStorage para Supabase

O app está configurado para:
1. Salvar novos dados no Supabase
2. Manter localStorage como backup/cache local
3. Sincronizar dados entre localStorage e Supabase
