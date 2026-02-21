'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Loader2, Wand2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { compressForUpload } from '@/lib/image-compress';
import Image from 'next/image';
import { translateText } from '@/lib/actions/translate';

const formSchema = z.object({
  name_az: z.string().min(1, 'Name (AZ) is required'),
  name_ru: z.string().min(1, 'Name (RU) is required'),
  name_en: z.string().min(1, 'Name (EN) is required'),
  slug: z.string().min(1, 'Slug is required'),
  description_az: z.string().optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  category_id: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  discount_price: z.string().optional(),
  image_url: z.string().min(1, 'Image is required'),
  is_active: z.boolean(),
  in_stock: z.boolean(),
});

interface ProductFormProps {
  mode: 'create' | 'edit';
  product?: any;
  categories: any[];
}

export function ProductForm({ mode, product, categories }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isTranslatingName, setIsTranslatingName] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_az: product?.name_az || '',
      name_ru: product?.name_ru || '',
      name_en: product?.name_en || '',
      slug: product?.slug || '',
      description_az: product?.description_az || '',
      description_ru: product?.description_ru || '',
      description_en: product?.description_en || '',
      category_id: product?.category_id || undefined,
      price: product?.price || 0,
      discount_price: product?.discount_price ? String(product.discount_price) : '',
      image_url: product?.image_url || '',
      is_active: product?.is_active ?? true,
      in_stock: product?.in_stock ?? true,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const compressed = await compressForUpload(file);
      const filename = `products/${Date.now()}-${compressed.name}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filename, compressed, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename);

      form.setValue('image_url', publicUrl);
    } catch (error: any) {
      console.error('Upload failed:', error.message);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      id: mode === 'edit' ? product.id : undefined,
      discount_price: values.discount_price ? Number(values.discount_price) : null,
    };

    if (mode === 'create') {
      delete (payload as any).id;
    }

    const { error } = await supabase
      .from('products')
      .upsert(payload);

    if (error) {
      console.error(error);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!product?.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {mode === 'create' ? (
          <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
        ) : (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{mode === 'create' ? 'Add Product' : 'Edit Product'}</SheetTitle>
          <SheetDescription>
            {mode === 'create' ? 'Create a new product.' : 'Make changes to the product.'}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              <FormField control={form.control} name="name_az" render={({ field }) => (
                <FormItem><FormLabel>Name (AZ)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name_ru" render={({ field }) => (
                <FormItem><FormLabel>Name (RU)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name_en" render={({ field }) => (
                <FormItem><FormLabel>Name (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="slug" render={({ field }) => (
              <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="category_id" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_az}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="space-y-2">
              <FormLabel>Description (AZ)</FormLabel>
              <FormField control={form.control} name="description_az" render={({ field }) => (
                <FormItem><FormControl><Textarea placeholder="AZ Description" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Price (AZN)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="discount_price" render={({ field }) => (
                <FormItem><FormLabel>Discount Price</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="image_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <div className="flex flex-col gap-4">
                  {field.value && (
                    <div className="relative h-40 w-full overflow-hidden rounded-md border">
                      <Image src={field.value} alt="Product" fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-4">
              <FormField control={form.control} name="is_active" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )} />
              <FormField control={form.control} name="in_stock" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>In Stock</FormLabel>
                </FormItem>
              )} />
            </div>

            <SheetFooter className="flex-row justify-between sm:justify-between">
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || uploading}
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {confirmDelete ? 'Confirm Delete' : 'Delete'}
                </Button>
              )}
              <Button type="submit" disabled={uploading || isDeleting}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Product
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
