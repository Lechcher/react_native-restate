/**
 * @file This file contains the configuration and service initialization for interacting with the Appwrite backend.
 * It includes functions for authentication, database operations, and avatar generation.
 */

/** biome-ignore-all lint/style/noNonNullAssertion: Force import data from environment constants */
/** biome-ignore-all lint/correctness/noUnreachable: Only show error log. */

import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  OAuthProvider,
  Query,
  TablesDB,
} from "react-native-appwrite";
import {
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  EXPO_PUBLIC_DATABASE_ID,
  EXPO_PUBLIC_TABLE_AGENTS_ID,
  EXPO_PUBLIC_TABLE_GALLERIES_ID,
  EXPO_PUBLIC_TABLE_PROPERTIES_ID,
  EXPO_PUBLIC_TABLE_REVIEWS_ID,
} from "../lib/env";

/**
 * Appwrite configuration object.
 * Holds the endpoint, project ID, database ID, and table IDs for the Appwrite project.
 */
export const config = {
  endpoint: EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: EXPO_PUBLIC_DATABASE_ID!,
  agentsTableId: EXPO_PUBLIC_TABLE_AGENTS_ID!,
  galleriesTableId: EXPO_PUBLIC_TABLE_GALLERIES_ID!,
  propertiesTableId: EXPO_PUBLIC_TABLE_PROPERTIES_ID!,
  reviewsTableId: EXPO_PUBLIC_TABLE_REVIEWS_ID!,
};

/**
 * Appwrite client instance.
 * Configured with the project's endpoint and ID.
 */
export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

/**
 * Appwrite Avatars service.
 * Used for generating user avatars.
 */
export const avatar = new Avatars(client);

/**
 * Appwrite Account service.
 * Used for managing user accounts and authentication.
 */
export const account = new Account(client);

/**
 * Appwrite TablesDB service.
 * Used for interacting with the Appwrite database.
 */
export const tablesDB = new TablesDB(client);

/**
 * Handles Google OAuth login.
 * Creates an OAuth2 token, opens a web browser for authentication, and creates a session.
 * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
 */
export const login = async () => {
  try {
    const redirectUrl = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUrl
    );

    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUrl
    );

    console.log(JSON.stringify(response, null, 2));

    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession({
      userId,
      secret,
    });

    console.log(JSON.stringify(session, null, 2));

    if (!session) throw new Error("Failed to create new session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Logs out the current user by deleting the current session.
 * @returns {Promise<object | boolean>} A promise that resolves to the result of the session deletion, or false if an error occurs.
 */
export const logout = async () => {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Retrieves the current authenticated user.
 * If a user is found, it also generates and attaches an avatar URL.
 * @returns {Promise<object | null>} A promise that resolves to the user object with an avatar, or null if no user is found or an error occurs.
 */
export const getCurrentUser = async () => {
  try {
    const result = await account.get();

    if (result.$id) {
      const avatarUrl = await avatar.getInitials({ name: result.name });
      // Convert ArrayBuffer to base64 string
      const binaryString = String.fromCharCode(...new Uint8Array(avatarUrl));
      const base64String = btoa(binaryString);
      const avatarBufferSvgBase64 = `data:image/svg+xml;base64,${base64String}`;

      return {
        ...result,
        avatar:
          typeof avatarUrl === "object" ? avatarBufferSvgBase64 : avatarUrl,
      };
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Fetches featured properties from the database, ordered by rating.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of featured property documents.
 */
export const getFeaturedProperties = async () => {
  try {
    const result = await tablesDB.listRows({
      databaseId: config.databaseId,
      tableId: config.propertiesTableId,
      queries: [Query.orderDesc("rating"), Query.limit(6)],
    });

    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Fetches properties with optional filtering, searching, and limiting.
 * @param {object} params - The parameters for fetching properties.
 * @param {string} params.filter - The property type to filter by.
 * @param {string} params.query - The search query for name, address, or type.
 * @param {number} params.limit - The maximum number of properties to return.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of property documents.
 */
export const getProperties = async ({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit: number;
}) => {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "all") {
      buildQuery.push(Query.equal("type", filter));
    }

    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );
    }

    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    const result = await tablesDB.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesTableId!,
      queries: buildQuery,
    });

    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Fetches a single property by its ID.
 * @param {object} params - The parameters for fetching a property.
 * @param {string} params.propertyId - The ID of the property to fetch.
 * @returns {Promise<object | null>} A promise that resolves to the property document, or null if not found or an error occurs.
 */
export const getPropertyById = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  try {
    const result = await tablesDB.getRow({
      databaseId: config.databaseId,
      tableId: config.propertiesTableId,
      rowId: propertyId,
    });

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
