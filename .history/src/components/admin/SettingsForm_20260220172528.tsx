'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';

const formSchema = z.object({
    whatsapp_number: z.string().min(1, 'WhatsApp number is required'),
    instagram_url: z.string().optional(),
    facebook_url: z.string().optional(),
    contact_email: z.string().email().optional().or(z.literal('')),
});

interface SettingsFormProps {
    initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            whatsapp_number: initialSettings['whatsapp_number'] || '',
            instagram_url: initialSettings['instagram_url'] || '',
            facebook_url: initialSettings['facebook_url'] || '',
            contact_email: initialSettings['contact_email'] || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSaving(true);

        const updates = Object.entries(values).map(([key, value]) => ({
            key,
            value: value || '',
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('settings')
            .upsert(updates, { onConflict: 'key' });

        setSaving(false);

        if (error) {
            console.error(error);
            alert('Error saving settings: ' + error.message);
            return;
        }

        alert('Settings successfully updated!');
        router.refresh();
    }

    return (
        <div className="rounded-md border p-6 bg-card text-card-foreground">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                        <FormField control={form.control} name="whatsapp_number" render={({ field }) => (
                            <FormItem>
                                <FormLabel>WhatsApp Number</FormLabel>
                                <FormControl><Input placeholder="994551234567" {...field} /></FormControl>
                                <FormDescription>Used for the &quot;Order via WhatsApp&quot; button. Ensure it includes country code without +</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="contact_email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Email</FormLabel>
                                <FormControl><Input placeholder="info@kresloofis.az" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-medium border-b pb-2">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="instagram_url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram URL</FormLabel>
                                    <FormControl><Input placeholder="https://instagram.com/kresloofis" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="facebook_url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facebook URL</FormLabel>
                                    <FormControl><Input placeholder="https://facebook.com/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    <Button type="submit" disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Settings
                    </Button>
                </form>
            </Form>
        </div>
    );
}
