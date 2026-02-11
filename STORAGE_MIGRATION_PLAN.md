# Storage Migration Plan: Supabase → Cloudinary/Wasabi

## Current Implementation
- **Location**: `src/pages/AdminTeachers.tsx`
- **Storage**: Supabase Storage bucket `hero-images`
- **Use Case**: Hero images for teacher profiles
- **File Size Limit**: 5MB
- **Current Flow**: Upload → Supabase Storage → Get public URL → Store URL in database

---

## Option Comparison

### 🎨 **Cloudinary** (Feature-Rich but Expensive)

**Pros:**

**Pros:**
- ✅ **Built-in image optimization** (resize, crop, format conversion, quality optimization)
- ✅ **CDN included** (fast global delivery)
- ✅ **Automatic format conversion** (WebP, AVIF with fallbacks)
- ✅ **Transformations on-the-fly** (no need to store multiple sizes)
- ✅ **Free tier**: 25GB storage, 25GB bandwidth/month
- ✅ **Easy React integration** with `cloudinary-react` or direct upload
- ✅ **Video support** (if needed later)
- ✅ **Admin UI** for managing assets
- ✅ **Automatic responsive images** via URL parameters

**Cons:**
- ❌ More expensive at scale (bandwidth costs)
- ❌ Vendor lock-in (Cloudinary-specific URLs)
- ❌ Overkill if you don't need image transformations

**Pricing:**
- Free: 25GB storage, 25GB bandwidth/month
- Plus ($99/mo): 100GB storage, 100GB bandwidth/month
- Growth ($224/mo): 500GB storage, 500GB bandwidth/month

**Best For:** Image-heavy apps needing optimization, responsive images, multiple formats

---

### 🚀 **Cloudflare Images** (BEST VALUE for Images Only!)

