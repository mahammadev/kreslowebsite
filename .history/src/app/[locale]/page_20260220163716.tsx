import { Hero } from "@/components/storefront/Hero";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}
