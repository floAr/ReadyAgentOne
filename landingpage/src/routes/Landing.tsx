import React, { useEffect, useRef } from 'react';
import { MouseParallaxContainer, MouseParallaxChild } from 'react-parallax-mouse';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Bot, Code2, Zap } from 'lucide-react';

import imgUrl from '@content/agent.png';
import backgroundUrl from '@content/nifty.png';
import { link } from 'framer-motion/client';
import Card from '../components/Card';
import AvatarViewer from '../components/AvatarViewer';
import WebSocketComponent from '../components/WebSocket';
import { initializeWebSocket } from '../utils/webSocketUtils';

function Landing() {
  const parallaxClose = 0.01;
  const parallaxMid = 0.015;
  const parallaxFar = 0.02;

  const poweredBy = [
    { title: "Base", logo: "https://ethglobal.b-cdn.net/organizations/h5ps8/square-logo/default.png", link: "https://www.base.org/", tooltip: "Base is a decentralized protocol for building and trading synthetic assets." },
    { title: "Coinbase", logo: "https://ethglobal.b-cdn.net/organizations/rpi4f/square-logo/default.png", link: "https://docs.cdp.coinbase.com/agentkit/docs/welcome" },
    { title: "NiftyIsland", logo: "../public/img/xUrZ9-yJ_400x400 (1).jpg", link: "https://niftyisland.com" },
    { title: "The graph", logo: "https://ethglobal.b-cdn.net/organizations/pfyco/square-logo/default.png", link: "https://thegraph.com/", tooltip: "The graph is used to update " },
    { title: "Superfluid", logo: "https://explorer.superfluid.finance/superfluid-logo.svg", link: "https://www.superfluid.finance/" },  
  ]



  function ParallaxBackground() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-window.innerHeight, window.innerHeight], [2, -2]);
    const rotateY = useTransform(x, [-window.innerWidth, window.innerWidth], [-20, 20]);

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        x.set(event.clientX - window.innerWidth / 2);
        y.set(event.clientY - window.innerHeight / 2);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    return (
      <motion.div
        style={{ rotateX, rotateY }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={backgroundUrl}
          alt="Background"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-900 scale-110" />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] relative">
      <ParallaxBackground />
      <MouseParallaxContainer className="min-h-screen relative overflow-hidden">
        <div className="px-4 py-12 w-5/6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 "
          >
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              ReadyAgentOne
            </h1>
            <h2 className="text-xl text-gray-500 dark:text-gray-400">
              <a href="https://ethglobal.com/showcase/gaimer-7mytn" target="_blank" rel="noopener noreferrer">
                [Agentic Hackathon 2025]
              </a>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 lg:col-span-2 "
            >
              <MouseParallaxChild factorX={parallaxClose} factorY={parallaxFar} className="relative -translate-y-6 left-10">
                <Card icon={Bot} title=" Reference Agent: Wizmar Q. Nimbleshanks" links={[
                  { href: "https://github.com/floAr/ReadyAgentOne/tree/main/agent/agent", label: "Github Agent" },
                  { href: "https://github.com/gtspencer/agentkit/tree/master/typescript/agentkit/src/action-providers/superfluid", label: "Github Superfluid Action" },

                ]} >
                  We created a reference agent using the ReadyAgentOne framework and  <a href="https://github.com/floAr/ReadyAgentOne/tree/main/ready-agent-one-node" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                    NiftyIsland 🔗</a>. The agent lives ingame and gives players small quests upon speaking to him. By completing a quest the player earns the right to receive $ISLAND tokens streamed to their wallet
                  using <a href="https://github.com/floAr/ReadyAgentOne/tree/main/ready-agent-one-node" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                    Superfluid 🔗</a>, enabled by creating a new action for the Coinbase Agentkit.<br /><br />
                  The agent is capable of taking any on-chain action in response to in-game world events.  We define this standard and provide the necessary toolset to enable any existing Javascript based agent to meaningfully respond to realtime rich in-game world events.</Card>
              </MouseParallaxChild>

              <MouseParallaxChild factorX={parallaxMid} factorY={parallaxMid} className="relative translate-y-6 right-10">

                <Card icon={Code2} title="ReadyAgentOne Framework" links={[
                  { href: "https://github.com/floAr/ReadyAgentOne/tree/main/ready-agent-one-node", label: "Github" },
                  { href: "https://www.npmjs.com/package/@0xspencer/ready-agent-one", label: "Npm" },
                ]}>
                  ReadyAgentOne is a framework intended to be integrated at both a game and agent level to enable an agent to consume and meaningfully respond to in-game world events.<br /><br />
                  It sits on top of the agent layer and serves as an additional action space to enable the agent to respond to events from a game's authority.<br /><br />
                  In the framework we define a set of modifiable and extendible events as well as callbacks for the events that are easily integrable into existing Javascript agent frameworks.
                </Card>
              </MouseParallaxChild>

              <MouseParallaxChild factorX={parallaxClose} factorY={parallaxMid} className="relative translate-y-6">
                <Card icon={Zap} title="Powered by" links={[]} >
                  <div className="flex space-x-4 justify-around">
                    {poweredBy.map((item, index) => (
                      <div key={index} className="relative group">
                        <a className="flex flex-col items-center playful-hover-small" href={item.link} target="_blank" rel="noopener noreferrer">
                          <img src={item.logo} alt={item.title} className="h-12 w-auto" />
                          <p>{item.title}</p>
                        </a>
                        {item.tooltip && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {item.tooltip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </MouseParallaxChild>
            </motion.div>

            {/* Empty middle column for spacing */}
            <div className="lg:col-span-1" />

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 "
            >
              <MouseParallaxChild factorX={parallaxClose} factorY={parallaxClose} className="relative -translate-y-6">
                <div className="rounded-2xl p-6 bg-white dark:bg-[#2d2d2f] shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] h-[600px] overflow-y-auto">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Thought Stream</h3>
                  <div className="space-y-4  h-[450px]">
                    <WebSocketComponent endpoint={"https://readyagentone-production.up.railway.app/readyagentone"} />
                  </div>
                </div>
              </MouseParallaxChild>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none z-10 h-[65vh]"
        >
          <MouseParallaxChild factorX={-parallaxClose} factorY={-parallaxClose}>
            {/* <AvatarViewer modelPath="/models/yp.fbx" /> */}
            <img
              src={imgUrl}
              alt="Agent Character"
              className="h-[65vh] w-auto object-contain filter drop-shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
          </MouseParallaxChild>
        </motion.div>
      </MouseParallaxContainer >

    </div >
  );
}

export default Landing;