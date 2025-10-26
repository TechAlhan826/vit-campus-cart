import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X, Plus, Tag, Package } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { createProductSchema, CreateProductFormData } from '@/lib/validations';
import { Product } from '@/types';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useApi();
  const { toast } = useToast();
  
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      const product: Product = response?.data?.product || response?.data;
      
      if (product) {
        // Populate form with existing data
        reset({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          condition: product.condition,
          stock: product.stock || 1,
        });
        setImages(product.images || []);
        setTags(product.tags || []);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Textbooks & Study Materials',
    'Electronics & Gadgets',
    'Hostel Essentials',
    'Sports & Recreation',
    'Fashion & Accessories',
    'Lab Equipment',
    'Others',
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls].slice(0, 5);
      setImages(newImages);
      setValue('images', newImages);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue('images', newImages);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: CreateProductFormData) => {
    // Validate that we have at least one image
    if (!images || images.length === 0) {
      toast({
        title: "Validation error",
        description: "Please add at least one image",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        condition: data.condition,
        stock: Number(data.stock || 1),
        images: images,
        tags: tags,
      };

      console.log('[EditProduct] Updating product with payload:', payload);
      
      // Backend expects PUT /api/products/update/:id
      const response = await api.put(`/api/products/update/${id}`, payload);

      console.log('[EditProduct] Update response:', response);

      if (response?.success || response?.data) {
        toast({
          title: "Product updated",
          description: "Your product has been updated successfully",
        });
        navigate('/seller/products');
      } else {
        throw new Error('Update failed - no success response from server');
      }
    } catch (error: any) {
      console.error('[EditProduct] Update error:', error);
      toast({
        title: "Failed to update product",
        description: error?.response?.data?.message || error?.message || 'An error occurred while updating the product',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <p>Loading product...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/seller/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Edit Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="e.g., Data Structures Textbook"
                    className="mt-1"
                  />
                  {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe your product in detail..."
                    className="mt-1 min-h-32"
                  />
                  {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
                </div>

                {/* Price & Stock */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="mt-1"
                    />
                    {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                      placeholder="1"
                      className="mt-1"
                    />
                    {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
                  </div>
                </div>

                {/* Category & Condition */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue('category', value)} defaultValue={undefined}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select onValueChange={(value) => setValue('condition', value as 'new' | 'used')} defaultValue="used">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Brand New</SelectItem>
                        <SelectItem value="used">Used - Good</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.condition && <p className="text-sm text-destructive mt-1">{errors.condition.message}</p>}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <Label>Product Images (Max 5)</Label>
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {images.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border overflow-hidden">
                          <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => removeImage(idx)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload</span>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Add tags..."
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link to="/seller/products">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
