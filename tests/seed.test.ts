import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import seed, { getRandomSubset } from "@/lib/seed";

import { galleryImages } from "@/lib/data";
import { tablesDB } from "@/core/appwrite";

jest.mock("@/core/appwrite", () => ({
  config: {
    databaseId: "test_db",
    agentsTableId: "agents_table",
    reviewsTableId: "reviews_table",
    galleriesTableId: "galleries_table",
    propertiesTableId: "properties_table",
  },
  tablesDB: {
    listRows: jest.fn().mockResolvedValue({ rows: [] } as never),
    deleteRow: jest.fn().mockResolvedValue({} as never),
    createRow: jest
      .fn()
      .mockImplementation((dto: any) =>
        Promise.resolve({ $id: dto.rowId, name: dto.data.name })
      ),
  },
}));

jest.mock("@/lib/data", () => ({
  agentImages: ["agent1.png", "agent2.png"],
  galleryImages: [
    "g1.png",
    "g2.png",
    "g3.png",
    "g4.png",
    "g5.png",
    "g6.png",
    "g7.png",
    "g8.png",
  ],
  propertiesImages: [
    "p1.png",
    "p2.png",
    "p3.png",
    "p4.png",
    "p5.png",
    "p6.png",
  ],
  reviewImages: ["r1.png", "r2.png"],
}));

// Mock react-native-appwrite to avoid importing native modules during tests
jest.mock("react-native-appwrite", () => ({
  ID: {
    unique: () => "unique-id",
  },
}));

describe("getRandomSubset", () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("should return a subset with a valid size", () => {
    const subset = getRandomSubset(array, 2, 5);
    expect(subset.length).toBeGreaterThanOrEqual(2);
    expect(subset.length).toBeLessThanOrEqual(5);
  });

  it("should throw an error if minItems > maxItems", () => {
    expect(() => getRandomSubset(array, 5, 2)).toThrow(
      "minItems cannot be greater than maxItems"
    );
  });

  it("should throw an error if minItems or maxItems are out of range", () => {
    expect(() => getRandomSubset(array, -1, 5)).toThrow(
      "minItems or maxItems are out of valid range for the array"
    );
    expect(() => getRandomSubset(array, 2, 11)).toThrow(
      "minItems or maxItems are out of valid range for the array"
    );
  });
});

describe("seed", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should complete seeding without errors", async () => {
    await seed();

    // listRows should be called once per table
    expect(tablesDB.listRows).toHaveBeenCalledTimes(4);

    // compute expected createRow calls: agents (5) + reviews (20) + galleries (galleryImages.length) + properties (20)
    const expectedCreateCalls = 5 + 20 + galleryImages.length + 20;
    expect(tablesDB.createRow).toHaveBeenCalledTimes(expectedCreateCalls);
  });

  it("should handle error during seeding", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (tablesDB.createRow as any).mockRejectedValueOnce(
      new Error("Failed to create row")
    );

    await seed();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error seeding data:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
