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
    site_title: z.string().min(1, 'Site Title is required'),
    logo_url: z.string().optional(),
    favicon_url: z.string().optional(),
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
            site_title: initialSettings['site_title'] || 'Kreslo Ofis',
            logo_url: initialSettings['logo_url'] || '',
            favicon_url: initialSettings['favicon_url'] || '',
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_url' | 'favicon_url') => {
        if (!e.target.files || e.target.files.length === 0) return;
        setSaving(true);
        try {
            const file = e.target.files[0];
            const { compressForUpload } = await import('@/lib/image-compress');
            const compressed = await compressForUpload(file);
            const filename = `branding/${Date.now()}-${compressed.name}`;

            const { error } = await supabase.storage
                .from('product-images')
                .upload(filename, compressed, { upsert: true });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filename);

            form.setValue(fieldName, publicUrl, { shouldDirty: true });
        } catch (error: any) {
            console.error('Upload failed:', error.message);
            alert('Upload failed: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="rounded-md border p-6 bg-card text-card-foreground">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2">Branding (Logo & Title)</h3>

                        <FormField control={form.control} name="site_title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website Title</FormLabel>
                                <FormControl><Input placeholder="Kreslo Ofis" {...field} /></FormControl>
                                <FormDescription>This will appear in the browser tab and search results.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="logo_url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site Logo</FormLabel>
                                    <div className="flex flex-col gap-4">
                                        {field.value && (
                                            <div className="relative h-20 w-48 overflow-hidden rounded-md border flex items-center justify-center bg-zinc-50 p-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={field.value} alt="Logo" className="max-h-full max-w-full object-contain" />
                                            </div>
                                        )}
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'logo_url')}
                                                disabled={saving}
                                                className="cursor-pointer bg-background"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormDescription>Upload a logo for the website navigation bar (transparent PNG recommended).</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="favicon_url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Favicon</FormLabel>
                                    <div className="flex flex-col gap-4">
                                        {field.value && (
                                            <div className="relative h-16 w-16 overflow-hidden rounded-md border flex items-center justify-center bg-zinc-50 p-2">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={field.value} alt="Favicon" className="max-h-full max-w-full object-contain" />
                                            </div>
                                        )}
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'favicon_url')}
                                                disabled={saving}
                                                className="cursor-pointer bg-background"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormDescription>Upload a small square icon for the browser tab.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

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
