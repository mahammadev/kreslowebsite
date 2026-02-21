import { ReelsLanding } from "@/components/storefront/ReelsLanding";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col bg-black font-sans overflow-hidden">
      <main className="flex-1">
        <ReelsLanding />
      </main>
    </div>
  );
}
