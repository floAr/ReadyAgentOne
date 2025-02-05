import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    links: { href: string; label: string }[];
}

const Card: React.FC<CardProps> = ({ icon: Icon, title, children, links }) => {
    return (
        <div className="relative playful-hover">
            <div className="rounded-2xl p-6 bg-white dark:bg-[#2d2d2f] shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                <label className="flex items-center text-lg mb-3 text-gray-800 dark:text-white">
                    <Icon className="mr-2" /> {title}
                </label>
                <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {children}
                    <div className="flex space-x-4 justify-around mt-2">
                        {links.map((link, index) => (
                            <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className='playful-hover-small'>
                                {link.label} 🔗
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
