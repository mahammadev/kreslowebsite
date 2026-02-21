import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { Toaster } from "@/components/ui/toaster";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: settingsData } = await supabase
        .from('settings')
        .select('*');

    // Convert array of {key, value} to a dictionary object
    const initialSettings = (settingsData || []).reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
            </div>

            <p className="text-muted-foreground">
                Manage global store settings like contact details and social links.
            </p>

            <SettingsForm initialSettings={initialSettings} />
            <Toaster />
        </div>
    );
}
