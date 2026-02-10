# Documentação do Projeto MBMobileClient

## 📱 Visão Geral

**MBMobileClient** é uma aplicação mobile multiplataforma desenvolvida com Expo e React Native, utilizando o sistema de roteamento baseado em arquivos (file-based routing) do Expo Router.

- **Versão:** 1.0.0
- **Plataformas:** iOS, Android e Web
- **Framework:** Expo SDK ~54.0.33
- **React:** 19.1.0
- **React Native:** 0.81.5

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
MBMobileClient/
├── app/                          # Rotas da aplicação (file-based routing)
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── _layout.tsx          # Layout do grupo auth
│   │   ├── index.tsx            # Tela de login
│   │   └── register.tsx         # Tela de registro
│   ├── (dashboard)/             # Grupo de rotas do dashboard
│   │   ├── (records)/           # Subgrupo de registros
│   │   │   ├── _layout.tsx     # Layout do grupo records
│   │   │   ├── add.tsx         # Adicionar registro
│   │   │   ├── edit.tsx        # Editar registro
│   │   │   └── index.tsx       # Listar registros
│   │   ├── _layout.tsx         # Layout do dashboard
│   │   └── index.tsx           # Tela principal do dashboard
│   ├── _layout.tsx              # Layout raiz da aplicação
│   └── index.tsx                # Splash screen inicial
├── assets/                       # Recursos estáticos
│   └── images/                  # Imagens e ícones
├── components/                   # Componentes reutilizáveis
│   └── haptic-tab.tsx           # Componente de tab com feedback háptico
├── constants/                    # Constantes da aplicação
│   └── theme.ts                 # Definições de cores e fontes
├── hooks/                        # Custom hooks
│   ├── use-color-scheme.ts      # Hook para esquema de cores
│   ├── use-color-scheme.web.ts  # Versão web do hook
│   └── use-theme-color.ts       # Hook para cores do tema
└── scripts/                      # Scripts utilitários
    └── reset-project.js         # Script para resetar o projeto
```

## 🎯 Funcionalidades Principais

### 1. Sistema de Autenticação

- **Rota:** `/(auth)`
- Tela de login (`index.tsx`)
- Tela de registro (`register.tsx`)
- Navegação protegida para o dashboard

### 2. Dashboard

- **Rota:** `/(dashboard)`
- Tela principal do dashboard
- Sistema de gerenciamento de registros

### 3. Gerenciamento de Registros

- **Rota:** `/(dashboard)/(records)`
- Listar registros
- Adicionar novos registros
- Editar registros existentes

### 4. Splash Screen

- Tela de carregamento inicial com redirecionamento automático após 2 segundos

## 🔧 Configuração Técnica

### Expo Configuration (app.json)

```json
{
  "name": "MBMobileClient",
  "slug": "MBMobileClient",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "mbmobileclient",
  "newArchEnabled": true
}
```

#### Recursos Habilitados:

- ✅ Nova arquitetura do React Native
- ✅ Typed Routes (rotas tipadas)
- ✅ React Compiler experimental
- ✅ Edge-to-edge no Android
- ✅ Suporte a tablets iOS
- ✅ Splash screen customizada
- ✅ Ícones adaptativos para Android

### Dependências Principais

#### Core

- `expo`: ~54.0.33
- `react`: 19.1.0
- `react-native`: 0.81.5
- `expo-router`: ~6.0.23

#### Navegação

- `@react-navigation/native`: ^7.1.8
- `@react-navigation/bottom-tabs`: ^7.4.0
- `react-native-screens`: ~4.16.0
- `react-native-safe-area-context`: ~5.6.0

#### UI/UX

- `@expo/vector-icons`: ^15.0.3
- `expo-haptics`: ~15.0.8
- `react-native-reanimated`: ~4.1.1
- `react-native-gesture-handler`: ~2.28.0

#### Utilitários

- `expo-constants`: ~18.0.13
- `expo-linking`: ~8.0.11
- `expo-status-bar`: ~3.0.9
- `expo-system-ui`: ~6.0.9

## 🎨 Sistema de Temas

### Cores

O projeto utiliza um sistema de cores para modo claro e escuro:

**Modo Claro:**

- Texto: `#11181C`
- Background: `#fff`
- Tint: `#0a7ea4`
- Ícones: `#687076`

**Modo Escuro:**

- Texto: `#ECEDEE`
- Background: `#151718`
- Tint: `#fff`
- Ícones: `#9BA1A6`

### Fontes

Sistema de fontes adaptativo por plataforma:

- **iOS:** system-ui, ui-serif, ui-rounded, ui-monospace
- **Android:** normal, serif, monospace
- **Web:** system-ui, Georgia, SF Pro Rounded, SFMono-Regular

## 🚀 Scripts Disponíveis

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na Web
npm run web

# Lint do código
npm run lint

# Resetar o projeto
npm run reset-project
```

## 📐 Padrões de Roteamento

### Grupos de Rotas

O projeto utiliza grupos de rotas (indicados por parênteses) para organizar a navegação:

- `(auth)` - Rotas de autenticação (não aparecem na URL)
- `(dashboard)` - Rotas do dashboard principal
- `(records)` - Subgrupo para gerenciamento de registros

### Layouts Aninhados

Cada grupo possui seu próprio `_layout.tsx` para controlar:

- Navegação específica do grupo
- Headers customizados
- Configurações de tela

## 🔐 Fluxo de Navegação

```
index.tsx (Splash)
    ↓ (2 segundos)
(auth)/index.tsx (Login)
    ↓ (autenticação)
(dashboard)/index.tsx (Home)
    ↓
(dashboard)/(records)/index.tsx (Registros)
    ├── add.tsx (Adicionar)
    └── edit.tsx (Editar)
```

## 🛠️ Configuração TypeScript

- **Strict mode:** Habilitado
- **Path alias:** `@/*` aponta para a raiz do projeto
- **Typed routes:** Habilitado via Expo Router

## 📱 Suporte a Plataformas

### iOS

- Suporte a tablets
- Ícone adaptativo
- Splash screen customizada

### Android

- Ícones adaptativos (foreground, background, monochrome)
- Edge-to-edge habilitado
- Background color: `#E6F4FE`
- Predictive back gesture desabilitado

### Web

- Output estático
- Favicon customizado
- Fontes web otimizadas

## 🎯 Próximos Passos Sugeridos

1. Implementar autenticação real (Firebase, Auth0, etc.)
2. Adicionar gerenciamento de estado (Redux, Zustand, Context API)
3. Implementar API client (Axios, React Query)
4. Adicionar testes (Jest, React Native Testing Library)
5. Configurar CI/CD
6. Implementar analytics
7. Adicionar tratamento de erros global
8. Implementar sistema de notificações

## 📚 Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)

## 👥 Desenvolvimento

Para contribuir com o projeto:

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm start`
4. Siga os padrões de código estabelecidos
5. Execute o lint antes de commitar: `npm run lint`

---

**Última atualização:** 2024
**Versão da documentação:** 1.0.0
