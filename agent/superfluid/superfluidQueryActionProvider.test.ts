import { superfluidQueryActionProvider } from "./superfluidQueryActionProvider";
import { EvmWalletProvider } from "@coinbase/agentkit";
import { getAccountOutflow } from "./graphQueries/superfluidGraphQueries";

jest.mock("./graphQueries/superfluidGraphQueries", () => ({
  getAccountOutflow: jest.fn(async () => ({
    accounts: [{ outflows: [{ receiver: "0x123", token: "0xABC", currentFlowRate: "100" }] }],
  })),
}));

describe("SuperfluidQueryActionProvider", () => {
  const MOCK_ADDRESS = "0xe6b2af36b3bb8d47206a129ff11d5a2de2a63c83";
  let mockWallet: jest.Mocked<EvmWalletProvider>;
  const actionProvider = superfluidQueryActionProvider();

  beforeEach(() => {
    mockWallet = {
      getAddress: jest.fn().mockReturnValue(MOCK_ADDRESS),
      getNetwork: jest.fn().mockReturnValue({ protocolFamily: "evm" }),
    } as unknown as jest.Mocked<EvmWalletProvider>;
  });

  describe("queryStreams", () => {
    it("should return active outflows when streams exist", async () => {
      const response = await actionProvider.queryStreams(mockWallet);
      expect(response).toContain("Current outflows are");
      expect(response).toContain("0x123");
    });

    it("should return an empty array when no active streams exist", async () => {
      (getAccountOutflow as jest.Mock).mockImplementation(async () => ({
        accounts: [{ outflows: [] }],
      }));
      const response = await actionProvider.queryStreams(mockWallet);
      expect(response).toBe("Current outflows are []");
    });

    it("should handle query errors gracefully", async () => {
      (getAccountOutflow as jest.Mock).mockImplementation(async () => {
        throw new Error("Query failed");
      });
      const response = await actionProvider.queryStreams(mockWallet);
      expect(response).toBe("Error creating Superfluid pool: Error: Query failed");
    });
  });

  describe("supportsNetwork", () => {
    it("should return true for EVM networks", () => {
      const result = actionProvider.supportsNetwork({ protocolFamily: "evm", networkId: "any" });
      expect(result).toBe(true);
    });

    it("should return false for non-EVM networks", () => {
      const result = actionProvider.supportsNetwork({
        protocolFamily: "bitcoin",
        networkId: "any",
      });
      expect(result).toBe(false);
    });
  });
});
