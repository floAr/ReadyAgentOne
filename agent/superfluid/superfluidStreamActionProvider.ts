import { z } from "zod";

import {
  SuperfluidCreateStreamSchema,
  SuperfluidDeleteStreamSchema
} from "./schemas";
import {
  CFAv1ForwarderAddress,
  CFAv1ForwarderABI,
} from "./constants";
import { encodeFunctionData, Hex } from "viem";
import { ActionProvider, WalletProvider, CreateAction, EvmWalletProvider, Network } from "@coinbase/agentkit";


const superfluidToken = "0x1783B0F81E2F2278155A643370E6b3ace789f2c9"; // $Islandx
const flowRate = 10;

/**
 * SuperfluidStreamActionProvider is an action provider for Superfluid interactions.
 */
export class SuperfluidStreamActionProvider extends ActionProvider<EvmWalletProvider> {

  /**
   * Constructor for the SuperfluidStreamActionProvider class.
   */
  constructor() {
    super("superfluid-stream", []);

  }

  getStreamLink = (network: Network, tokenAddress: string, senderAddress: string, recipientAddress: string) => {
    //schema https://app.superfluid.finance/stream/base-sepolia/0x2e5ed14144d0682ce1929c47ceeccbef6ed7ff5c-0x930b9cc24c46c341803e5fefb3590bdb4ff576a6-0x7635356d54d8af3984a5734c2be9e25e9abc2ebc
    return `https://app.superfluid.finance/stream/${network.networkId}/${senderAddress}-${recipientAddress}-${tokenAddress}`
  }

  /**
   * Creates a stream from the agent wallet to the recipient
   *
   * @param walletProvider - The wallet provider to start the stream from.
   * @param args - The input arguments for the action.
   * @returns A JSON string containing the account details or error message
   */
  @CreateAction({
    name: "create_stream",
    description: `
This tool will create a Superfluid stream for a desired token on an EVM network.
It takes the ERC20 token address, a recipient address, and a stream rate to create a Superfluid stream.
Superfluid will then start streaming the token to the recipient at the specified rate.
Do not use the ERC20 address as the destination address. If you are unsure of the destination address, please ask the user before proceeding.
`,
    schema: SuperfluidCreateStreamSchema,
  })
  async createStream(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof SuperfluidCreateStreamSchema>
  ): Promise<string> {
    try {
      const data = encodeFunctionData({
        abi: CFAv1ForwarderABI,
        functionName: "createFlow",
        args: [superfluidToken as Hex, walletProvider.getAddress() as Hex, args.recipientAddress as Hex, BigInt(flowRate), "0x"],
      });

      const hash = await walletProvider.sendTransaction({
        to: CFAv1ForwarderAddress as `0x${string}`,
        data,
      });


      await walletProvider.waitForTransactionReceipt(hash);

      return `Created stream of $Islandx to ${args.recipientAddress} at a rate of ${flowRate}. The link to the stream is ${this.getStreamLink(walletProvider.getNetwork(), superfluidToken, walletProvider.getAddress(), args.recipientAddress)}`;
    } catch (error) {
      return `Error creating Superfluid stream: ${error}`;
    }
  }

  /**
   * Updates a stream from the agent wallet to the recipient
   *
   * @param walletProvider - The wallet provider to start the stream from.
   * @param args - The input arguments for the action.
   * @returns A JSON string containing the account details or error message
   */
  @CreateAction({
    name: "update_stream",
    description: `
This tool will update a Superfluid stream for a desired token on an EVM network.
It takes the ERC20 token address, a recipient address, and a stream rate to update a Superfluid stream.
Superfluid will then start streaming the token with the updated flow rate to the recipient.
Do not use the ERC20 address as the destination address. If you are unsure of the destination address, please ask the user before proceeding.
`,
    // schema same as create schema
    schema: SuperfluidCreateStreamSchema,
  })
  async updateStream(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof SuperfluidCreateStreamSchema>
  ): Promise<string> {
    try {
      const data = encodeFunctionData({
        abi: CFAv1ForwarderABI,
        functionName: "updateFlow",
        args: [args.erc20TokenAddress as Hex, walletProvider.getAddress() as Hex, args.recipientAddress as Hex, BigInt(args.flowRate), "0x"],
      });

      const hash = await walletProvider.sendTransaction({
        to: CFAv1ForwarderAddress as `0x${string}`,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Updated stream of token ${args.erc20TokenAddress} to ${args.recipientAddress} at a rate of ${args.flowRate}`;
    } catch (error) {
      return `Error creating Superfluid stream: ${error}`;
    }
  }

  /**
   * Deletes a stream from the agent wallet to the recipient
   *
   * @param walletProvider - The wallet provider to start the stream from.
   * @param args - The input arguments for the action.
   * @returns A JSON string containing the account details or error message
   */
  @CreateAction({
    name: "delete_stream",
    description: `
This tool will stop the streaming of a Superfluid ERC20 token.
It takes the ERC20 token address and a recipient address to delete a Superfluid stream, if one is present.
Superfluid will then stop streaming the token to the recipient.
Do not use the ERC20 address as the destination address. If you are unsure of the destination address, please ask the user before proceeding.
`,
    schema: SuperfluidDeleteStreamSchema,
  })
  async deleteStream(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof SuperfluidDeleteStreamSchema>
  ): Promise<string> {
    try {
      const data = encodeFunctionData({
        abi: CFAv1ForwarderABI,
        functionName: "deleteFlow",
        args: [args.erc20TokenAddress as Hex, walletProvider.getAddress() as Hex, args.recipientAddress as Hex, "0x"],
      });

      const hash = await walletProvider.sendTransaction({
        to: CFAv1ForwarderAddress as `0x${string}`,
        data,
      });

      await walletProvider.waitForTransactionReceipt(hash);

      return `Stopped stream of token ${args.erc20TokenAddress} to ${args.recipientAddress}`;
    } catch (error) {
      return `Error creating Superfluid stream: ${error}`;
    }
  }

  /**
   * Checks if the Superfluid action provider supports the given network.
   *
   * @param network - The network to check.
   * @returns True if the Superfluid action provider supports the network, false otherwise.
   */
  supportsNetwork = (network: Network) => network.protocolFamily === "evm";
}

export const superfluidStreamActionProvider = () => new SuperfluidStreamActionProvider();
