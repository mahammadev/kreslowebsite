import { Sidebar } from '@/components/admin/Sidebar';
import { ReactNode } from 'react';
import { cache } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Deduplicate the user fetch request across any nested components in this layout tree
const getUser = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // This is a layout, we only read cookies here, mutations happen in Server Actions
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {

  // Authenticate at the layout level
  const user = await getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14 lg:pl-0">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
