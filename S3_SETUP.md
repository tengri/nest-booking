# Cloudflare R2 File Upload Setup

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your-bucket-name
```

## Cloudflare R2 Setup

1. **Create an R2 Bucket:**
   - Go to Cloudflare Dashboard
   - Navigate to R2 Object Storage
   - Create a new bucket with a unique name
   - Configure bucket settings (recommendations):
     - Enable versioning (optional)
     - Configure CORS if needed for direct uploads

2. **Configure CORS (if needed):**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Create API Token:**
   - Go to Cloudflare Dashboard > My Profile > API Tokens
   - Create a new token with the following permissions:
     - **Account Resources:** Include > All accounts
     - **Zone Resources:** Include > All zones
     - **Permissions:** Object Storage > Edit
   - Copy the Access Key ID and Secret Access Key
   - Add them to your `.env` file

4. **Get Account ID:**
   - Your Account ID can be found in the Cloudflare Dashboard
   - It's displayed in the right sidebar or in the URL when you're logged in

## Usage

The R2 service is now integrated into your file upload system. When you upload files through the `/flats/:flatId/files` endpoint, they will be:

1. Processed with Sharp (resized to 1024px, converted to WebP)
2. Uploaded to R2 with public read access
3. Stored with metadata (width, height, URL)

## Features

- **Image Processing:** Automatic resizing and WebP conversion
- **Public URLs:** Files are uploaded with public read access
- **File Deletion:** Support for deleting files from R2
- **Presigned URLs:** Generate temporary upload URLs (if needed)
- **S3-Compatible:** Uses the same AWS SDK for S3-compatible operations

## Error Handling

The service includes proper error handling for:
- R2 upload failures
- Image processing errors
- Invalid file types
- Network issues
- Missing configuration variables

## Benefits of R2 over S3

- **Lower Costs:** No egress fees
- **Global CDN:** Built-in Cloudflare CDN
- **S3-Compatible API:** Easy migration from S3
- **Better Performance:** Global edge locations 