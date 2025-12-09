// Tests for core/appwrite.ts

// Mocks must be declared before importing the module under test

// Now import the module under test
import * as appwriteModule from "../core/appwrite";

import { beforeEach, describe, expect, jest, test } from "@jest/globals";

// Pull out mocks for assertions
const { __mocks__: appwriteMocks } = require("react-native-appwrite");

// Polyfill btoa for Node environment
global.btoa =
  global.btoa ||
  ((str: string) => Buffer.from(str, "binary").toString("base64"));

// Mock environment variables
jest.mock("../lib/env", () => ({
  EXPO_PUBLIC_APPWRITE_ENDPOINT: "https://example.com/v1",
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: "project123",
  EXPO_PUBLIC_DATABASE_ID: "db123",
  EXPO_PUBLIC_TABLE_AGENTS_ID: "agents123",
  EXPO_PUBLIC_TABLE_GALLERIES_ID: "galleries123",
  EXPO_PUBLIC_TABLE_PROPERTIES_ID: "properties123",
  EXPO_PUBLIC_TABLE_REVIEWS_ID: "reviews123",
}));

// Mock expo-linking
jest.mock("expo-linking", () => ({
  createURL: jest.fn(() => "myapp://redirect"),
}));

// Mock expo-web-browser
jest.mock("expo-web-browser", () => ({
  openAuthSessionAsync: jest.fn(),
}));

// Mock react-native-appwrite module
jest.mock("react-native-appwrite", () => {
  const Query = {
    orderAsc: (v: string) => ({ type: "orderAsc", value: v }),
    orderDesc: (v: string) => ({ type: "orderDesc", value: v }),
    limit: (n: number) => ({ type: "limit", value: n }),
    equal: (k: string, v: string) => ({ type: "equal", key: k, value: v }),
    or: (arr: any[]) => ({ type: "or", value: arr }),
    search: (k: string, v: string) => ({ type: "search", key: k, value: v }),
  };

  // We'll capture the mocked instance methods so tests can assert on them
  const listRowsMock = jest.fn();
  const getRowMock = jest.fn();

  class TablesDB {
    listRows = listRowsMock;
    getRow = getRowMock;
    constructor() {}
  }

  const createSessionMock = jest.fn();
  const createOAuth2TokenMock = jest.fn();
  const getMock = jest.fn();
  const deleteSessionMock = jest.fn();

  class Account {
    createOAuth2Token = createOAuth2TokenMock;
    createSession = createSessionMock;
    get = getMock;
    deleteSession = deleteSessionMock;
    constructor() {}
  }

  const getInitialsMock = jest.fn();

  class Avatars {
    getInitials = getInitialsMock;
    constructor() {}
  }

  class Client {
    setEndpoint(endpoint: string) {
      return this;
    }
    setProject(projectId: string) {
      return this;
    }
  }

  const OAuthProvider = { Google: "google" };

  return {
    Account,
    Avatars,
    Client,
    OAuthProvider,
    Query,
    TablesDB,
    // expose mocks for assertions
    __mocks__: {
      listRowsMock,
      getRowMock,
      createSessionMock,
      createOAuth2TokenMock,
      getMock,
      deleteSessionMock,
      getInitialsMock,
    },
  };
});

const {
  listRowsMock,
  getRowMock,
  createSessionMock,
  createOAuth2TokenMock,
  getMock,
  deleteSessionMock,
  getInitialsMock,
} = appwriteMocks as any;

describe("core/appwrite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("config is populated from env", () => {
    expect(appwriteModule.config.endpoint).toBe("https://example.com/v1");
    expect(appwriteModule.config.projectId).toBe("project123");
    expect(appwriteModule.config.databaseId).toBe("db123");
    expect(appwriteModule.config.propertiesTableId).toBe("properties123");
  });

  test("getFeaturedProperties returns rows from tablesDB.listRows", async () => {
    listRowsMock.mockResolvedValue({ rows: [{ id: "f1" }] });
    const rows = await appwriteModule.getFeaturedProperties();
    expect(listRowsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        databaseId: appwriteModule.config.databaseId,
        tableId: appwriteModule.config.propertiesTableId,
      })
    );
    expect(rows).toEqual([{ id: "f1" }]);
  });

  test("getProperties builds queries correctly and returns rows", async () => {
    listRowsMock.mockResolvedValue({ rows: [{ id: "x1" }] });

    const result = await appwriteModule.getProperties({
      filter: "apartment",
      query: "central",
      limit: 2,
    });

    expect(listRowsMock).toHaveBeenCalled();
    const calledWith = listRowsMock.mock.calls[0][0];
    expect(calledWith.databaseId).toBe(appwriteModule.config.databaseId);
    expect(calledWith.tableId).toBe(appwriteModule.config.propertiesTableId);
    // queries should be an array
    expect(Array.isArray(calledWith.queries)).toBe(true);
    // ensure limit object exists
    expect(
      calledWith.queries.some((q: any) => q.type === "limit" && q.value === 2)
    ).toBe(true);
    // ensure equal filter added
    expect(
      calledWith.queries.some(
        (q: any) =>
          q.type === "equal" && q.key === "type" && q.value === "apartment"
      )
    ).toBe(true);
    // ensure search OR added
    expect(calledWith.queries.some((q: any) => q.type === "or")).toBe(true);

    expect(result).toEqual([{ id: "x1" }]);
  });

  test("getPropertyById returns a single row", async () => {
    getRowMock.mockResolvedValue({ id: "single" });
    const res = await appwriteModule.getPropertyById({ propertyId: "single" });
    expect(getRowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        databaseId: appwriteModule.config.databaseId,
        tableId: appwriteModule.config.propertiesTableId,
        rowId: "single",
      })
    );
    expect(res).toEqual({ id: "single" });
  });

  test("getCurrentUser returns null if account.get throws", async () => {
    getMock.mockRejectedValue(new Error("no user"));
    const res = await appwriteModule.getCurrentUser();
    expect(res).toBeNull();
  });

  test("getCurrentUser returns user with generated avatar when avatar returns ArrayBuffer", async () => {
    // Simulate account.get returning a user
    getMock.mockResolvedValue({ $id: "u1", name: "John Doe" });
    // Simulate avatar.getInitials returning a Uint8Array representing 'hi'
    const buf = new Uint8Array([104, 105]); // 'hi'
    getInitialsMock.mockResolvedValue(buf.buffer ? buf.buffer : buf);

    const user = await appwriteModule.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.$id).toBe("u1");
    expect(typeof user!.avatar).toBe("string");
    expect(user!.avatar.startsWith("data:image/svg+xml;base64,")).toBe(true);
  });

  test("logout deletes current session and returns result", async () => {
    deleteSessionMock.mockResolvedValue({ success: true });
    const res = await appwriteModule.logout();
    expect(deleteSessionMock).toHaveBeenCalledWith("current");
    expect(res).toEqual({ success: true });
  });
});
