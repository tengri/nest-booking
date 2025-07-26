# R2 URL and CORS Solution

## Issue: Status 0 and null body when accessing uploaded images

The problem is that R2 public URLs need to be configured properly for public access.

## Solution 1: Configure R2 Public URL

1. **Go to Cloudflare Dashboard → R2 Object Storage**
2. **Select your bucket (aigerus)**
3. **Go to "Settings" tab**
4. **Enable "Public URL"** - This will give you a public URL like:
   ```
   https://pub-<hash>.r2.dev/aigerus/uploads/filename.webp
   ```

5. **Add the public URL to your .env file:**
   ```env
   R2_PUBLIC_URL=https://pub-<your-hash>.r2.dev
   ```

## Solution 2: Update S3Service to use correct URL format

Update the URL generation in `s3.service.ts`:

```typescript
// Return the public URL for R2
const publicUrl = this.configService.get<string>('R2_PUBLIC_URL');
const url = publicUrl 
  ? `${publicUrl}/${this.bucketName}/${key}`
  : `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucketName}/${key}`;
```

## Solution 3: Configure CORS in R2

1. **Go to your R2 bucket settings**
2. **Add CORS configuration:**
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

## Solution 4: Use Backend Proxy (Alternative)

If CORS issues persist, use the proxy endpoint I added:

```typescript
// Access images through your backend
GET /flats/:flatId/files/proxy/:filename
```

## Testing

1. **Upload a file:**
   ```bash
   curl -X POST http://localhost:3000/flats/68845ed95cb54527924baa73/files \
     -F "file=@test-image.webp" \
     -F "type=image"
   ```

2. **Check the returned URL in the response**

3. **Test the URL directly in browser or with curl**

## Debug Steps

1. Check the console logs for the generated URL
2. Try accessing the URL directly in browser
3. Check if the file exists in R2 bucket
4. Verify CORS settings in R2

## Common Issues

- **Status 0**: Usually CORS or network connectivity
- **404**: File not found in R2
- **403**: R2 permissions issue
- **CORS error**: Need to configure CORS in R2 bucket

## Quick Fix

The fastest solution is to enable the R2 Public URL in your bucket settings and update the environment variable. 