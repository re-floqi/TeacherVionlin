# Quick Start Guide - New Features

## 🚀 Get Started in 5 Minutes

### 1. Setup (First Time Only)

**Install Dependencies:**
```bash
npm install
```

**Update Database:**
1. Open your Supabase project
2. Go to SQL Editor
3. Run the student_progress table creation from `database_schema.sql`

### 2. Enable Features

**In the App:**
1. Launch the app
2. Tap Settings icon (⚙️) on home screen
3. Enable:
   - ✅ Push Notifications (grant permissions)
   - ✅ Dark Mode (optional)
   - ✅ Auto-generate Lessons (optional)

### 3. Try Key Features

#### Create Recurring Lesson
1. Add New Lesson
2. Fill in details
3. Enable "Επαναλαμβανόμενο μάθημα" switch
4. Save → Lesson + Recurring rule created ✅

#### Navigate Through Months
1. Go to Payment Stats (💰)
2. Select "Μήνας"
3. Use ← → buttons to browse months
4. View lessons table below statistics

#### Edit Payment Status
1. In Payment Stats lessons table
2. Tap ✎ button on any lesson
3. Select new status
4. Done! Statistics update automatically

#### Export Your Data
1. Settings → Export Data
2. Select "All Data"
3. Save or share CSV files
4. Open in Excel/Google Sheets

#### Create Backup
1. Settings → Create Backup
2. Confirm
3. Save JSON file to safe location
4. Keep for disaster recovery

### 4. Daily Usage

**Morning Routine:**
- Check home screen for today's lessons
- Receive notifications 1hr before each lesson

**After Lessons:**
- Mark payment status in Payment Stats
- Add progress notes (via API)

**Weekly Tasks:**
- Generate next 30 days of lessons (Settings)
- Export data for records
- Review payment statistics

## 📱 App Navigation

```
Home Screen
├── 👥 Students → View/Edit/Delete students
├── 🔄 Recurring → Manage recurring rules
├── 💰 Stats → View stats & lessons table
├── ⚙️ Settings → Configure app
├── 🌙/☀️ Theme toggle
└── 🚪 Logout
```

## ⚡ Quick Actions

| Action | Location | Steps |
|--------|----------|-------|
| Add Recurring Lesson | Home → + New | Enable checkbox before save |
| Delete Student | Students → Edit | Scroll down → Red button |
| Change Month | Stats → Month | Use ← → buttons |
| Edit Payment | Stats → Lessons | Tap ✎ on lesson |
| Toggle Dark Mode | Home or Settings | Tap 🌙/☀️ icon |
| Export Data | Settings | Tap Export button |
| Backup Data | Settings | Tap Backup button |
| Generate Lessons | Settings | Tap Generate button |

## 🎯 Pro Tips

1. **Recurring Lessons**: Set up once, auto-generates weekly
2. **Notifications**: Never miss a lesson with 1hr reminders
3. **Month Navigation**: Review past months anytime
4. **Quick Status Edit**: Tap ✎ in lessons table
5. **Dark Mode**: Better for evening use
6. **Regular Backups**: Weekly backups recommended
7. **Export Monthly**: Keep external records

## 🔧 Troubleshooting

**Notifications not working?**
- Check Settings → Enable notifications
- Grant permissions in device settings

**Can't see lessons?**
- Check selected month in Stats
- Verify lessons exist in date range

**Export failed?**
- Check storage permissions
- Ensure enough space available

**Dark mode not saving?**
- Clear app cache
- Reinstall if needed

## 📚 Learn More

- **NEW_FEATURES.md** - Detailed feature guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **API_DOCUMENTATION.md** - API reference
- **FAQ.md** - Frequently asked questions

## 🆘 Need Help?

1. Check documentation files above
2. Review error messages
3. Check app logs
4. Contact support team

---

**Version:** 1.0.0  
**Last Updated:** October 2025

🎻 Happy Teaching! 🎻
