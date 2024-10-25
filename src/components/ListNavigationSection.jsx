'use client'

import { usePathname } from "next/navigation"
import Link from 'next/link'

import { navigation } from "@/components/Navigation"

export function ListNavigationSection() {
  const currentPath = usePathname();
  const section = navigation.filter(section => section.link === currentPath);
  const links = section.length > 0 ? section[0].links : [];
  return (
    <ul>
      { links.map(link => <li key={link.href}><Link href={link.href}>{link.title}</Link></li>) }
      </ul>
  );
}