**Pros:**
- ✅ **Extremely cheap**: $1 per 100,000 images stored, $1 per 100,000 images served
- ✅ **Free tier**: 100,000 images/month storage + 100,000 images/month served
- ✅ **Built-in optimization** (automatic WebP/AVIF, resizing, quality optimization)
- ✅ **Global CDN** (Cloudflare's network - fastest in the world)
- ✅ **On-the-fly transformations** (resize, crop, format conversion via URL)
- ✅ **No bandwidth charges** (unlike Cloudinary)
- ✅ **Simple API** (REST-based, easy integration)
- ✅ **Automatic responsive images**

**Cons:**
- ❌ **NO video support** (Cloudflare Images is images only)
- ❌ **Video requires separate product** (Cloudflare Stream - different pricing)
- ❌ Less mature than Cloudinary (newer service)
- ❌ Fewer advanced features than Cloudinary
- ❌ Requires Cloudflare account (but free tier is generous)

**Pricing:**
- **Free**: 100,000 images stored + 100,000 images served/month
- **Paid**: $1 per 100,000 images stored, $1 per 100,000 images served
- **Example**: 1,000 teachers, 1 image each, 10,000 views/month = **$0.11/month** 🎉

**Video Support (Cloudflare Stream - SEPARATE PRODUCT):**
- ❌ **NOT included** with Cloudflare Images
- ✅ **Cloudflare Stream** is a separate product with different pricing:
  - **Storage**: $5 per 1,000 minutes of video stored
  - **Streaming**: $1 per 1,000 minutes of video delivered
  - **Encoding/Transcoding**: **FREE** (included, no extra charge!)
  - **Example**: 100 videos, 5 min each = 500 min stored = **$2.50/month** storage + streaming costs
  - **Total for images + videos**: Images ($0.11) + Stream ($2.50+) = **~$2.61+/month**

**Best For:** Images only (cheapest option), OR images + videos if you're okay with separate products

---

### 🖼️ **ImageKit** (Good Middle Ground)

**Pros:**
- ✅ **Cheaper than Cloudinary**: $49/mo for 200GB storage + 200GB bandwidth
- ✅ **Built-in optimization** (WebP, AVIF, resizing, quality)
- ✅ **CDN included** (Fastly-backed)
- ✅ **On-the-fly transformations**
- ✅ **Free tier**: 20GB storage + 20GB bandwidth/month
- ✅ **Good developer experience**
- ✅ **Real-time image optimization**

**Cons:**
- ❌ More expensive than Cloudflare Images
- ❌ Less generous free tier than Cloudflare
- ❌ Bandwidth costs can add up

**Pricing:**
- Free: 20GB storage, 20GB bandwidth/month
- Growth ($49/mo): 200GB storage, 200GB bandwidth/month
- Scale ($199/mo): 1TB storage, 1TB bandwidth/month

**Best For:** Need Cloudinary features but want better pricing

---

### 🐰 **Bunny.net (Bunny CDN + Storage + Stream)** (BEST FOR VIDEO + IMAGES!)

**Pros:**
- ✅ **Extremely cheap**: $1/TB storage, $0.01/GB bandwidth
- ✅ **Image optimization**: $9.99/mo (unlimited images) OR pay-per-use
- ✅ **Video streaming included**: Bunny Stream for video hosting/transcoding
- ✅ **Video optimization**: Automatic transcoding, multiple formats (MP4, HLS, DASH)
- ✅ **Global CDN** (excellent performance, 100+ locations)
- ✅ **S3-compatible storage** (easy migration)
- ✅ **On-the-fly optimization** for images and videos
- ✅ **No hidden fees** (transparent pricing)
- ✅ **Free tier**: 1GB storage, 1GB bandwidth/month
- ✅ **Video player included** (HTML5 player with customization)
- ✅ **Adaptive bitrate streaming** (HLS/DASH)
- ✅ **Video thumbnails** generation
- ✅ **Video analytics** included

**Cons:**
- ❌ Image optimization requires addon ($9.99/mo) OR pay-per-use
- ❌ Less polished admin UI than Cloudinary
- ❌ More setup required (but well-documented)
- ❌ Video transcoding costs extra (but very cheap)

**Pricing:**
- **Storage**: $1/TB/month (minimum $1/month)
- **Bandwidth**: $0.01/GB (first 1TB), then $0.005/GB
- **Image Optimizer**: $9.99/mo (unlimited) OR $0.01 per 1,000 optimizations
- **Video Storage**: $1/TB/month (same as regular storage)
- **Video Transcoding**: $0.01 per minute of video transcoded
- **Video Streaming Bandwidth**: $0.01/GB (same as regular bandwidth)
- **Example**: 
  - 100GB images + 50GB videos + 500GB bandwidth + optimizer = **~$11/month**
  - 1TB images + 500GB videos + 2TB bandwidth + optimizer = **~$30/month**

**Best For:** Projects needing both images AND videos, cost-effective at scale, S3-compatible workflows

**Video Features:**
- Automatic video transcoding (MP4, HLS, DASH)
- Adaptive bitrate streaming
- Video thumbnails
- Video player (HTML5, customizable)
- Video analytics
- Live streaming support

---

## Video Support Comparison

| Service | Video Support | Video Transcoding | Video Player | Video Cost |
|---------|--------------|-------------------|--------------|------------|
| **Bunny.net** | ✅ Yes (Bunny Stream) | ✅ Automatic | ✅ Included | $0.01/min transcoding |
| **Cloudinary** | ✅ Yes | ✅ Automatic | ✅ Included | Included in plan |
| **Cloudflare Stream** | ✅ Yes (separate product) | ✅ **FREE** (included!) | ✅ Included | $5/1000min stored + $1/1000min streamed |
| **ImageKit** | ❌ No | ❌ No | ❌ No | N/A |
| **Wasabi** | ✅ Storage only | ❌ No (need separate service) | ❌ No | Storage only |

**Video Cost Examples (100 videos, 5 min each = 500 minutes):**
- **Bunny.net**: 500 min transcoding ($5) + storage ($0.50) + bandwidth = **~$6-10/month** ✅
- **Cloudflare Stream**: 500 min stored ($2.50) + streaming ($0.50+) + **FREE encoding** = **~$3-5/month** ✅✅
- **Cloudinary Plus**: Videos included, but plan costs **$99/month** ❌
- **Wasabi + separate transcoding**: Storage cheap, but need to add transcoding service ($$$)

**Key Point: Cloudflare Stream encoding/transcoding is FREE!** You only pay for storage and streaming bandwidth.

---

### 💾 **Wasabi** (Recommended for Simple Storage)

**Pros:**
- ✅ **S3-compatible API** (easy migration, familiar patterns)
- ✅ **Very cheap**: $6.99/TB/month (no egress fees!)
- ✅ **No egress fees** (unlike AWS S3)
- ✅ **Fast performance** (hot cloud storage)
- ✅ **Simple pricing** (no hidden costs)
- ✅ **Can use with existing S3 libraries** (`aws-sdk`, `@aws-sdk/client-s3`)
- ✅ **Good for large files** and bulk storage

**Cons:**
- ❌ **No built-in image optimization** (need separate service or do it yourself)
- ❌ **No CDN included** (can integrate with CloudFront/Cloudflare)
- ❌ **Manual image processing** required
- ❌ **More setup** (need to configure CORS, bucket policies, etc.)

**Pricing:**
- $6.99/TB/month storage
- $0 egress fees (unlimited downloads)
- $0.01 per 1,000 PUT requests
- $0.01 per 10,000 GET requests

**Best For:** Simple file storage, cost-effective at scale, S3-compatible workflows

---

## Recommendation: **Cloudflare Images + Stream** 🎯 (BEST VALUE for Images + Videos!)

**Why Cloudflare Images + Stream?**
1. **FREE video encoding/transcoding** - No charges for video processing! ✅✅✅
2. **Extremely cheap** - Images: $0.11/month, Videos: ~$3-5/month for 500 minutes
3. **Video support** - Cloudflare Stream (separate but integrated product)
4. **Image optimization** - Built-in, automatic WebP/AVIF
5. **Fastest CDN** - Cloudflare's global network
6. **No bandwidth charges for images** - Only pay per image stored/served
7. **Video features** - Transcoding (FREE!), adaptive streaming, player, analytics
8. **Simple pricing** - Pay per image/video minute, no hidden fees

**Cost Comparison (1,000 teachers, 1 image each, 10,000 views/month):**
- **Cloudflare Images**: $0.11/month (images only) ✅✅✅
- **Bunny.net**: ~$1-2/month (storage + bandwidth + optimizer) ✅✅
- **ImageKit Growth**: $49/month (images only, no video) ❌
- **Cloudinary Plus**: $99/month (images + videos, but expensive) ❌

**Cost Comparison (1,000 teachers, images + videos, 100 videos @ 5min each = 500 minutes):**
- **Cloudflare Images + Stream**: ~$3-5/month (images $0.11 + videos $2.50+ with **FREE encoding**!) ✅✅✅
- **Bunny.net**: ~$6-10/month (storage + bandwidth + optimizer + video transcoding $5) ✅✅
- **Cloudinary Plus**: $99/month (includes video, but expensive) ❌
- **ImageKit**: $49/month (images only, no video support) ❌

**Key Advantage: Cloudflare Stream encoding is FREE!**
- Bunny.net: $0.01 per minute transcoded = $5 for 500 minutes
- Cloudflare Stream: **$0 per minute transcoded** = **FREE!**
- You only pay: $5 per 1,000 minutes stored + $1 per 1,000 minutes streamed

**When to choose Cloudflare Images + Stream:**
- ✅ **You need video support** (Cloudflare Stream)
- ✅ **You want FREE video encoding** (huge cost savings!)
- ✅ You want the cheapest option for images + videos
- ✅ You prefer Cloudflare's ecosystem
- ✅ You want separate products (can scale independently)

**When to choose Bunny.net:**
- ✅ You need S3-compatible storage
- ✅ You want everything in one product
- ✅ You prefer pay-per-use transcoding (if you have very few videos)
- ✅ You need more advanced video features

---

## Implementation Plan

### Phase 1: Setup & Configuration

#### For Cloudinary:
1. **Create Cloudinary account** (free tier)
2. **Get credentials**:
   - Cloud Name
   - API Key
   - API Secret
3. **Set environment variables**:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_API_KEY=your_api_key
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
   ```
4. **Create upload preset** in Cloudinary dashboard:
   - Set folder: `hero-images/`
   - Set allowed formats: `jpg, png, webp`
   - Set max file size: 5MB
   - Set unsigned upload (for client-side) or signed (for server-side)

#### For Wasabi:
1. **Create Wasabi account**
2. **Create bucket**: `shikshaq-hero-images`
3. **Configure CORS** for your domain
4. **Set up IAM user** with upload permissions
5. **Set environment variables**:
   ```env
   VITE_WASABI_ACCESS_KEY=your_access_key
   VITE_WASABI_SECRET_KEY=your_secret_key
   VITE_WASABI_BUCKET=shikshaq-hero-images
   VITE_WASABI_REGION=us-east-1
   VITE_WASABI_ENDPOINT=https://s3.wasabisys.com
   ```

---

### Phase 2: Code Changes

#### Option A: Bunny.net Implementation (RECOMMENDED - Best for Images + Videos!)

**1. Create Bunny.net account** (free tier available)

**2. Set up Storage:**
- Create storage zone: `shikshaq-media`
- Note the storage zone name and API key
- Enable public access

**3. Set up Image Optimizer (optional but recommended):**
- Enable Image Optimizer addon ($9.99/mo) OR use pay-per-use
- Configure optimization settings

**4. Set up Video Streaming (if needed):**
- Create video library in Bunny Stream
- Note the video library ID and API key
- Configure transcoding settings

**5. Set environment variables:**
```env
VITE_BUNNY_STORAGE_ZONE=your_storage_zone_name
VITE_BUNNY_STORAGE_API_KEY=your_storage_api_key
VITE_BUNNY_STORAGE_REGION=ny (or de, sg, la, etc.)
VITE_BUNNY_CDN_HOSTNAME=your_cdn_hostname.b-cdn.net
VITE_BUNNY_IMAGE_OPTIMIZER_ENABLED=true
VITE_BUNNY_VIDEO_LIBRARY_ID=your_video_library_id (optional)
VITE_BUNNY_VIDEO_API_KEY=your_video_api_key (optional)
```

**6. Install dependencies:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

**7. Create upload utility** (`src/utils/bunnyUpload.ts`):
```typescript
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Bunny.net uses S3-compatible API
const s3Client = new S3Client({
  region: import.meta.env.VITE_BUNNY_STORAGE_REGION,
  endpoint: `https://storage.bunnycdn.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_BUNNY_STORAGE_ZONE,
    secretAccessKey: import.meta.env.VITE_BUNNY_STORAGE_API_KEY,
  },
  forcePathStyle: true,
});

export async function uploadImageToBunny(file: File, folder: string = 'hero-images'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: import.meta.env.VITE_BUNNY_STORAGE_ZONE,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    },
  });
  
  await upload.done();
  
  // Construct optimized image URL (if optimizer enabled)
  const cdnHostname = import.meta.env.VITE_BUNNY_CDN_HOSTNAME;
  const optimizedUrl = import.meta.env.VITE_BUNNY_IMAGE_OPTIMIZER_ENABLED
    ? `https://${cdnHostname}/${fileName}?width=auto&quality=80&format=webp`
    : `https://${cdnHostname}/${fileName}`;
  
  return optimizedUrl;
}

export async function uploadVideoToBunny(file: File, folder: string = 'videos'): Promise<string> {
  // First upload to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: import.meta.env.VITE_BUNNY_STORAGE_ZONE,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    },
  });
  
  await upload.done();
  
  // If using Bunny Stream, upload to video library for transcoding
  if (import.meta.env.VITE_BUNNY_VIDEO_LIBRARY_ID) {
    const videoLibraryId = import.meta.env.VITE_BUNNY_VIDEO_LIBRARY_ID;
    const videoApiKey = import.meta.env.VITE_BUNNY_VIDEO_API_KEY;
    
    // Upload to Bunny Stream for transcoding
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(
      `https://video.bunnycdn.com/library/${videoLibraryId}/videos`,
      {
        method: 'POST',
        headers: {
          'AccessKey': videoApiKey,
        },
        body: formData,
      }
    );
    
    if (response.ok) {
      const videoData = await response.json();
      // Return video streaming URL
      return `https://vz-${videoLibraryId}.b-cdn.net/${videoData.videoId}/play_480p.mp4`;
    }
  }
  
  // Fallback to direct CDN URL
  const cdnHostname = import.meta.env.VITE_BUNNY_CDN_HOSTNAME;
  return `https://${cdnHostname}/${fileName}`;
}

