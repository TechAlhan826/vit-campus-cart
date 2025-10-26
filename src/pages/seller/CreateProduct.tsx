import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Tag,
  Package
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { createProductSchema, CreateProductFormData } from '@/lib/validations';

const CreateProduct = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { toast } = useToast();
  
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      condition: 'used',
      category: 'Others',
      stock: 1,
    }
  });

  // Inside CreateProduct.tsx

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
        // In a real app, you'd upload to a service like Cloudinary or AWS S3
        // For now, we'll create a object URL for preview
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls].slice(0, 5); // Max 5 images
      setImages(newImages);
      setValue('images', newImages);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
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
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: CreateProductFormData) => {
    try {
      console.log('Creating product with data:', { ...data, images, tags });
      
      // Backend expects POST /api/products/create
      const response = await api.post('/api/products/create', {
        ...data,
        images,
        tags,
      });

      console.log('Create product response:', response);

      if (response?.success || response?.data) {
        toast({
          title: "Product created",
          description: "Your product has been listed successfully",
        });
        navigate('/seller/products');
      } else {
        throw new Error('No success response');
      }
    } catch (error: any) {
      console.error('Create product error:', error);
      toast({
        title: "Failed to create product",
        description: error?.response?.data?.message || error?.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/seller/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Add New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Digital Signal Processing by Proakis"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail - condition, features, etc."
                      rows={4}
                      {...register('description')}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        onValueChange={(value) => setValue('category', value)}
                        defaultValue="Others"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        onValueChange={(value: 'new' | 'used') => setValue('condition', value)}
                        defaultValue="used"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.condition && (
                        <p className="text-sm text-destructive">{errors.condition.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        placeholder="450"
                        {...register('price', { valueAsNumber: true })}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="1"
                        placeholder="1"
                        {...register('stock', { valueAsNumber: true })}
                      />
                      {errors.stock && (
                        <p className="text-sm text-destructive">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Product Images</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {images.length === 0 ? 'Add Images' : 'Add More'}
                          </span>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                  
                  <p className="text-sm text-text-muted">
                    Add up to 5 images. First image will be the main product image.
                  </p>
                  
                  {errors.images && (
                    <p className="text-sm text-destructive">{errors.images.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags (Optional)
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., textbook, electronics)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="btn-hero flex-1"
                    disabled={isSubmitting || images.length === 0}
                  >
                    {isSubmitting ? 'Creating Product...' : 'List Product'}
                  </Button>
                  
                  <Button type="button" variant="outline" asChild>
                    <Link to="/seller/products">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.length > 0 && (
                <img
                  src={images[0]}
                  alt="Product preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h3 className="font-semibold line-clamp-2">
                  {watch('title') || 'Product Title'}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {watch('category') || 'Category'}
                </p>
                <p className="text-lg font-bold text-primary mt-2">
                  ₹{watch('price') || '0'}
                </p>
              </div>
              
              {watch('description') && (
                <p className="text-sm text-text-secondary line-clamp-3">
                  {watch('description')}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="p-4 bg-surface">
            <CardContent className="p-0 text-sm space-y-2">
              <h4 className="font-medium">Tips for better listing</h4>
              <div className="text-text-secondary space-y-1">
                <div>✓ Use clear, well-lit photos</div>
                <div>✓ Write detailed descriptions</div>
                <div>✓ Set competitive prices</div>
                <div>✓ Add relevant tags for searchability</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;