'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Loader2, Wand2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { translateText } from '@/lib/actions/translate';
import Image from 'next/image';

const formSchema = z.object({
  name_az: z.string().min(1, 'Name (AZ) is required'),
  name_ru: z.string().min(1, 'Name (RU) is required'),
  name_en: z.string().min(1, 'Name (EN) is required'),
  slug: z.string().min(1, 'Slug is required'),
  description_az: z.string().optional(),
  description_ru: z.string().optional(),
  description_en: z.string().optional(),
  discount_percentage: z.coerce.number().min(1).max(100),
  is_active: z.boolean(),
  product_ids: z.array(z.string()),
});

interface BundleFormProps {
  mode: 'create' | 'edit';
  bundle?: any;
  allProducts: any[];
}

export function BundleForm({ mode, bundle, allProducts }: BundleFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_az: bundle?.name_az || '',
      name_ru: bundle?.name_ru || '',
      name_en: bundle?.name_en || '',
      slug: bundle?.slug || '',
      description_az: bundle?.description_az || '',
      description_ru: bundle?.description_ru || '',
      description_en: bundle?.description_en || '',
      discount_percentage: bundle?.discount_percentage || 10,
      is_active: bundle?.is_active ?? true,
      product_ids: bundle?.product_ids || [],
    },
  });

  useEffect(() => {
    if (bundle?.products) {
      const productIds = bundle.products.map((p: any) => p.id || p.product_id);
      setSelectedProducts(productIds);
      form.setValue('product_ids', productIds);
    }
  }, [bundle, form]);

  const filteredProducts = allProducts.filter((p) =>
    p.name_az.toLowerCase().includes(productSearch.toLowerCase())
  );

  const toggleProduct = (productId: string) => {
    const current = form.getValues('product_ids');
    const isSelected = current.includes(productId);
    const newValue = isSelected
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    form.setValue('product_ids', newValue, { shouldDirty: true });
    setSelectedProducts(newValue);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bundleData = {
      name_az: values.name_az,
      name_ru: values.name_ru,
      name_en: values.name_en,
      slug: values.slug,
      description_az: values.description_az || null,
      description_ru: values.description_ru || null,
      description_en: values.description_en || null,
      discount_percentage: values.discount_percentage,
      is_active: values.is_active,
    };

    let bundleId = bundle?.id;

    if (mode === 'edit' && bundleId) {
      const { error } = await supabase
        .from('bundles')
        .update(bundleData)
        .eq('id', bundleId);

      if (error) {
        console.error('Update failed:', error);
        return;
      }

      await supabase.from('bundle_items').delete().eq('bundle_id', bundleId);
    } else {
      const { data, error } = await supabase
        .from('bundles')
        .insert(bundleData)
        .select('id')
        .single();

      if (error) {
        console.error('Insert failed:', error);
        return;
      }

      bundleId = data.id;
    }

    if (values.product_ids.length > 0 && bundleId) {
      const bundleItems = values.product_ids.map((productId) => ({
        bundle_id: bundleId,
        product_id: productId,
      }));

      const { error: itemsError } = await supabase
        .from('bundle_items')
        .insert(bundleItems);

      if (itemsError) {
        console.error('Bundle items insert failed:', itemsError);
      }
    }

    setOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!bundle?.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      await supabase.from('bundle_items').delete().eq('bundle_id', bundle.id);
      const { error } = await supabase.from('bundles').delete().eq('id', bundle.id);

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

  async function handleTranslate() {
    const textAz = form.getValues('name_az');
    if (!textAz) return;

    setIsTranslating(true);
    try {
      const [ru, en] = await Promise.all([
        translateText(textAz, 'az', 'ru'),
        translateText(textAz, 'az', 'en'),
      ]);

      if (ru) form.setValue('name_ru', ru);
      if (en) form.setValue('name_en', en);
    } catch (e) {
      console.error('Translation failed', e);
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button><Plus className="mr-2 h-4 w-4" /> Create Bundle</Button>
        ) : (
          <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto w-full sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Bundle' : 'Edit Bundle'}</DialogTitle>
          <DialogDescription>
            Create a bundle offer - customers save when buying multiple products together.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
              <FormField control={form.control} name="name_az" render={({ field }) => (
                <FormItem><FormLabel>Name (AZ)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleTranslate}
                disabled={isTranslating}
                title="Auto-translate to RU and EN"
              >
                {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4 text-primary" />}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name_ru" render={({ field }) => (
                <FormItem><FormLabel>Name (RU)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="name_en" render={({ field }) => (
                <FormItem><FormLabel>Name (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="discount_percentage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl><Input type="number" min={1} max={100} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-medium cursor-pointer">Active (Visible on storefront)</FormLabel>
              </FormItem>
            )} />

            {/* Product Selection */}
            <div className="space-y-3">
              <FormLabel>Select Products for Bundle</FormLabel>
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              <div className="border rounded-md max-h-60 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No products found</div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 border-b last:border-b-0 ${
                        selectedProducts.includes(product.id) ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                        <Image src={product.image_url} alt={product.name_az} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name_az}</p>
                        <p className="text-sm text-muted-foreground">{product.price} AZN</p>
                      </div>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                    </div>
                  ))
                )}
              </div>
              <FormDescription>
                Selected: {selectedProducts.length} product(s). Customers will save {form.watch('discount_percentage')}% when buying all together.
              </FormDescription>
            </div>

            <DialogFooter className="flex-row justify-between sm:justify-between pt-4 border-t">
              {mode === 'edit' ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {confirmDelete ? 'Confirm Delete' : 'Delete'}
                </Button>
              ) : (
                <div />
              )}
              <Button type="submit" disabled={isDeleting}>
                {mode === 'create' ? 'Create Bundle' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