// Generate optimized image URLs with transformations
export function getBunnyImageUrl(url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
}): string {
  if (!import.meta.env.VITE_BUNNY_IMAGE_OPTIMIZER_ENABLED) {
    return url; // Return original if optimizer not enabled
  }
  
  const params = new URLSearchParams();
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.quality) params.append('quality', options.quality.toString());
  if (options?.format) params.append('format', options.format);
  
  return params.toString() ? `${url}?${params.toString()}` : url;
}
```

**8. Update AdminTeachers.tsx:**
```typescript
import { uploadImageToBunny, uploadVideoToBunny } from '@/utils/bunnyUpload';

const handleImageUpload = async (file: File) => {
  if (!selectedTeacher) return;

  try {
    setUploadingImage(true);
    
    // Upload to Bunny.net
    const imageUrl = await uploadImageToBunny(file);
    
    // Update form data with the new URL
    handleInputChange("Hero Image", imageUrl);
    setImagePreview(imageUrl);
    toast.success('Image uploaded successfully');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error uploading image:', error);
    }
    toast.error('Failed to upload image. Please use a URL instead.');
  } finally {
    setUploadingImage(false);
  }
};

// For video uploads (if you add video support)
const handleVideoUpload = async (file: File) => {
  if (!selectedTeacher) return;

  try {
    setUploadingVideo(true);
    
    // Upload to Bunny.net Stream
    const videoUrl = await uploadVideoToBunny(file);
    
    // Update form data with the new URL
    handleInputChange("Video Link", videoUrl);
    toast.success('Video uploaded successfully');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error uploading video:', error);
    }
    toast.error('Failed to upload video. Please use a URL instead.');
  } finally {
    setUploadingVideo(false);
  }
};
```

#### Option B: Cloudflare Images Implementation (Cheapest for Images Only)

**1. Create Cloudflare account** and enable Images product

**2. Get API token** from Cloudflare dashboard:
- Go to Images → API Tokens
- Create token with upload permissions

**3. Set environment variables**:
```env
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id
VITE_CLOUDFLARE_API_TOKEN=your_api_token
```

**4. Create upload utility** (`src/utils/cloudflareImagesUpload.ts`):
```typescript
export async function uploadToCloudflareImages(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const data = await response.json();
  // Returns optimized image URL with CDN
  return data.result.variants[0]; // Default variant (optimized)
}

