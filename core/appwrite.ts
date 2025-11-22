/** biome-ignore-all lint/style/noNonNullAssertion: Force import data from environment constants */
/** biome-ignore-all lint/correctness/noUnreachable: Only show error log. */

import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import {
	EXPO_ANDROID_ID,
	EXPO_PUBLIC_APPWRITE_ENDPOINT,
	EXPO_PUBLIC_APPWRITE_PROJECT_ID,
} from "./env";

export const config = {
	platform: EXPO_ANDROID_ID ? EXPO_ANDROID_ID : "com.restate.app",
	endpoint: EXPO_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
};

export const client = new Client();

client
	.setEndpoint(config.endpoint)
	.setProject(config.projectId)
	.setPlatform(config.platform);

export const avatar = new Avatars(client);

export const account = new Account(client);

export const login = async () => {
	try {
		const redirectUrl = Linking.createURL("/");

		const response = await account.createOAuth2Token(
			OAuthProvider.Google,
			redirectUrl,
		);

		if (!response) throw new Error("Create OAuth2 token failed");

		const browserResult = await openAuthSessionAsync(
			response.toString(),
			redirectUrl,
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

export const logout = async () => {
	try {
		const result = await account.deleteSession("current");
		return result;
	} catch (error) {
		console.error(error);
		return false;
	}
};

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
