/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PricingImport } from './routes/pricing'
import { Route as R505Import } from './routes/505'
import { Route as R422Import } from './routes/422'
import { Route as R403Import } from './routes/403'
import { Route as R401Import } from './routes/401'
import { Route as DashboardRouteImport } from './routes/dashboard/route'
import { Route as IndexImport } from './routes/index'
import { Route as DashboardIndexImport } from './routes/dashboard/index'
import { Route as DashboardSettingsImport } from './routes/dashboard/settings'
import { Route as DashboardHistoryImport } from './routes/dashboard/history'
import { Route as DashboardAnalyticsImport } from './routes/dashboard/analytics'
import { Route as Dashboard505Import } from './routes/dashboard/505'
import { Route as Dashboard404Import } from './routes/dashboard/404'
import { Route as AgentsAgentIdImport } from './routes/agents.$agentId'
import { Route as authSignInImport } from './routes/(auth)/sign-in'
import { Route as authRegisterImport } from './routes/(auth)/register'
import { Route as DashboardProjectSettingsRouteImport } from './routes/dashboard/project-settings/route'
import { Route as DashboardClientsRouteImport } from './routes/dashboard/clients/route'
import { Route as DashboardAgentsRouteImport } from './routes/dashboard/agents/route'
import { Route as DashboardProjectSettingsIndexImport } from './routes/dashboard/project-settings/index'
import { Route as DashboardPhoneIndexImport } from './routes/dashboard/phone/index'
import { Route as DashboardClientsIndexImport } from './routes/dashboard/clients/index'
import { Route as DashboardAgentsIndexImport } from './routes/dashboard/agents/index'
import { Route as DashboardProjectSettingsVoiceImport } from './routes/dashboard/project-settings/voice'
import { Route as DashboardProjectSettingsPreviewImport } from './routes/dashboard/project-settings/preview'
import { Route as DashboardProjectSettingsAgentImport } from './routes/dashboard/project-settings/agent'
import { Route as DashboardPhoneIdImport } from './routes/dashboard/phone/$id'
import { Route as DashboardAgents505Import } from './routes/dashboard/agents/505'
import { Route as DashboardAgents404Import } from './routes/dashboard/agents/404'
import { Route as DashboardAgentsAgentRouteImport } from './routes/dashboard/agents/$agent/route'
import { Route as DashboardAgentsAgentIndexImport } from './routes/dashboard/agents/$agent/index'
import { Route as DashboardAgentsAgentVoiceImport } from './routes/dashboard/agents/$agent/voice'
import { Route as DashboardAgentsAgentPreviewImport } from './routes/dashboard/agents/$agent/preview'
import { Route as DashboardAgentsAgentAgentImport } from './routes/dashboard/agents/$agent/agent'

// Create/Update Routes

const PricingRoute = PricingImport.update({
  id: '/pricing',
  path: '/pricing',
  getParentRoute: () => rootRoute,
} as any)

const R505Route = R505Import.update({
  id: '/505',
  path: '/505',
  getParentRoute: () => rootRoute,
} as any)

const R422Route = R422Import.update({
  id: '/422',
  path: '/422',
  getParentRoute: () => rootRoute,
} as any)

const R403Route = R403Import.update({
  id: '/403',
  path: '/403',
  getParentRoute: () => rootRoute,
} as any)