// Generate responsive image URLs
export function getCloudflareImageUrl(imageId: string, options?: {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  quality?: number;
}): string {
  const baseUrl = `https://imagedelivery.net/${import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID}/${imageId}`;
  const params = new URLSearchParams();
  
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.fit) params.append('fit', options.fit);
  if (options?.quality) params.append('quality', options.quality.toString());
  
  return params.toString() ? `${baseUrl}/${params.toString()}` : baseUrl;
}
```

**5. Update AdminTeachers.tsx:**
```typescript
import { uploadToCloudflareImages } from '@/utils/cloudflareImagesUpload';

const handleImageUpload = async (file: File) => {
  if (!selectedTeacher) return;

  try {
    setUploadingImage(true);
    
    // Upload to Cloudflare Images
    const imageUrl = await uploadToCloudflareImages(file);
    
    // Update form data with the new URL
    handleInputChange("Hero Image", imageUrl);
    setImagePreview(imageUrl);
    toast.success('Image uploaded successfully');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error uploading image:', error);
    }
    toast.error('Failed to upload image. Please use a URL instead.');
  } finally {
    setUploadingImage(false);
  }
};
```

#### Option B: ImageKit Implementation (Good Middle Ground)

**1. Create ImageKit account** (free tier available)

**2. Get credentials**:
- Public Key
- Private Key
- URL Endpoint

**3. Set environment variables**:
```env
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key
VITE_IMAGEKIT_PRIVATE_KEY=your_private_key
VITE_IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

