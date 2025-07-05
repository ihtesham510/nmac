/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as agents from "../agents.js";
import type * as client from "../client.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as image from "../image.js";
import type * as internals from "../internals.js";
import type * as subscriptions from "../subscriptions.js";
import type * as user from "../user.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  agents: typeof agents;
  client: typeof client;
  crons: typeof crons;
  http: typeof http;
  image: typeof image;
  internals: typeof internals;
  subscriptions: typeof subscriptions;
  user: typeof user;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
