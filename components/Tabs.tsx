import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  OutlineHomeIcon,
  OutlineProfileIcon,
  OutlineFeedIcon,
  OutlineLifelogIcon,
  FilledHomeIcon,
  FilledFeedIcon,
  FilledLifelogIcon,
  FilledProfileIcon,
} from '../dynamic/Tabs';

export default function Tabs() {
  const TabLinks = [
    {
      name: 'Home',
      icon: <OutlineHomeIcon />,
      activeIcon: <FilledHomeIcon />,
      link: '/',
    },
    {
      name: 'Feed',
      icon: <OutlineFeedIcon />,
      activeIcon: <FilledFeedIcon />,
      link: '/feed',
    },
    {
      name: 'LifeLog',
      icon: <OutlineLifelogIcon />,
      activeIcon: <FilledLifelogIcon />,
      link: '/lifelog',
    },
    {
      name: 'Profile',
      icon: <OutlineProfileIcon />,
      activeIcon: <FilledProfileIcon />,
      link: '/profile',
    },
  ];
  const router = useRouter();

  const TabLink = ({ tab, index, active }) => {
    if (tab.link === '/') {
      return (
        <a href={tab.link} key={index}>
          {active ? tab.activeIcon : tab.icon}
        </a>
      );
    } else {
      return (
        <Link href={tab.link} key={index}>
          {active ? tab.activeIcon : tab.icon}
        </Link>
      );
    }
  };

  return (
    <div className="z-20 w-full">
      <section className="fixed inset-x-0 bottom-0 z-10 block bg-white p-4 shadow">
        <div className="flex justify-around">
          {TabLinks.map((tab, index) => {
            const active = router.pathname === tab.link;
            return (
              <TabLink tab={tab} index={index} active={active} key={tab.name} />
            );
          })}
        </div>
      </section>
    </div>
  );
}