**4. Create upload utility** (`src/utils/imageKitUpload.ts`):
```typescript
export async function uploadToImageKit(file: File, folder: string = 'hero-images'): Promise<string> {
  // Get authentication token (you'll need to create an API endpoint for this)
  // OR use unsigned upload with public key
  const formData = new FormData();
  formData.append('file', file);
  formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
  formData.append('folder', folder);
  
  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const data = await response.json();
  return data.url; // Returns optimized image URL
}

// Generate transformed URLs
export function getImageKitUrl(url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string {
  const params = new URLSearchParams();
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.quality) params.append('q', options.quality.toString());
  if (options?.format) params.append('f', options.format);
  
  return params.toString() ? `${url}?${params.toString()}` : url;
}
```

#### Option C: Cloudinary Implementation

**1. Install Cloudinary SDK:**
```bash
npm install cloudinary-react cloudinary-core
# OR for direct uploads:
npm install @cloudinary/url-gen @cloudinary/react
```

**2. Create upload utility** (`src/utils/cloudinaryUpload.ts`):
```typescript
import { v2 as cloudinary } from 'cloudinary';

// For client-side unsigned uploads
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'hero-images');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const data = await response.json();
  return data.secure_url; // Returns optimized image URL
}

// Optional: Generate responsive image URLs
export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const transformations = [
    options?.width && `w_${options.width}`,
    options?.height && `h_${options.height}`,
    options?.quality && `q_${options.quality}`,
    options?.format && `f_${options.format}`,
    'c_fill', // Crop mode
  ].filter(Boolean).join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}
```

