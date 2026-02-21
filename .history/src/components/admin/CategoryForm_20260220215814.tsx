'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name_az: z.string().min(1, 'Name (AZ) is required'),
  name_ru: z.string().min(1, 'Name (RU) is required'),
  name_en: z.string().min(1, 'Name (EN) is required'),
  slug: z.string().min(1, 'Slug is required'),
  sort_order: z.coerce.number(),
  is_active: z.boolean(),
});

interface CategoryFormProps {
  mode: 'create' | 'edit';
  category?: any;
}

export function CategoryForm({ mode, category }: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_az: category?.name_az || '',
      name_ru: category?.name_ru || '',
      name_en: category?.name_en || '',
      slug: category?.slug || '',
      sort_order: category?.sort_order || 0,
      is_active: category?.is_active ?? true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = mode === 'edit' ? { ...values, id: category.id } : values;

    const { error } = await supabase
      .from('categories')
      .upsert(payload);

    if (error) {
      console.error(error);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!category?.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      setOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error('Delete failed:', error.message);
      alert('Delete failed: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
        ) : (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Category' : 'Edit Category'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Create a new category.' : 'Make changes to the category.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <FormField control={form.control} name="name_az" render={({ field }) => (
                <FormItem><FormLabel>AZ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name_ru" render={({ field }) => (
                <FormItem><FormLabel>RU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name_en" render={({ field }) => (
                <FormItem><FormLabel>EN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="sort_order" render={({ field }) => (
              <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none"><FormLabel>Active</FormLabel></div>
              </FormItem>
            )} />

            <DialogFooter className="flex-row justify-between sm:justify-between">
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : confirmDelete ? 'Confirm' : 'Delete'}
                </Button>
              )}
              <Button type="submit" disabled={isDeleting}>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
