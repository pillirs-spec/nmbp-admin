## File URL Storage & Display Integration

### Backend File Storage Flow:

1. **File Upload in Step 3:**
   - Frontend sends FormData with media_files array to `/api/v1/admin/add_event`
   - Backend receives files in `req.files.media_files`

2. **S3 Upload (in adminService.ts):**
   - Files are uploaded to S3 using `uploadToS3()` function
   - S3 returns signed URL: `https://s3-bucket.../events/event_id/timestamp_filename.ext`
   - Media URL is stored in database table `t_event_media`

3. **Database Storage:**
   - Table: `t_event_media`
   - Columns: `event_media_id`, `event_id`, `media_url`, `media_type`, `file_size`
   - Each file = one row with its S3 URL

4. **Data Retrieval:**
   - **GET_EVENT_BY_ID** query now includes LEFT JOIN with t_event_media
   - Returns: event data + `media_files` array with all S3 URLs

### Updated Backend Query (Fixed):

```sql
GET_EVENT_BY_ID = `
  SELECT e.*,
         array_agg(json_build_object(
           'event_media_id', em.event_media_id,
           'media_url', em.media_url,          -- S3 URL
           'media_type', em.media_type,        -- 'image' or 'video'
           'file_size', em.file_size
         )) FILTER (WHERE em.event_media_id IS NOT NULL) as media_files
  FROM t_events e
  LEFT JOIN t_event_media em ON e.event_id = em.event_id
  WHERE e.event_id = $1
  GROUP BY e.event_id
`
```

### Frontend Display Flow:

1. **After Step 1 Save:**
   - event_id returned from backend
   - Saved to localStorage as "draft_event_id"

2. **After Step 3 Upload:**
   - Response includes media array with S3 URLs
   - Stored in `formData.uploadedMedia[]`

3. **In Review Component (Step 4):**
   - Iterate through `formData.uploadedMedia` array
   - Display image/video using media_url
   - Show preview before final submission

4. **Resume Draft:**
   - GET request to `/api/v1/admin/get_event/:id`
   - Returns all data + uploaded media with S3 URLs
   - Can continue from any step

### Frontend Code Example (In Review.tsx):

```tsx
// Display uploaded files
{
  formData.uploadedMedia && formData.uploadedMedia.length > 0 && (
    <div className="uploaded-media">
      <h3>Uploaded Media</h3>
      {formData.uploadedMedia.map((media: any) => (
        <div key={media.event_media_id} className="media-item">
          {media.media_type === "image" ? (
            <img src={media.media_url} alt="event" width="200" />
          ) : (
            <video src={media.media_url} width="200" controls />
          )}
          <p>Size: {(media.file_size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      ))}
    </div>
  );
}
```

### Key Points:

✅ **Files NOT stored in database** - Only S3 URLs (secure, scalable)
✅ **Media URLs accessible to frontend** - Via media_files array in GET response
✅ **Multiple files supported** - Step 3 can upload 1 to N files
✅ **File types:** JPEG, PNG (images), MP4 (videos)
✅ **Max file size:** 50 MB per file
✅ **Resume functionality:** All media preserved in draft

### File Storage Path in S3:

```
s3://bucket-name/events/{event_id}/{timestamp}_{original_filename}
```

Example: `events/550e8400-e29b-41d4-a716-446655440000/1709767200000_event_photo.jpg`
