# New Features Guide - TeacherVionlin

This guide documents all the new features added to the TeacherVionlin application.

## Table of Contents

1. [Recurring Lessons](#recurring-lessons)
2. [Student Management](#student-management)
3. [Payment Statistics](#payment-statistics)
4. [Dark Mode](#dark-mode)
5. [Push Notifications](#push-notifications)
6. [Data Export](#data-export)
7. [Backup & Restore](#backup--restore)
8. [Automated Lesson Generation](#automated-lesson-generation)
9. [Student Progress Tracking](#student-progress-tracking)
10. [Settings](#settings)

---

## Recurring Lessons

### Creating Recurring Lessons

When adding a new lesson, you can now mark it as recurring:

1. Navigate to "Add Lesson" screen
2. Fill in all lesson details (student, date, time, duration, price)
3. Enable the "Επαναλαμβανόμενο μάθημα (κάθε εβδομάδα)" switch
4. Save the lesson

**What happens:**
- The lesson is created for the specified date
- A recurring lesson rule is automatically created
- Future lessons will be generated based on this rule (same day of week, same time)

**Note:** The recurring checkbox only appears when creating new lessons, not when editing existing ones.

---

## Student Management

### Delete Student

You can now delete students directly from the edit student screen:

1. Navigate to a student's edit page
2. Scroll to the bottom
3. Tap the red "Διαγραφή Μαθητή" button
4. Confirm the deletion

**Warning:** Deleting a student will also delete all their lessons and progress records due to database cascade deletion.

---

## Payment Statistics

### Month Navigation

The payment statistics screen now supports navigating between months:

1. Select "Μήνας" (Month) view
2. Use "← Προηγούμενος" to go to previous month
3. Use "Επόμενος →" to go to next month (disabled for future months)

The statistics will update to show data for the selected month.

### Lessons Table

Below the statistics, you'll find a comprehensive table showing:
- All lessons for the selected period
- Student name
- Date and time
- Amount
- Payment status badge

**Edit Payment Status:**
- Tap the "✎" button next to any lesson
- Select new payment status:
  - Εκκρεμεί (Pending)
  - Πληρώθηκε (Paid)
  - Ακυρώθηκε (Cancelled)

---

## Dark Mode

### Enabling Dark Mode

Dark mode can be toggled from:
1. **Home Screen:** Tap the 🌙/☀️ icon in the header
2. **Settings Screen:** Use the "Σκούρο Θέμα" switch

The preference is saved and persists across app restarts.

**Features:**
- Complete theme support across all screens
- Calendar theme adapts to dark mode
- Persistent preference storage using AsyncStorage

---

## Push Notifications

### Setup Notifications

1. Navigate to Settings (⚙️ icon on home screen)
2. Enable "Ειδοποιήσεις Push"
3. Grant notification permissions when prompted

**Notification Types:**

1. **Upcoming Lesson Reminders**
   - Sent 60 minutes before each lesson
   - Shows student name and lesson time
   
2. **Payment Reminders**
   - Sent 24 hours after lessons with pending payment
   - Shows amount and student name

**Note:** Notifications require the `expo-notifications` package to be properly configured in your Expo app.

---

## Data Export

### Exporting Data

From the Settings screen:

1. Tap "📊 Εξαγωγή Δεδομένων (CSV)"
2. Select "Όλα τα Δεδομένα"
3. Data is exported as CSV files:
   - `students_YYYY-MM-DD.csv` - All students
   - `lessons_YYYY-MM-DD.csv` - All lessons for current year
   - `stats_YYYY-MM-DD.txt` - Payment statistics

**CSV Format:**

**Students CSV:**
```
Όνομα,Επώνυμο,Έτος Γέννησης,Γονέας,Τηλέφωνο,Email,Μέγεθος Βιολιού,Προεπ. Διάρκεια,Προεπ. Τιμή,Σημειώσεις
```

**Lessons CSV:**
```
Ημερομηνία,Ώρα,Μαθητής,Διάρκεια (λεπτά),Τιμή (€),Κατάσταση Πληρωμής,Σημειώσεις
```

---

## Backup & Restore

### Creating a Backup

1. Navigate to Settings
2. Tap "💾 Δημιουργία Αντιγράφου Ασφαλείας"
3. Confirm the backup creation
4. Save or share the generated JSON file

**Backup Contents:**
- All students
- All lessons (past year + next year)
- All recurring lesson rules
- Metadata about backup

**Backup File Format:**
```json
{
  "version": "1.0",
  "timestamp": "2025-10-25T...",
  "data": {
    "students": [...],
    "lessons": [...],
    "recurringLessons": [...]
  },
  "metadata": {
    "studentsCount": 10,
    "lessonsCount": 150,
    "recurringLessonsCount": 5
  }
}
```

### Restoring from Backup

**Note:** Restore functionality is intentionally limited to prevent data loss. For restoration:
1. Use Supabase dashboard for database restoration
2. Or manually import backup data through SQL queries

---

## Automated Lesson Generation

### Manual Generation

From the Settings screen:

1. Tap "🔄 Δημιουργία Μαθημάτων (30 ημέρες)"
2. Confirm the generation
3. Lessons are created for the next 30 days based on all recurring rules

**What It Does:**
- Reads all active recurring lesson rules
- Generates lessons for each rule for the next 30 days
- Checks for duplicates (won't create if lesson already exists)
- Shows count of generated lessons

**Automatic Generation:**

Enable "Αυτόματη Δημιουργία Μαθημάτων" in Settings for future automatic generation capabilities.

---

## Student Progress Tracking

### Database Schema

A new `student_progress` table has been added to track student progress:

```sql
CREATE TABLE student_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    imera_kataxorisis TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    perigrafi TEXT NOT NULL,
    skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 5),
    kommati_mousikis VARCHAR(255),
    simiwseis TEXT,
    created_by VARCHAR(100)
);
```

### API Functions

**Available in `supabaseService.js`:**

```javascript
// Get progress for a student
const result = await getStudentProgress(studentId);

// Add progress entry
const result = await addStudentProgress({
  student_id: 1,
  perigrafi: "Learned new technique",
  skill_level: 4,
  kommati_mousikis: "Vivaldi - Spring",
  simiwseis: "Great improvement",
  created_by: "Teacher Name"
});

// Update progress entry
const result = await updateStudentProgress(progressId, updateData);

// Delete progress entry
const result = await deleteStudentProgress(progressId);
```

**Note:** UI for progress tracking can be added to the student detail screen in future updates.

---

## Settings

The new Settings screen (⚙️) provides centralized access to:

### Appearance
- **Σκούρο Θέμα:** Toggle dark mode

### Notifications
- **Ειδοποιήσεις Push:** Enable/disable notifications
- Request notification permissions

### Automations
- **Αυτόματη Δημιουργία Μαθημάτων:** Enable automatic lesson generation
- **Generate Lessons:** Manually generate lessons for next 30 days

### Data Management
- **Create Backup:** Export complete backup as JSON
- **Export Data:** Export to CSV format

---

## Installation Requirements

To use all new features, install the required dependencies:

```bash
npm install expo-notifications expo-file-system expo-sharing expo-document-picker
```

Or with Expo CLI:

```bash
expo install expo-notifications expo-file-system expo-sharing expo-document-picker
```

---

## Database Migration

To add student progress tracking, run the updated `database_schema.sql` in your Supabase SQL editor, or execute:

```sql
-- Run only the student_progress table creation section
CREATE TABLE student_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    imera_kataxorisis TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    perigrafi TEXT NOT NULL,
    skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 5),
    kommati_mousikis VARCHAR(255),
    simiwseis TEXT,
    created_by VARCHAR(100)
);

CREATE INDEX idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_student_progress_date ON student_progress(imera_kataxorisis);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" ON student_progress
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
```

---

## Tips & Best Practices

1. **Regular Backups:** Create weekly backups of your data
2. **Notifications:** Enable notifications to never miss a lesson
3. **Recurring Lessons:** Use recurring rules to automate lesson creation
4. **Month Navigation:** Review past months' statistics regularly
5. **Export Data:** Export data monthly for external record-keeping
6. **Dark Mode:** Use dark mode for comfortable viewing in low light

---

## Troubleshooting

### Notifications Not Working
1. Check notification permissions in device settings
2. Ensure expo-notifications is properly installed
3. Verify notifications are enabled in app settings

### Export/Backup Fails
1. Check storage permissions
2. Ensure enough storage space is available
3. Try exporting smaller date ranges

### Dark Mode Not Saving
1. Check AsyncStorage permissions
2. Clear app cache and try again

---

## Future Enhancements

Potential additions for future versions:
- Student progress tracking UI
- Advanced notification scheduling options
- PDF export with formatted reports
- Cloud backup integration
- Progress charts and analytics
- Lesson templates
- Multi-language support

---

## Support

For issues or questions:
1. Check the FAQ.md file
2. Review the API_DOCUMENTATION.md
3. Open an issue on GitHub
4. Contact the development team

---

Last Updated: October 2025
Version: 1.0.0