**3. Update AdminTeachers.tsx:**
```typescript
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';

const handleImageUpload = async (file: File) => {
  if (!selectedTeacher) return;

  try {
    setUploadingImage(true);
    
    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(file);
    
    // Update form data with the new URL
    handleInputChange("Hero Image", imageUrl);
    setImagePreview(imageUrl);
    toast.success('Image uploaded successfully');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error uploading image:', error);
    }
    toast.error('Failed to upload image. Please use a URL instead.');
  } finally {
    setUploadingImage(false);
  }
};
```

#### Option B: Wasabi Implementation

**1. Install AWS SDK (S3-compatible):**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

**2. Create upload utility** (`src/utils/wasabiUpload.ts`):
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({
  region: import.meta.env.VITE_WASABI_REGION,
  endpoint: import.meta.env.VITE_WASABI_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_WASABI_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_WASABI_SECRET_KEY,
  },
  forcePathStyle: true, // Required for Wasabi
});

export async function uploadToWasabi(file: File, teacherId: number): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `hero-images/${teacherId}-${Date.now()}.${fileExt}`;
  
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: import.meta.env.VITE_WASABI_BUCKET,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read', // Make file publicly accessible
    },
  });
  
  await upload.done();
  
  // Construct public URL
  const publicUrl = `${import.meta.env.VITE_WASABI_ENDPOINT}/${import.meta.env.VITE_WASABI_BUCKET}/${fileName}`;
  return publicUrl;
}
```

**3. Update AdminTeachers.tsx:**
```typescript
import { uploadToWasabi } from '@/utils/wasabiUpload';

