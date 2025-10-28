# TeacherVionlin - Εφαρμογή Διαχείρισης Μαθημάτων Βιολιού

## 📝 Περιγραφή

Η εφαρμογή TeacherVionlin είναι ένα ολοκληρωμένο σύστημα διαχείρισης μαθημάτων βιολιού που επιτρέπει στους δασκάλους να:

### Βασικές Λειτουργίες
- 📅 Καταγράφουν μαθήματα σε ημερολόγιο
- 👥 Διαχειρίζονται τους μαθητές τους (δημιουργία, επεξεργασία, διαγραφή)
- ⏰ Ορίζουν την ώρα και διάρκεια των μαθημάτων
- 💰 Παρακολουθούν τις χρεώσεις και πληρωμές
- 🔄 Δημιουργούν επαναλαμβανόμενα μαθήματα
- 📊 Βλέπουν στατιστικά πληρωμών με πλοήγηση ανά μήνα

### Προηγμένες Λειτουργίες
- 🌙 Dark Mode (σκούρο θέμα)
- 🔔 Push notifications για επερχόμενα μαθήματα και υπενθυμίσεις πληρωμών
- 📤 Export δεδομένων σε CSV (Excel-compatible)
- 💾 Backup και restore λειτουργικότητα
- 🤖 Αυτόματη δημιουργία μαθημάτων από κανόνες επανάληψης
- 📈 Παρακολούθηση προόδου μαθητών

## 🚀 Γρήγορη Εκκίνηση

**Για γρήγορη εκκίνηση, δείτε το [QUICK_START.md](QUICK_START.md)**

### Προαπαιτούμενα

