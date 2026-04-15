import type { Metadata } from 'next';
import Index from "./index";

export const metadata: Metadata = {
  title: "Join Our Team",
  description: "Join the FreySmiles team!",
};

export default function Careers() {
  return <Index />
}