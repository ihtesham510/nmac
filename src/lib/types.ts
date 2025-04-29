import { client } from '@/api/client'
import type { api } from 'convex/_generated/api'

export type CreateAgentOptions = Parameters<
	typeof client.conversationalAi.createAgent
>[0]

export type GetAgentList = Awaited<
	ReturnType<typeof client.conversationalAi.getAgents>
>['agents'][0]

export type CreateAgentReturnOptions = Awaited<
	ReturnType<typeof client.conversationalAi.createAgent>
>

export type User = (typeof api.user.authenticate)['_returnType']
export type Client = (typeof api.client.authenticate)['_returnType']

export type Clients = (typeof api.client.listClients)['_returnType']

export type ArgsUser = (typeof api.user.registerUser)['_args']
export type ArgsSignIn = (typeof api.user.signIn)['_args']

export type Agent = (typeof api.agents.getAgent)['_returnType']
