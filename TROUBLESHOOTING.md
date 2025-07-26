# File Upload Troubleshooting Guide

## Issue: 400/500 Error on File Upload

### Root Cause
The 400/500 error is likely caused by missing R2 environment variables. The S3Service requires these variables to initialize properly.

### Solution

1. **Create a `.env` file in the `back` directory with the following variables:**

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/aigerus

# File Upload Configuration
UPLOADS_URL=http://localhost:3000/uploads

# Cloudflare R2 Configuration (Required for file uploads)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

2. **Get your Cloudflare R2 credentials:**
   - Go to Cloudflare Dashboard
   - Navigate to R2 Object Storage
   - Create a bucket
   - Go to "Manage R2 API tokens"
   - Create a new token with Object Storage permissions
   - Copy the Access Key ID and Secret Access Key

3. **Find your Account ID:**
   - In Cloudflare Dashboard, look at the right sidebar
   - Or check the URL when logged in: `https://dash.cloudflare.com/<account-id>`

### Testing Steps

1. **Test basic file upload (without R2):**
   ```bash
   curl -X POST http://localhost:3000/flats/68845ed95cb54527924baa73/files/test-upload \
     -F "file=@your-image.webp" \
     -F "type=image"
   ```

2. **Test R2 upload (after setting environment variables):**
   ```bash
   curl -X POST http://localhost:3000/flats/68845ed95cb54527924baa73/files/test-r2 \
     -F "file=@your-image.webp"
   ```

3. **Test full upload endpoint:**
   ```bash
   curl -X POST http://localhost:3000/flats/68845ed95cb54527924baa73/files \
     -F "file=@your-image.webp" \
     -F "type=image"
   ```

### Common Issues

1. **400 Bad Request:**
   - Check that `type` is exactly `"image"` (not `"IMAGE"`)
   - Ensure `flatId` is a valid MongoDB ObjectId
   - Verify file is properly attached

2. **500 Internal Server Error:**
   - Missing R2 environment variables
   - Invalid R2 credentials
   - Network connectivity issues

3. **Validation Errors:**
   - File size too large
   - Invalid file type
   - Missing required fields

### Debug Mode

The controller now includes detailed logging. Check your server console for:
- File information (name, size, type)
- DTO validation results
- R2 upload errors

### Alternative: Use Local Storage

If you want to test without R2, you can temporarily modify the controller to use the original `FilesService` instead of `S3Service`. 