const handleImageUpload = async (file: File) => {
  if (!selectedTeacher) return;

  try {
    setUploadingImage(true);
    
    // Upload to Wasabi
    const imageUrl = await uploadToWasabi(file, selectedTeacher.id);
    
    // Update form data with the new URL
    handleInputChange("Hero Image", imageUrl);
    setImagePreview(imageUrl);
    toast.success('Image uploaded successfully');
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error uploading image:', error);
    }
    toast.error('Failed to upload image. Please use a URL instead.');
  } finally {
    setUploadingImage(false);
  }
};
```

---

### Phase 3: Migration Strategy

**Option 1: Gradual Migration (Recommended)**
- Keep existing Supabase URLs working
- New uploads go to Cloudinary/Wasabi
- Migrate old images gradually (or leave them as-is)

**Option 2: Full Migration**
- Migrate all existing images to new storage
- Update all database URLs
- Remove Supabase Storage dependency

---

### Phase 4: Additional Considerations

#### Security
- **Cloudinary**: Use unsigned uploads with upload presets (safer for client-side)
- **Wasabi**: Keep API keys in environment variables (never commit)
- **Both**: Validate file types and sizes on client AND server (if you add a backend)

#### Image Optimization (Cloudinary)
- Use `f_auto` for automatic format selection
- Use `q_auto` for automatic quality optimization
- Use `w_auto` with `dpr_auto` for responsive images
- Example: `https://res.cloudinary.com/your-cloud/image/upload/w_800,q_auto,f_auto/hero-images/123.jpg`

#### CDN (Wasabi)
- Integrate with Cloudflare (free CDN)
- Or use Wasabi's built-in CDN (additional cost)

#### Error Handling
- Retry logic for failed uploads
- Progress indicators for large files
- Fallback to URL input if upload fails

---

## Cost Comparison (Estimated)

### Scenario: 1000 teachers, 1 image each, 500KB average

**Cloudinary (Free Tier):**
- Storage: 0.5GB = Free (within 25GB limit)
- Bandwidth: ~50GB/month = Free (within 25GB limit)
- **Total: $0/month** ✅

**Wasabi:**
- Storage: 0.5GB = $0.0035/month
- Requests: ~1000 PUTs = $0.01/month
- **Total: ~$0.01/month** ✅

**At Scale (10,000 teachers, 5GB storage, 500GB bandwidth/month):**

**Cloudinary:**
- Plus Plan: $99/month
- Or Growth Plan: $224/month

**Wasabi:**
- Storage: 5GB = $0.035/month
- Bandwidth: $0 (no egress fees!)
- **Total: ~$0.04/month** ✅

---

## Recommendation Summary

**Choose Cloudinary if:**
- ✅ You want automatic image optimization
- ✅ You need responsive images
- ✅ You want format optimization (WebP/AVIF)
- ✅ You're staying under free tier limits initially
- ✅ You prioritize developer experience

**Choose Wasabi if:**
- ✅ You need simple, cheap storage
- ✅ You're storing large files
- ✅ You want S3-compatible storage
- ✅ You're planning for very high scale
- ✅ You can handle image optimization separately

---

## Next Steps

1. **Decide**: Cloudinary or Wasabi?
2. **Set up account** and get credentials
3. **Add environment variables** to `.env.local` and Vercel
4. **Create upload utility** file
5. **Update AdminTeachers.tsx** to use new upload function
6. **Test upload** functionality
7. **Deploy** and verify in production

---

**Questions to Consider:**
- Do you need image optimization? → Cloudinary
- Do you need to store other file types (videos, PDFs)? → Wasabi
- What's your expected scale? → Wasabi for very high scale
- Do you want the simplest solution? → Cloudinary