const R401Route = R401Import.update({
  id: '/401',
  path: '/401',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRouteRoute = DashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardSettingsRoute = DashboardSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardHistoryRoute = DashboardHistoryImport.update({
  id: '/history',
  path: '/history',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardAnalyticsRoute = DashboardAnalyticsImport.update({
  id: '/analytics',
  path: '/analytics',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const Dashboard505Route = Dashboard505Import.update({
  id: '/505',
  path: '/505',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const Dashboard404Route = Dashboard404Import.update({
  id: '/404',
  path: '/404',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const AgentsAgentIdRoute = AgentsAgentIdImport.update({
  id: '/agents/$agentId',
  path: '/agents/$agentId',
  getParentRoute: () => rootRoute,
} as any)

const authSignInRoute = authSignInImport.update({
  id: '/(auth)/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const authRegisterRoute = authRegisterImport.update({
  id: '/(auth)/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const DashboardProjectSettingsRouteRoute =
  DashboardProjectSettingsRouteImport.update({
    id: '/project-settings',
    path: '/project-settings',
    getParentRoute: () => DashboardRouteRoute,
  } as any)

const DashboardClientsRouteRoute = DashboardClientsRouteImport.update({
  id: '/clients',
  path: '/clients',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardAgentsRouteRoute = DashboardAgentsRouteImport.update({
  id: '/agents',
  path: '/agents',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardProjectSettingsIndexRoute =
  DashboardProjectSettingsIndexImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => DashboardProjectSettingsRouteRoute,
  } as any)

const DashboardPhoneIndexRoute = DashboardPhoneIndexImport.update({
  id: '/phone/',
  path: '/phone/',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardClientsIndexRoute = DashboardClientsIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardClientsRouteRoute,
} as any)

const DashboardAgentsIndexRoute = DashboardAgentsIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardAgentsRouteRoute,
} as any)

const DashboardProjectSettingsVoiceRoute =
  DashboardProjectSettingsVoiceImport.update({
    id: '/voice',
    path: '/voice',
    getParentRoute: () => DashboardProjectSettingsRouteRoute,
  } as any)

const DashboardProjectSettingsPreviewRoute =
  DashboardProjectSettingsPreviewImport.update({
    id: '/preview',
    path: '/preview',
    getParentRoute: () => DashboardProjectSettingsRouteRoute,
  } as any)

const DashboardProjectSettingsAgentRoute =
  DashboardProjectSettingsAgentImport.update({
    id: '/agent',
    path: '/agent',
    getParentRoute: () => DashboardProjectSettingsRouteRoute,
  } as any)

const DashboardPhoneIdRoute = DashboardPhoneIdImport.update({
  id: '/phone/$id',
  path: '/phone/$id',
  getParentRoute: () => DashboardRouteRoute,
} as any)

const DashboardAgents505Route = DashboardAgents505Import.update({
  id: '/505',
  path: '/505',
  getParentRoute: () => DashboardAgentsRouteRoute,
} as any)

const DashboardAgents404Route = DashboardAgents404Import.update({
  id: '/404',
  path: '/404',
  getParentRoute: () => DashboardAgentsRouteRoute,
} as any)

const DashboardAgentsAgentRouteRoute = DashboardAgentsAgentRouteImport.update({
  id: '/$agent',
  path: '/$agent',
  getParentRoute: () => DashboardAgentsRouteRoute,
} as any)

const DashboardAgentsAgentIndexRoute = DashboardAgentsAgentIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => DashboardAgentsAgentRouteRoute,
} as any)

const DashboardAgentsAgentVoiceRoute = DashboardAgentsAgentVoiceImport.update({
  id: '/voice',
  path: '/voice',
  getParentRoute: () => DashboardAgentsAgentRouteRoute,
} as any)

const DashboardAgentsAgentPreviewRoute =
  DashboardAgentsAgentPreviewImport.update({
    id: '/preview',
    path: '/preview',
    getParentRoute: () => DashboardAgentsAgentRouteRoute,
  } as any)

const DashboardAgentsAgentAgentRoute = DashboardAgentsAgentAgentImport.update({
  id: '/agent',
  path: '/agent',
  getParentRoute: () => DashboardAgentsAgentRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardRouteImport
      parentRoute: typeof rootRoute
    }
    '/401': {
      id: '/401'
      path: '/401'
      fullPath: '/401'
      preLoaderRoute: typeof R401Import
      parentRoute: typeof rootRoute
    }
    '/403': {
      id: '/403'
      path: '/403'
      fullPath: '/403'
      preLoaderRoute: typeof R403Import
      parentRoute: typeof rootRoute
    }
    '/422': {
      id: '/422'
      path: '/422'
      fullPath: '/422'
      preLoaderRoute: typeof R422Import
      parentRoute: typeof rootRoute
    }
    '/505': {
      id: '/505'
      path: '/505'
      fullPath: '/505'
      preLoaderRoute: typeof R505Import
      parentRoute: typeof rootRoute
    }
    '/pricing': {
      id: '/pricing'
      path: '/pricing'
      fullPath: '/pricing'
      preLoaderRoute: typeof PricingImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/agents': {
      id: '/dashboard/agents'
      path: '/agents'
      fullPath: '/dashboard/agents'
      preLoaderRoute: typeof DashboardAgentsRouteImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/clients': {
      id: '/dashboard/clients'
      path: '/clients'
      fullPath: '/dashboard/clients'
      preLoaderRoute: typeof DashboardClientsRouteImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/project-settings': {
      id: '/dashboard/project-settings'
      path: '/project-settings'
      fullPath: '/dashboard/project-settings'
      preLoaderRoute: typeof DashboardProjectSettingsRouteImport
      parentRoute: typeof DashboardRouteImport
    }
    '/(auth)/register': {
      id: '/(auth)/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof authRegisterImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/sign-in': {
      id: '/(auth)/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof authSignInImport
      parentRoute: typeof rootRoute
    }
    '/agents/$agentId': {
      id: '/agents/$agentId'
      path: '/agents/$agentId'
      fullPath: '/agents/$agentId'
      preLoaderRoute: typeof AgentsAgentIdImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/404': {
      id: '/dashboard/404'
      path: '/404'
      fullPath: '/dashboard/404'
      preLoaderRoute: typeof Dashboard404Import
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/505': {
      id: '/dashboard/505'
      path: '/505'
      fullPath: '/dashboard/505'
      preLoaderRoute: typeof Dashboard505Import
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/analytics': {
      id: '/dashboard/analytics'
      path: '/analytics'
      fullPath: '/dashboard/analytics'
      preLoaderRoute: typeof DashboardAnalyticsImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/history': {
      id: '/dashboard/history'
      path: '/history'
      fullPath: '/dashboard/history'
      preLoaderRoute: typeof DashboardHistoryImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/settings': {
      id: '/dashboard/settings'
      path: '/settings'
      fullPath: '/dashboard/settings'
      preLoaderRoute: typeof DashboardSettingsImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/': {
      id: '/dashboard/'
      path: '/'
      fullPath: '/dashboard/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/agents/$agent': {
      id: '/dashboard/agents/$agent'
      path: '/$agent'
      fullPath: '/dashboard/agents/$agent'
      preLoaderRoute: typeof DashboardAgentsAgentRouteImport
      parentRoute: typeof DashboardAgentsRouteImport
    }
    '/dashboard/agents/404': {
      id: '/dashboard/agents/404'
      path: '/404'
      fullPath: '/dashboard/agents/404'
      preLoaderRoute: typeof DashboardAgents404Import
      parentRoute: typeof DashboardAgentsRouteImport
    }
    '/dashboard/agents/505': {
      id: '/dashboard/agents/505'
      path: '/505'
      fullPath: '/dashboard/agents/505'
      preLoaderRoute: typeof DashboardAgents505Import
      parentRoute: typeof DashboardAgentsRouteImport
    }
    '/dashboard/phone/$id': {
      id: '/dashboard/phone/$id'
      path: '/phone/$id'
      fullPath: '/dashboard/phone/$id'
      preLoaderRoute: typeof DashboardPhoneIdImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/project-settings/agent': {
      id: '/dashboard/project-settings/agent'
      path: '/agent'
      fullPath: '/dashboard/project-settings/agent'
      preLoaderRoute: typeof DashboardProjectSettingsAgentImport
      parentRoute: typeof DashboardProjectSettingsRouteImport
    }
    '/dashboard/project-settings/preview': {
      id: '/dashboard/project-settings/preview'
      path: '/preview'
      fullPath: '/dashboard/project-settings/preview'
      preLoaderRoute: typeof DashboardProjectSettingsPreviewImport
      parentRoute: typeof DashboardProjectSettingsRouteImport
    }
    '/dashboard/project-settings/voice': {
      id: '/dashboard/project-settings/voice'
      path: '/voice'
      fullPath: '/dashboard/project-settings/voice'
      preLoaderRoute: typeof DashboardProjectSettingsVoiceImport
      parentRoute: typeof DashboardProjectSettingsRouteImport
    }
    '/dashboard/agents/': {
      id: '/dashboard/agents/'
      path: '/'
      fullPath: '/dashboard/agents/'
      preLoaderRoute: typeof DashboardAgentsIndexImport
      parentRoute: typeof DashboardAgentsRouteImport
    }
    '/dashboard/clients/': {
      id: '/dashboard/clients/'
      path: '/'
      fullPath: '/dashboard/clients/'
      preLoaderRoute: typeof DashboardClientsIndexImport
      parentRoute: typeof DashboardClientsRouteImport
    }
    '/dashboard/phone/': {
      id: '/dashboard/phone/'
      path: '/phone'
      fullPath: '/dashboard/phone'
      preLoaderRoute: typeof DashboardPhoneIndexImport
      parentRoute: typeof DashboardRouteImport
    }
    '/dashboard/project-settings/': {
      id: '/dashboard/project-settings/'
      path: '/'
      fullPath: '/dashboard/project-settings/'
      preLoaderRoute: typeof DashboardProjectSettingsIndexImport
      parentRoute: typeof DashboardProjectSettingsRouteImport
    }
    '/dashboard/agents/$agent/agent': {
      id: '/dashboard/agents/$agent/agent'
      path: '/agent'
      fullPath: '/dashboard/agents/$agent/agent'
      preLoaderRoute: typeof DashboardAgentsAgentAgentImport
      parentRoute: typeof DashboardAgentsAgentRouteImport
    }
    '/dashboard/agents/$agent/preview': {
      id: '/dashboard/agents/$agent/preview'
      path: '/preview'
      fullPath: '/dashboard/agents/$agent/preview'
      preLoaderRoute: typeof DashboardAgentsAgentPreviewImport
      parentRoute: typeof DashboardAgentsAgentRouteImport
    }
    '/dashboard/agents/$agent/voice': {
      id: '/dashboard/agents/$agent/voice'
      path: '/voice'
      fullPath: '/dashboard/agents/$agent/voice'
      preLoaderRoute: typeof DashboardAgentsAgentVoiceImport
      parentRoute: typeof DashboardAgentsAgentRouteImport
    }
    '/dashboard/agents/$agent/': {
      id: '/dashboard/agents/$agent/'
      path: '/'
      fullPath: '/dashboard/agents/$agent/'
      preLoaderRoute: typeof DashboardAgentsAgentIndexImport
      parentRoute: typeof DashboardAgentsAgentRouteImport
    }
  }
}

// Create and export the route tree

interface DashboardAgentsAgentRouteRouteChildren {
  DashboardAgentsAgentAgentRoute: typeof DashboardAgentsAgentAgentRoute
  DashboardAgentsAgentPreviewRoute: typeof DashboardAgentsAgentPreviewRoute
  DashboardAgentsAgentVoiceRoute: typeof DashboardAgentsAgentVoiceRoute
  DashboardAgentsAgentIndexRoute: typeof DashboardAgentsAgentIndexRoute
}

const DashboardAgentsAgentRouteRouteChildren: DashboardAgentsAgentRouteRouteChildren =
  {
    DashboardAgentsAgentAgentRoute: DashboardAgentsAgentAgentRoute,
    DashboardAgentsAgentPreviewRoute: DashboardAgentsAgentPreviewRoute,
    DashboardAgentsAgentVoiceRoute: DashboardAgentsAgentVoiceRoute,
    DashboardAgentsAgentIndexRoute: DashboardAgentsAgentIndexRoute,
  }

const DashboardAgentsAgentRouteRouteWithChildren =
  DashboardAgentsAgentRouteRoute._addFileChildren(
    DashboardAgentsAgentRouteRouteChildren,
  )

interface DashboardAgentsRouteRouteChildren {
  DashboardAgentsAgentRouteRoute: typeof DashboardAgentsAgentRouteRouteWithChildren
  DashboardAgents404Route: typeof DashboardAgents404Route
  DashboardAgents505Route: typeof DashboardAgents505Route
  DashboardAgentsIndexRoute: typeof DashboardAgentsIndexRoute
}

const DashboardAgentsRouteRouteChildren: DashboardAgentsRouteRouteChildren = {
  DashboardAgentsAgentRouteRoute: DashboardAgentsAgentRouteRouteWithChildren,
  DashboardAgents404Route: DashboardAgents404Route,
  DashboardAgents505Route: DashboardAgents505Route,
  DashboardAgentsIndexRoute: DashboardAgentsIndexRoute,
}

const DashboardAgentsRouteRouteWithChildren =
  DashboardAgentsRouteRoute._addFileChildren(DashboardAgentsRouteRouteChildren)

interface DashboardClientsRouteRouteChildren {
  DashboardClientsIndexRoute: typeof DashboardClientsIndexRoute
}

const DashboardClientsRouteRouteChildren: DashboardClientsRouteRouteChildren = {
  DashboardClientsIndexRoute: DashboardClientsIndexRoute,
}

const DashboardClientsRouteRouteWithChildren =
  DashboardClientsRouteRoute._addFileChildren(
    DashboardClientsRouteRouteChildren,
  )

interface DashboardProjectSettingsRouteRouteChildren {
  DashboardProjectSettingsAgentRoute: typeof DashboardProjectSettingsAgentRoute
  DashboardProjectSettingsPreviewRoute: typeof DashboardProjectSettingsPreviewRoute
  DashboardProjectSettingsVoiceRoute: typeof DashboardProjectSettingsVoiceRoute
  DashboardProjectSettingsIndexRoute: typeof DashboardProjectSettingsIndexRoute
}

const DashboardProjectSettingsRouteRouteChildren: DashboardProjectSettingsRouteRouteChildren =
  {
    DashboardProjectSettingsAgentRoute: DashboardProjectSettingsAgentRoute,
    DashboardProjectSettingsPreviewRoute: DashboardProjectSettingsPreviewRoute,
    DashboardProjectSettingsVoiceRoute: DashboardProjectSettingsVoiceRoute,
    DashboardProjectSettingsIndexRoute: DashboardProjectSettingsIndexRoute,
  }

const DashboardProjectSettingsRouteRouteWithChildren =
  DashboardProjectSettingsRouteRoute._addFileChildren(
    DashboardProjectSettingsRouteRouteChildren,
  )

interface DashboardRouteRouteChildren {
  DashboardAgentsRouteRoute: typeof DashboardAgentsRouteRouteWithChildren
  DashboardClientsRouteRoute: typeof DashboardClientsRouteRouteWithChildren
  DashboardProjectSettingsRouteRoute: typeof DashboardProjectSettingsRouteRouteWithChildren
  Dashboard404Route: typeof Dashboard404Route
  Dashboard505Route: typeof Dashboard505Route
  DashboardAnalyticsRoute: typeof DashboardAnalyticsRoute
  DashboardHistoryRoute: typeof DashboardHistoryRoute
  DashboardSettingsRoute: typeof DashboardSettingsRoute
  DashboardIndexRoute: typeof DashboardIndexRoute
  DashboardPhoneIdRoute: typeof DashboardPhoneIdRoute
  DashboardPhoneIndexRoute: typeof DashboardPhoneIndexRoute
}

const DashboardRouteRouteChildren: DashboardRouteRouteChildren = {
  DashboardAgentsRouteRoute: DashboardAgentsRouteRouteWithChildren,
  DashboardClientsRouteRoute: DashboardClientsRouteRouteWithChildren,
  DashboardProjectSettingsRouteRoute:
    DashboardProjectSettingsRouteRouteWithChildren,
  Dashboard404Route: Dashboard404Route,
  Dashboard505Route: Dashboard505Route,
  DashboardAnalyticsRoute: DashboardAnalyticsRoute,
  DashboardHistoryRoute: DashboardHistoryRoute,
  DashboardSettingsRoute: DashboardSettingsRoute,
  DashboardIndexRoute: DashboardIndexRoute,
  DashboardPhoneIdRoute: DashboardPhoneIdRoute,
  DashboardPhoneIndexRoute: DashboardPhoneIndexRoute,
}

const DashboardRouteRouteWithChildren = DashboardRouteRoute._addFileChildren(
  DashboardRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/401': typeof R401Route
  '/403': typeof R403Route
  '/422': typeof R422Route
  '/505': typeof R505Route
  '/pricing': typeof PricingRoute
  '/dashboard/agents': typeof DashboardAgentsRouteRouteWithChildren
  '/dashboard/clients': typeof DashboardClientsRouteRouteWithChildren
  '/dashboard/project-settings': typeof DashboardProjectSettingsRouteRouteWithChildren
  '/register': typeof authRegisterRoute
  '/sign-in': typeof authSignInRoute
  '/agents/$agentId': typeof AgentsAgentIdRoute
  '/dashboard/404': typeof Dashboard404Route
  '/dashboard/505': typeof Dashboard505Route
  '/dashboard/analytics': typeof DashboardAnalyticsRoute
  '/dashboard/history': typeof DashboardHistoryRoute
  '/dashboard/settings': typeof DashboardSettingsRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/agents/$agent': typeof DashboardAgentsAgentRouteRouteWithChildren
  '/dashboard/agents/404': typeof DashboardAgents404Route
  '/dashboard/agents/505': typeof DashboardAgents505Route
  '/dashboard/phone/$id': typeof DashboardPhoneIdRoute
  '/dashboard/project-settings/agent': typeof DashboardProjectSettingsAgentRoute
  '/dashboard/project-settings/preview': typeof DashboardProjectSettingsPreviewRoute
  '/dashboard/project-settings/voice': typeof DashboardProjectSettingsVoiceRoute
  '/dashboard/agents/': typeof DashboardAgentsIndexRoute
  '/dashboard/clients/': typeof DashboardClientsIndexRoute
  '/dashboard/phone': typeof DashboardPhoneIndexRoute
  '/dashboard/project-settings/': typeof DashboardProjectSettingsIndexRoute
  '/dashboard/agents/$agent/agent': typeof DashboardAgentsAgentAgentRoute
  '/dashboard/agents/$agent/preview': typeof DashboardAgentsAgentPreviewRoute
  '/dashboard/agents/$agent/voice': typeof DashboardAgentsAgentVoiceRoute
  '/dashboard/agents/$agent/': typeof DashboardAgentsAgentIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/401': typeof R401Route
  '/403': typeof R403Route
  '/422': typeof R422Route
  '/505': typeof R505Route
  '/pricing': typeof PricingRoute
  '/register': typeof authRegisterRoute
  '/sign-in': typeof authSignInRoute
  '/agents/$agentId': typeof AgentsAgentIdRoute
  '/dashboard/404': typeof Dashboard404Route
  '/dashboard/505': typeof Dashboard505Route
  '/dashboard/analytics': typeof DashboardAnalyticsRoute
  '/dashboard/history': typeof DashboardHistoryRoute
  '/dashboard/settings': typeof DashboardSettingsRoute
  '/dashboard': typeof DashboardIndexRoute
  '/dashboard/agents/404': typeof DashboardAgents404Route
  '/dashboard/agents/505': typeof DashboardAgents505Route
  '/dashboard/phone/$id': typeof DashboardPhoneIdRoute
  '/dashboard/project-settings/agent': typeof DashboardProjectSettingsAgentRoute
  '/dashboard/project-settings/preview': typeof DashboardProjectSettingsPreviewRoute
  '/dashboard/project-settings/voice': typeof DashboardProjectSettingsVoiceRoute
  '/dashboard/agents': typeof DashboardAgentsIndexRoute
  '/dashboard/clients': typeof DashboardClientsIndexRoute
  '/dashboard/phone': typeof DashboardPhoneIndexRoute
  '/dashboard/project-settings': typeof DashboardProjectSettingsIndexRoute
  '/dashboard/agents/$agent/agent': typeof DashboardAgentsAgentAgentRoute
  '/dashboard/agents/$agent/preview': typeof DashboardAgentsAgentPreviewRoute
  '/dashboard/agents/$agent/voice': typeof DashboardAgentsAgentVoiceRoute
  '/dashboard/agents/$agent': typeof DashboardAgentsAgentIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/dashboard': typeof DashboardRouteRouteWithChildren
  '/401': typeof R401Route
  '/403': typeof R403Route
  '/422': typeof R422Route
  '/505': typeof R505Route
  '/pricing': typeof PricingRoute
  '/dashboard/agents': typeof DashboardAgentsRouteRouteWithChildren
  '/dashboard/clients': typeof DashboardClientsRouteRouteWithChildren
  '/dashboard/project-settings': typeof DashboardProjectSettingsRouteRouteWithChildren
  '/(auth)/register': typeof authRegisterRoute
  '/(auth)/sign-in': typeof authSignInRoute
  '/agents/$agentId': typeof AgentsAgentIdRoute
  '/dashboard/404': typeof Dashboard404Route
  '/dashboard/505': typeof Dashboard505Route
  '/dashboard/analytics': typeof DashboardAnalyticsRoute
  '/dashboard/history': typeof DashboardHistoryRoute
  '/dashboard/settings': typeof DashboardSettingsRoute
  '/dashboard/': typeof DashboardIndexRoute
  '/dashboard/agents/$agent': typeof DashboardAgentsAgentRouteRouteWithChildren
  '/dashboard/agents/404': typeof DashboardAgents404Route
  '/dashboard/agents/505': typeof DashboardAgents505Route
  '/dashboard/phone/$id': typeof DashboardPhoneIdRoute
  '/dashboard/project-settings/agent': typeof DashboardProjectSettingsAgentRoute
  '/dashboard/project-settings/preview': typeof DashboardProjectSettingsPreviewRoute
  '/dashboard/project-settings/voice': typeof DashboardProjectSettingsVoiceRoute
  '/dashboard/agents/': typeof DashboardAgentsIndexRoute
  '/dashboard/clients/': typeof DashboardClientsIndexRoute
  '/dashboard/phone/': typeof DashboardPhoneIndexRoute
  '/dashboard/project-settings/': typeof DashboardProjectSettingsIndexRoute
  '/dashboard/agents/$agent/agent': typeof DashboardAgentsAgentAgentRoute
  '/dashboard/agents/$agent/preview': typeof DashboardAgentsAgentPreviewRoute
  '/dashboard/agents/$agent/voice': typeof DashboardAgentsAgentVoiceRoute
  '/dashboard/agents/$agent/': typeof DashboardAgentsAgentIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/dashboard'
    | '/401'
    | '/403'
    | '/422'
    | '/505'
    | '/pricing'
    | '/dashboard/agents'
    | '/dashboard/clients'
    | '/dashboard/project-settings'
    | '/register'
    | '/sign-in'
    | '/agents/$agentId'
    | '/dashboard/404'
    | '/dashboard/505'
    | '/dashboard/analytics'
    | '/dashboard/history'
    | '/dashboard/settings'
    | '/dashboard/'
    | '/dashboard/agents/$agent'
    | '/dashboard/agents/404'
    | '/dashboard/agents/505'
    | '/dashboard/phone/$id'
    | '/dashboard/project-settings/agent'
    | '/dashboard/project-settings/preview'
    | '/dashboard/project-settings/voice'
    | '/dashboard/agents/'
    | '/dashboard/clients/'
    | '/dashboard/phone'
    | '/dashboard/project-settings/'
    | '/dashboard/agents/$agent/agent'
    | '/dashboard/agents/$agent/preview'
    | '/dashboard/agents/$agent/voice'
    | '/dashboard/agents/$agent/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/401'
    | '/403'
    | '/422'
    | '/505'
    | '/pricing'
    | '/register'
    | '/sign-in'
    | '/agents/$agentId'
    | '/dashboard/404'
    | '/dashboard/505'
    | '/dashboard/analytics'
    | '/dashboard/history'
    | '/dashboard/settings'
    | '/dashboard'
    | '/dashboard/agents/404'
    | '/dashboard/agents/505'
    | '/dashboard/phone/$id'
    | '/dashboard/project-settings/agent'
    | '/dashboard/project-settings/preview'
    | '/dashboard/project-settings/voice'
    | '/dashboard/agents'
    | '/dashboard/clients'
    | '/dashboard/phone'
    | '/dashboard/project-settings'
    | '/dashboard/agents/$agent/agent'
    | '/dashboard/agents/$agent/preview'
    | '/dashboard/agents/$agent/voice'
    | '/dashboard/agents/$agent'
  id:
    | '__root__'
    | '/'
    | '/dashboard'
    | '/401'
    | '/403'
    | '/422'
    | '/505'
    | '/pricing'
    | '/dashboard/agents'
    | '/dashboard/clients'
    | '/dashboard/project-settings'
    | '/(auth)/register'
    | '/(auth)/sign-in'
    | '/agents/$agentId'
    | '/dashboard/404'
    | '/dashboard/505'
    | '/dashboard/analytics'
    | '/dashboard/history'
    | '/dashboard/settings'
    | '/dashboard/'
    | '/dashboard/agents/$agent'
    | '/dashboard/agents/404'
    | '/dashboard/agents/505'
    | '/dashboard/phone/$id'
    | '/dashboard/project-settings/agent'
    | '/dashboard/project-settings/preview'
    | '/dashboard/project-settings/voice'
    | '/dashboard/agents/'
    | '/dashboard/clients/'
    | '/dashboard/phone/'
    | '/dashboard/project-settings/'
    | '/dashboard/agents/$agent/agent'
    | '/dashboard/agents/$agent/preview'
    | '/dashboard/agents/$agent/voice'
    | '/dashboard/agents/$agent/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DashboardRouteRoute: typeof DashboardRouteRouteWithChildren
  R401Route: typeof R401Route
  R403Route: typeof R403Route
  R422Route: typeof R422Route
  R505Route: typeof R505Route
  PricingRoute: typeof PricingRoute
  authRegisterRoute: typeof authRegisterRoute
  authSignInRoute: typeof authSignInRoute
  AgentsAgentIdRoute: typeof AgentsAgentIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRouteRoute: DashboardRouteRouteWithChildren,
  R401Route: R401Route,
  R403Route: R403Route,
  R422Route: R422Route,
  R505Route: R505Route,
  PricingRoute: PricingRoute,
  authRegisterRoute: authRegisterRoute,
  authSignInRoute: authSignInRoute,
  AgentsAgentIdRoute: AgentsAgentIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/dashboard",
        "/401",
        "/403",
        "/422",
        "/505",
        "/pricing",
        "/(auth)/register",
        "/(auth)/sign-in",
        "/agents/$agentId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard/route.tsx",
      "children": [
        "/dashboard/agents",
        "/dashboard/clients",
        "/dashboard/project-settings",
        "/dashboard/404",
        "/dashboard/505",
        "/dashboard/analytics",
        "/dashboard/history",
        "/dashboard/settings",
        "/dashboard/",
        "/dashboard/phone/$id",
        "/dashboard/phone/"
      ]
    },
    "/401": {
      "filePath": "401.tsx"
    },
    "/403": {
      "filePath": "403.tsx"
    },
    "/422": {
      "filePath": "422.tsx"
    },
    "/505": {
      "filePath": "505.tsx"
    },
    "/pricing": {
      "filePath": "pricing.tsx"
    },
    "/dashboard/agents": {
      "filePath": "dashboard/agents/route.tsx",
      "parent": "/dashboard",
      "children": [
        "/dashboard/agents/$agent",
        "/dashboard/agents/404",
        "/dashboard/agents/505",
        "/dashboard/agents/"
      ]
    },
    "/dashboard/clients": {
      "filePath": "dashboard/clients/route.tsx",
      "parent": "/dashboard",
      "children": [
        "/dashboard/clients/"
      ]
    },
    "/dashboard/project-settings": {
      "filePath": "dashboard/project-settings/route.tsx",
      "parent": "/dashboard",
      "children": [
        "/dashboard/project-settings/agent",
        "/dashboard/project-settings/preview",
        "/dashboard/project-settings/voice",
        "/dashboard/project-settings/"
      ]
    },
    "/(auth)/register": {
      "filePath": "(auth)/register.tsx"
    },
    "/(auth)/sign-in": {
      "filePath": "(auth)/sign-in.tsx"
    },
    "/agents/$agentId": {
      "filePath": "agents.$agentId.tsx"
    },
    "/dashboard/404": {
      "filePath": "dashboard/404.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/505": {
      "filePath": "dashboard/505.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/analytics": {
      "filePath": "dashboard/analytics.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/history": {
      "filePath": "dashboard/history.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/settings": {
      "filePath": "dashboard/settings.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/": {
      "filePath": "dashboard/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/agents/$agent": {
      "filePath": "dashboard/agents/$agent/route.tsx",
      "parent": "/dashboard/agents",
      "children": [
        "/dashboard/agents/$agent/agent",
        "/dashboard/agents/$agent/preview",
        "/dashboard/agents/$agent/voice",
        "/dashboard/agents/$agent/"
      ]
    },
    "/dashboard/agents/404": {
      "filePath": "dashboard/agents/404.tsx",
      "parent": "/dashboard/agents"
    },
    "/dashboard/agents/505": {
      "filePath": "dashboard/agents/505.tsx",
      "parent": "/dashboard/agents"
    },
    "/dashboard/phone/$id": {
      "filePath": "dashboard/phone/$id.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/project-settings/agent": {
      "filePath": "dashboard/project-settings/agent.tsx",
      "parent": "/dashboard/project-settings"
    },
    "/dashboard/project-settings/preview": {
      "filePath": "dashboard/project-settings/preview.tsx",
      "parent": "/dashboard/project-settings"
    },
    "/dashboard/project-settings/voice": {
      "filePath": "dashboard/project-settings/voice.tsx",
      "parent": "/dashboard/project-settings"
    },
    "/dashboard/agents/": {
      "filePath": "dashboard/agents/index.tsx",
      "parent": "/dashboard/agents"
    },
    "/dashboard/clients/": {
      "filePath": "dashboard/clients/index.tsx",
      "parent": "/dashboard/clients"
    },
    "/dashboard/phone/": {
      "filePath": "dashboard/phone/index.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/project-settings/": {
      "filePath": "dashboard/project-settings/index.tsx",
      "parent": "/dashboard/project-settings"
    },
    "/dashboard/agents/$agent/agent": {
      "filePath": "dashboard/agents/$agent/agent.tsx",
      "parent": "/dashboard/agents/$agent"
    },
    "/dashboard/agents/$agent/preview": {
      "filePath": "dashboard/agents/$agent/preview.tsx",
      "parent": "/dashboard/agents/$agent"
    },
    "/dashboard/agents/$agent/voice": {
      "filePath": "dashboard/agents/$agent/voice.tsx",
      "parent": "/dashboard/agents/$agent"
    },
    "/dashboard/agents/$agent/": {
      "filePath": "dashboard/agents/$agent/index.tsx",
      "parent": "/dashboard/agents/$agent"
    }
  }
}
ROUTE_MANIFEST_END */
