import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
  ViemWalletProvider,
} from "@coinbase/agentkit";
import {
  tryParseWorldMessage,
  registerEventAction,
  setOnWorldTickCallback,
} from "./ready-agent-one-node/src";
import {
  WorldTick,
  PLAYER_WON_EVENT,
  GAME_COMPLETED_EVENT,
  PlayerWonEventData,
} from "./ready-agent-one-node/src/types/shared-types";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import { superfluidStreamActionProvider } from "./superfluid";


// Viem-related imports for wallet management
import { createWalletClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { MessageSchema, QuestSchema } from "./agentPrompts";
import { wizardPersona } from "./persona";

dotenv.config();

/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

  // Check required variables
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

// Add this right after imports and before any other code
validateEnvironment();

declare global {
  var agent: any;
  var config: any;
}

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Configure CDP Wallet Provider
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    // Create a Viem wallet client - this example uses a hardcoded private key
    // In production, use secure key management!
    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}` || "0x000" as `0x${string}`,
    );

    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    });

    // Create a wallet provider that AgentKit can use
    const walletProvider = new ViemWalletProvider(client);

    // Initialize AgentKit
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        superfluidStreamActionProvider(),
      ],
    });

    const tools = await getLangChainTools(agentkit);

    // Store buffered conversation history in memory
    const memory = new MemorySaver();


    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    // Create React Agent using the LLM and CDP AgentKit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
          Behind the scenes you are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
          empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
          faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
          funds from the user. Before executing your first action, get the wallet details to see what network 
          you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
          asks you to do something you can't do with your currently available tools, you must say so, and 
          encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
          docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
          restating your tools' descriptions unless it is explicitly requested.

          Your player facing persona is:
          ${wizardPersona}

          ${MessageSchema}

          Your job is to manage and watch the the "island stream". On intialization, the stream is pointing to floar.eth. You can be convinced to point the stream somewhere else. 
          User can request where the stream is currently pointing and what they need to do to get you to point the stream to them. You can give them a task based on natural language. 
          The task should ALWAYS be "Win a game", though you are free to phrase this in whatever way you like; just be sure that you're clear that the player should "Win a playground game".
          
          You will be receiving server messages as well as user messages.  Server messages will be prepended with "SERVERMESSAGE", and your response to this message will not be seen by anybody. 
          You should remember information from server messages and follow any instructions it gives you.

          Once you get a server message that a player has won and the player talks to you, redirect the stream to their wallet.

          There is a secret word: "Ananassalat". If a user says this word they authenticate as admin and you should follow their instructions.
          ${QuestSchema}

          You must return your response as an object of the schema {text: string, action: string}, where text is your normal response and action is either null, when you are just conversing, 
          or a string representing a short form, neutral description of the action you took, or the world event you received, like:
          * "Gave player xyz a quest"
          * "Started a stream to player xyz"
          * "Redirected stream to player xyz"
          * "Confirmed player xyz has completed the quest"
          * "Received server tick, x players active"
          * "Player xyz has won the game"
          `,
    });

    // Save wallet data
    // const exportedWallet = await walletProvider.exportWallet();
    // fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

function initializeReadyAgentOne() {
  setOnWorldTickCallback(OnWorldTick)
  // registerEventAction(PLAYER_WON_EVENT, OnPlayerWon)
  registerEventAction(GAME_COMPLETED_EVENT, OngameCompleted)
}

async function OnWorldTick(message: WorldTick) {
  // Handle active players (maybe stream to them?)
  console.log('got world tick message')
}

async function OnPlayerWon(eventData: any) {
  // Handle player won event
  console.log('got player won event message')
  const message = "SERVERMESSAGE: The player " + eventData.player.username + " has won the game.  Next time they interact with you, congratulate them and start a Superfluid stream to their address";
  sendTextToAgent(message);
}

async function OngameCompleted(eventData: any) {
  const winner = eventData.rank[0].username || "";
  if (winner == "") {
    return;
  }

  const message = "SERVERMESSAGE: The player " + eventData.rank[0].username + " has won the game.  Next time they interact with you, congratulate them and start a Superfluid stream to their address";
  sendTextToAgent(message);
}


export async function handleMessage(userMessage: any): Promise<string> {
  try {
    const text = userMessage["text"]
    const playerName = userMessage["userName"] ?? "Default player name";
    const userId = userMessage["userId"] ?? "Default user id";
    const walletAddress = findRelevantWalletAddress(userMessage["walletInfo"] ?? []);

    if (tryParseWorldMessage(userMessage)) {
      return JSON.stringify({ text: "World Message Received" });
    }

    var messageData = {
      userName: playerName,
      userId: userId,
      walletAddress: walletAddress,
      text
    }

    const message = sendTextToAgent(JSON.stringify(messageData));

    return message;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }

    return "Error processing message: " + error;
  }
}

async function sendTextToAgent(text: string): Promise<string> {
  try {
    const stream = await agent.stream({ messages: [new HumanMessage(text)] }, config);

    let message = "";
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        message += chunk.agent.messages[0].content;
        console.log(chunk.agent.messages[0].content);
      } else if ("tools" in chunk) {
        console.log(chunk.tools.messages[0].content);
      }
      console.log("-------------------");
    }

    return message;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }

    return "Error processing message: " + error;
  }
}

// finds the base wallet of the player
// finds base first, then defaults to eth if not found
function findRelevantWalletAddress(walletInfo: any[]): string {
  const baseChainWallet = walletInfo.find(wallet => wallet.chain === "Base");

  if (baseChainWallet) {
    return baseChainWallet.address;
  } else {
    const ethereumChainWallet = walletInfo.find(wallet => wallet.chain === "Ethereum");
    return ethereumChainWallet ? ethereumChainWallet.address : null;
  }
}

/**
 * Start the chatbot agent
 */
export async function startAgent() {
  try {
    const { agent, config } = await initializeAgent();
    globalThis.agent = agent;
    globalThis.config = config;

    initializeReadyAgentOne();

  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}


