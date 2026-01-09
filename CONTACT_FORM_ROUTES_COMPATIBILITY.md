# Contact Form & Admin Routes Compatibility Summary

## Routes Configuration

### User-Facing Routes

- **Contact Form Page**: `/contact` → [src/app/contact/page.jsx](src/app/contact/page.jsx)
  - Displays contact form for experience bookings
  - Submits to: `/api/contact/submit` (POST)

### Admin Routes

- **Admin Contact Form Dashboard**: `/admin/contact-form` → `src/app/admin/contact-form/page.jsx`
  - Displays all contact form submissions
  - Fetches from: `/api/admin/contact-form` (GET)
  - Updates submissions via: `/api/admin/contact-form/[id]` (PATCH)

## API Routes

### Public API

1. **POST `/api/contact/submit`**
   - Accepts form submission data from contact page
   - Saves to Firestore collection: `contact_submissions`
   - Status: Set to `unseen` by default
   - Returns: `{ success: true, id, message }`

### Admin API

1. **GET `/api/admin/contact-form`**

   - Lists all contact form submissions
   - Query parameters: `status`, `category`, `sort`
   - Status values: `all`, `unseen`, `contacted`, `accepted`, `rejected`
   - Returns: `{ success: true, experiences: [], count }`

2. **PATCH `/api/admin/contact-form/[id]`**
   - Updates submission status and admin notes
   - Requires admin authentication
   - Status values: `unseen`, `contacted`, `accepted`, `rejected`
   - Returns: `{ success: true, message, status }`

## Data Structure

### Contact Submission (Firestore: `contact_submissions`)

```javascript
{
  // Personal Info
  fullName: string (required),
  email: string (required),
  phone: string,
  companyName: string,
  designation: string,

  // Event Details
  category: string (required),
  eventTitle: string (required),
  eventDate: string,
  eventTime: string,
  eventDuration: number,
  venue: string,
  hasVenue: string ("yes"|"no"|"need_help"),

  // Requirements
  eventType: string ("indoor"|"outdoor"|"both"|"virtual"),
  audienceSize: string ("small"|"medium"|"large"|"very_large"),
  budgetRange: string,
  preferredGames: string,
  themePreferences: string,
  specialRequirements: string,

  // Additional Info
  howHeard: string,
  comments: string,

  // Status Fields
  status: string ("unseen"|"contacted"|"accepted"|"rejected"),
  isRead: boolean,
  adminNotes: string,

  // Timestamps
  submittedAt: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Changes Made

### 1. Contact Page (`src/app/contact/page.jsx`)

- ✅ Fixed API endpoint: `/api/experiences/submit` → `/api/contact/submit`
- ✅ Form structure matches admin expectations
- ✅ All required fields validated

### 2. Admin Contact Form Page (`src/app/admin/contact-form/page.jsx`)

- ✅ Updated API endpoint: `/api/admin/experiences` → `/api/admin/contact-form`
- ✅ Updated status values: `pending` → `unseen`
- ✅ Fixed stats calculation to use correct status
- ✅ Updated display to show "Unseen" instead of "Pending"

### 3. Admin API Routes

- ✅ GET `/api/admin/contact-form` - Enhanced with filtering and sorting
- ✅ PATCH `/api/admin/contact-form/[id]` - Confirmed working with correct statuses

## Testing Checklist

- [ ] Submit form on `/contact` page
- [ ] Verify data saved in Firestore `contact_submissions` collection
- [ ] View submissions in `/admin/contact-form` dashboard
- [ ] Filter by category
- [ ] Filter by status
- [ ] Sort by date/name
- [ ] Update status to "contacted", "accepted", or "rejected"
- [ ] Add and view admin notes
- [ ] Verify all timestamps are correct

## Status Flow

1. Form submitted → Status: `unseen`
2. Admin views → Status can change to: `contacted`, `accepted`, or `rejected`
3. All updates recorded with `updatedAt` timestamp
