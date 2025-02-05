import React, { useEffect } from 'react';
import { MouseParallaxContainer, MouseParallaxChild } from 'react-parallax-mouse';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Bot, Code2 } from 'lucide-react';

import imgUrl from '@content/agent.png';
import backgroundUrl from '@content/nifty.png';
import { link } from 'framer-motion/client';

function Landing() {
  const parallaxClose = 0.01;
  const parallaxMid = 0.015;
  const parallaxFar = 0.02;

  const poweredBy = [
    { title: "Base", logo: "https://ethglobal.b-cdn.net/organizations/h5ps8/square-logo/default.png", link: "https://www.base.org/", tooltip: "Base is a decentralized protocol for building and trading synthetic assets." },
    { title: "Coinbase", logo: "https://ethglobal.b-cdn.net/organizations/rpi4f/square-logo/default.png", link: "https://docs.cdp.coinbase.com/agentkit/docs/welcome" },
    { title: "Superfluid", logo: "https://explorer.superfluid.finance/superfluid-logo.svg", link: "" },
    { title: "NiftyIsland", logo: "https://file.notion.so/f/f/5aadef8e-7e03-4a7f-a933-ab5fd2bd34e9/e45b9360-c30c-4ef9-9048-cb1b4d97d62f/Icon_-_Color_-_Nifty_Island.png?table=block&id=a9ecf914-f68e-4f6d-bf82-f7910af218da&spaceId=5aadef8e-7e03-4a7f-a933-ab5fd2bd34e9&expirationTimestamp=1738807200000&signature=gkvyhvBpiXkw5GH0uuZL2JMv3r5fj0OxzJ4Qh5_eoKw&downloadName=Icon+-+Color+-+Nifty+Island.png", link: "" },
    { title: "The graph", logo: "https://ethglobal.b-cdn.net/organizations/pfyco/square-logo/default.png", link: "https://thegraph.com/", tooltip: "The graph is used to update " },]

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
                <div className="relative   playful-hover">

                  <div className="rounded-2xl p-6 bg-white dark:bg-[#2d2d2f] shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                    <label className="flex items-center text-lg mb-3 text-gray-800 dark:text-white">
                      <Bot className="mr-2" /> Reference Agent: Wizmar Q. Nimbleshanks
                    </label>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      We created a reference agent using the ReadyAgentOne framework and  <a href="https://github.com/floAr/ReadyAgentOne/tree/main/ready-agent-one-node" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                        NiftyIsland 🔗</a>. The agent lives on an island ingame and will give players small quests upon speaking to him. By completing a quest the player earns the right to receive $ISLAND token streamed to their wallet
                      using <a href="https://github.com/floAr/ReadyAgentOne/tree/main/ready-agent-one-node" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                        Superfluid 🔗</a>.<br />
                      We enabled this by creating and adding a new action type to the Coinbase Agentkit to allow the agent to interact with the Superfluid protocol.<br />
                      TODO: Add more details about the agent and the framework.

                      <div className="flex space-x-4 justify-around mt-2">
                        <a href="https://github.com/floAr/ReadyAgentOne/tree/main/agent/agent" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                          Github Agent 🔗
                        </a>
                        <a href="https://github.com/gtspencer/agentkit/tree/master/typescript/agentkit/src/action-providers/superfluid" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                          Github Superfluid Action 🔗
                        </a>
                      </div>
                    </p>
                  </div>
                </div>
              </MouseParallaxChild>

              <MouseParallaxChild factorX={parallaxMid} factorY={parallaxMid} className="relative translate-y-6 right-10">
                <div className="relative   playful-hover">

                  <div className="rounded-2xl p-6 bg-white dark:bg-[#2d2d2f] shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                    <label className="flex items-center text-lg mb-3 text-gray-800 dark:text-white">
                      <Code2 className="mr-2" /> ReadyAgentOne Framework
                    </label>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">

                      ReadyAgentOne is a framework intended to be integrated at both a game and agent level to enable an agent to consume and meaningfully respond to in-game world events.<br />
                      It sits on top of the agent layer and serves as an additional action space to enable the agent to respond to events from a game's authority.<br />
                      In the framework we define a set of modifiable and extendible events as well as callbacks for the events that are easily integrable into existing Javascript agent frameworks.
                      <div className="flex space-x-4 justify-around  mt-2">
                        <a href="https://github.com/floAr/ReadyAgentOne/tree/main/ready-agent-one-node" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                          Github 🔗
                        </a>
                        <a href="https://www.npmjs.com/package/@0xspencer/ready-agent-one" target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                          Npm 🔗
                        </a>
                      </div>

                    </p>
                  </div>
                </div>
              </MouseParallaxChild>

              <MouseParallaxChild factorX={parallaxClose} factorY={parallaxMid} className="relative translate-y-6">
                <div className="relative   playful-hover">

                  <div className="rounded-2xl p-6 bg-white dark:bg-[#2d2d2f] shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                    <label className="flex items-center text-lg mb-3 text-gray-800 dark:text-white">
                      <Code2 className="mr-2" /> Powered by
                    </label>
                    <div className="flex space-x-4 justify-around  mt-2">
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
                  </div>
                </div>
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
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div className=' playful-hover-small'>
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl p-4 bg-gray-50 dark:bg-[#3d3d3f] "
                        >
                          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-600 dark:text-gray-300 ">
                            {`[${new Date().toISOString()}] Analyzing market conditions...
Market volatility index: 23.5
Support level identified at $42,850
Resistance zone detected between $44,200 - $44,500
Initiating position scaling strategy...`}
                          </pre>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
              </MouseParallaxChild>
            </motion.div>
          </div>
        </div>

        {/* Agent image positioned globally */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none z-10 "
        >
          <MouseParallaxChild factorX={-parallaxClose} factorY={-parallaxClose} className="relative -translate-y-6 left-10 top-4">
            <img
              src={imgUrl}
              alt="Agent Character"
              className="h-[65vh] w-auto object-contain filter drop-shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            />
          </MouseParallaxChild>
        </motion.div>
        {/* Background image with gradient overlay */}
      </MouseParallaxContainer >
    </div >
  );
}

export default Landing;