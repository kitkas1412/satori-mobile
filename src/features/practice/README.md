# Practice (Conversation) Screen

This feature implements the "Luyện hội thoại" (Conversation Practice) screen based on the Figma design.

## Components

### LessonCard

A reusable card component for displaying individual lessons.

**Props:**

- `title`: string - The lesson title
- `subtitle`: string - The lesson subtitle/description
- `type`: "pronunciation" | "stress" | "conversation" - The lesson type
- `status`: "completed" | "active" | "locked" - The lesson status
- `accentColor`: string (optional) - The accent color for icons (defaults to primary)
- `onPress`: function (optional) - Handler for card press

**Visual States:**

- **Completed**: Green checkmark icon, no border
- **Active**: Colored icon (based on accentColor), blue border (#7b92ef)
- **Locked**: Colored icon, gray border, disabled interaction

### LessonSection

A section component that groups related lessons together.

**Props:**

- `lessonNumber`: number - The lesson number for the badge
- `lessonTitle`: string - The section title
- `lessonDescription`: string - The section description
- `completedCount`: number - Number of completed lessons
- `totalCount`: number - Total number of lessons
- `lessons`: array - Array of lesson objects
- `badgeColor`: string - Background color for the lesson badge

### AiBanner

A promotional banner component for the AI conversation feature.

**Props:**

- `onPress`: function (optional) - Handler for banner press

**Design:**

- Gradient background (blue to pink)
- Fixed height: 132px
- Rounded corners: 24px

## Screen Layout

The practice screen ([practice.tsx](<../../../app/(tabs)/practice.tsx>)) includes:

1. **Header**: Back button and "Luyện hội thoại" title
2. **AI Banner**: Promotional banner for AI conversation
3. **Lesson Sections**: Scrollable list of lesson groups

## Design Tokens Used

- **Colors:**
  - Info: `#3b82f6` (blue badge)
  - Tertiary: `#b185db` (purple badge)
  - Success: `#10B981` (completed checkmark)
  - Primary: `#7b92ef` (active border & icons)
  - Border: `#cbd5e1` (locked state)
  - Text Muted: `#475569` (text)
  - Text Inverse: `#f3f4f6` (badge text)
  - Background: `#F6F7F9` (screen background)
  - Surface: `#FFFFFF` (card background)

- **Typography:**
  - Heading: Nunito Bold
  - Body: Open Sans Regular
  - Sizes: 10px (tiny-xs), 12px (xs), 18px (lg), 20px (xl)

- **Spacing:**
  - Card gap: 8px
  - Section gap: 16px
  - Padding: 16px (horizontal)
  - Border radius: 14px (cards), 24px (banner)

## Future Enhancements

1. Replace gradient banner with actual design image
2. Connect to real API for lesson data
3. Add loading states
4. Implement navigation to lesson detail screens
5. Add animations for state transitions