- Node.js (v16 ή νεότερο)
- npm ή yarn
- Expo CLI (`npm install -g expo-cli`)
- Λογαριασμός Supabase (https://supabase.com)

### Βήματα Εγκατάστασης

1. **Clone το repository**
   ```bash
   git clone https://github.com/re-floqi/TeacherVionlin.git
   cd TeacherVionlin
   ```

2. **Εγκατάσταση dependencies**
   ```bash
   npm install
   ```

3. **Ρύθμιση Supabase**
   
   α. Δημιουργήστε έναν νέο λογαριασμό στο https://supabase.com
   
   β. Δημιουργήστε ένα νέο project
   
   γ. Μεταβείτε στο SQL Editor και εκτελέστε ολόκληρο το αρχείο `supabase_setup.sql`
      (copy-paste όλο το περιεχόμενο και πατήστε Run)
   
   δ. Πηγαίνετε στις ρυθμίσεις του project (Settings > API) και αντιγράψτε:
      - Project URL
      - anon/public key

4. **Δημιουργία .env αρχείου**
   ```bash
   cp .env.example .env
   ```
   
   Επεξεργαστείτε το `.env` και προσθέστε τα Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Δημιουργία χρήστη για σύνδεση**
   
   Στο Supabase Dashboard:
   - Πηγαίνετε στο Authentication > Users
   - Κάντε κλικ "Invite User" ή "Add User"
   - Προσθέστε το email και password σας

6. **Εκκίνηση της εφαρμογής**
   ```bash
   npm start
   ```
   
   Αυτό θα ανοίξει το Expo Developer Tools. Μπορείτε να:
   - Σκανάρετε το QR code με την εφαρμογή Expo Go (iOS/Android)
   - Πατήστε 'w' για να ανοίξετε σε web browser
   - Πατήστε 'i' για iOS simulator
   - Πατήστε 'a' για Android emulator

## 📱 Χρήση της Εφαρμογής

### Σύνδεση (Login)

Χρησιμοποιήστε το email και password που δημιουργήσατε στο Supabase.

### Οθόνες

1. **Αρχική Οθόνη (Ημερολόγιο)**
   - Εμφανίζει το ημερολόγιο με σημειωμένες τις ημέρες με μαθήματα
   - Κάτω από το ημερολόγιο φαίνονται τα μαθήματα της επιλεγμένης ημέρας
   - Κουμπιά για πρόσβαση σε Μαθητές, Επαναλαμβανόμενα Μαθήματα και Στατιστικά

2. **Μαθητές**
   - Λίστα με όλους τους μαθητές
   - Προσθήκη νέου μαθητή με το κουμπί "+ Νέος Μαθητής"
   - Πατήστε σε μαθητή για επεξεργασία
   - Κρατήστε πατημένο για διαγραφή

3. **Νέος/Επεξεργασία Μαθητή**
   - Φόρμα με όλα τα στοιχεία του μαθητή
   - Υποχρεωτικά πεδία: Όνομα, Τηλέφωνο
   - Προεπιλεγμένη διάρκεια και τιμή μαθήματος

4. **Νέο/Επεξεργασία Μαθήματος**
   - Επιλογή μαθητή
   - Ημερομηνία και ώρα
   - Διάρκεια και τιμή
   - Κατάσταση πληρωμής (Εκκρεμεί/Πληρώθηκε/Ακυρώθηκε)
   - Σημειώσεις μαθήματος

5. **Επαναλαμβανόμενα Μαθήματα**
   - Προβολή κανόνων επανάληψης
   - Ημέρα εβδομάδας, ώρα, διάρκεια, τιμή
   - Ημερομηνίες έναρξης και λήξης

6. **Στατιστικά Πληρωμών**
   - Επιλογή περιόδου (Μήνας/Έτος/Όλα)
   - Συνολικά μαθήματα και έσοδα
   - Ανάλυση πληρωμένων, εκκρεμών, ακυρωμένων
   - Ποσοστά και προειδοποιήσεις

## 🗄️ Δομή Βάσης Δεδομένων

### Πίνακες

1. **students** - Μαθητές
   - Προσωπικά στοιχεία μαθητή
   - Στοιχεία γονέα
   - Μέγεθος βιολιού
   - Προεπιλεγμένες τιμές για μαθήματα

2. **lessons** - Μεμονωμένα Μαθήματα
   - Σύνδεση με μαθητή
   - Ημερομηνία και ώρα
   - Διάρκεια και τιμή
   - Κατάσταση πληρωμής

3. **recurring_lessons** - Επαναλαμβανόμενα Μαθήματα
   - Κανόνες επανάληψης
   - Ημέρα εβδομάδας
   - Περίοδος ισχύος

4. **student_progress** - Πρόοδος Μαθητών
   - Καταγραφή προόδου μαθητή
   - Επίπεδο δεξιοτήτων
   - Κομμάτια μουσικής
   - Σημειώσεις παρακολούθησης

### ENUM Types

- **payment_status**: 'pending', 'paid', 'cancelled'

## 🔧 Τεχνολογίες

- **Frontend**: React Native με Expo
- **Navigation**: React Navigation
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: Custom components βασισμένα στο Argon theme
- **Calendar**: react-native-calendars
- **Theme**: React Context API με AsyncStorage
- **Notifications**: expo-notifications
- **Export**: expo-file-system, expo-sharing
- **State Management**: React Hooks & Context

## 📦 Deployment

### Web Deployment (Netlify/Vercel)

1. Build για web:
   ```bash
   expo build:web
   ```

2. Deploy το φάκελο `web-build` στο Netlify ή Vercel

### Mobile Deployment

#### iOS (App Store)

1. Χρειάζεστε Apple Developer Account ($99/year)
2. Build:
   ```bash
   expo build:ios
   ```
3. Ανεβάστε στο App Store Connect

#### Android (Google Play)

1. Χρειάζεστε Google Play Developer Account ($25 one-time)
2. Build:
   ```bash
   expo build:android
   ```
3. Ανεβάστε στο Google Play Console

### Εναλλακτικές Λύσεις Deployment

#### Expo Go (Για Testing)
- Η εφαρμογή είναι διαθέσιμη μέσω Expo Go app
- Share το link με άλλους χρήστες

#### Custom Domain
Για να έχετε custom domain:
1. Deploy στο Netlify/Vercel
2. Προσθέστε custom domain στις ρυθμίσεις
3. Ενημερώστε DNS records

## 🔒 Ασφάλεια

- ✅ Row Level Security (RLS) ενεργοποιημένο στο Supabase
- ✅ Ξεχωριστές πολιτικές για SELECT, INSERT, UPDATE, DELETE
- ✅ CASCADE delete για αυτόματη διαγραφή σχετικών εγγραφών
- ✅ Authentication required για όλες τις λειτουργίες
- ✅ Secure connection με HTTPS
- ✅ Environment variables για sensitive data
- ✅ CodeQL Security Scan: PASSED (0 vulnerabilities)

## 📚 Τεκμηρίωση

- **[QUICK_START.md](QUICK_START.md)** - Γρήγορος οδηγός εκκίνησης (5 λεπτά)
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Πλήρης οδηγός λειτουργιών και τεχνικών λεπτομερειών
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Λεπτομερής οδηγός εγκατάστασης
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API reference για developers
- **[FAQ.md](FAQ.md)** - Συχνές ερωτήσεις
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Οδηγίες deployment
- **[FIX_GUIDE.md](FIX_GUIDE.md)** - Οδηγός επίλυσης προβλημάτων

## 📁 Δομή Project

```
TeacherVionlin/
├── App.js                          # Κύριο αρχείο εφαρμογής
├── ThemeContext.js                 # Dark mode context
├── supabaseService.js              # Database API functions
├── notificationService.js          # Push notifications
├── exportService.js                # Data export (CSV)
├── backupService.js                # Backup/restore
├── recurringLessonUtils.js         # Auto-generate lessons
├── supabase_setup.sql              # Complete database setup (RUN THIS!)
├── screens/                        # Οθόνες εφαρμογής
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── StudentsScreen.js
│   ├── AddEditStudentScreen.js
│   ├── AddEditLessonScreen.js
│   ├── AddEditRecurringLessonScreen.js
│   ├── RecurringLessonsScreen.js
│   ├── PaymentStatsScreen.js
│   └── SettingsScreen.js
├── assets/
├── .env.example
├── package.json
└── README.md                       # This file
```

## 📞 Υποστήριξη

Για προβλήματα ή ερωτήσεις:
1. Ελέγξτε το [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) για τεχνικές λεπτομέρειες
2. Δείτε το [FAQ.md](FAQ.md) για συχνές ερωτήσεις
3. Ανοίξτε ένα issue στο GitHub repository

## 📄 Άδεια

MIT License - Δείτε το LICENSE αρχείο για λεπτομέρειες.

## ✅ Ολοκληρωμένες Λειτουργίες

### CRUD Operations
- ✅ Students: Create, Read, Update, Delete
- ✅ Lessons: Create, Read, Update, Delete
- ✅ Recurring Lessons: Create, Read, Update, Delete
- ✅ Payments: Read, Update (status changes)
- ✅ Student Progress: Create, Read, Update, Delete (API ready)

### Advanced Features
- ✅ Dark Mode με persistent storage
- ✅ Push Notifications (lesson reminders, payment reminders)
- ✅ Data Export σε CSV
- ✅ Backup & Restore (JSON format)
- ✅ Automated Lesson Generation από recurring rules
- ✅ Month Navigation στα στατιστικά
- ✅ Inline Payment Status Editing
- ✅ Student deletion με cascade
- ✅ Recurring lessons checkbox στο add lesson

## 🎯 Μελλοντικές Βελτιώσεις

Όλες οι βασικές λειτουργίες έχουν ολοκληρωθεί! Πιθανές μελλοντικές προσθήκες:

- [ ] Student Progress UI screen
- [ ] PDF Export με charts
- [ ] Multi-language support (English)
- [ ] Advanced analytics & charts
- [ ] Cloud backup integration
- [ ] Email notifications
- [ ] Customizable notification times

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Repository:** https://github.com/re-floqi/TeacherVionlin

🎻 Καλή χρήση! / Happy Teaching! 🎻

Contributions are welcome! Please feel free to submit a Pull Request.