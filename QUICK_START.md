# TeacherVionlin - Γρήγορος Οδηγός Χρήσης / Quick Start Guide

## 🚀 Πρώτα Βήματα (5 λεπτά) / Get Started in 5 Minutes

### 1. Εγκατάσταση / Installation

```bash
# Clone το repository
git clone https://github.com/re-floqi/TeacherVionlin.git
cd TeacherVionlin

# Εγκατάσταση dependencies
npm install

# Δημιουργία .env αρχείου
cp .env.example .env
# Επεξεργαστείτε το .env με τα Supabase credentials σας
```

### 2. Ρύθμιση Supabase (10 λεπτά) / Supabase Setup

1. Δημιουργία λογαριασμού στο https://supabase.com
2. Δημιουργία νέου project
3. SQL Editor → Εκτέλεση του `supabase_setup.sql`
4. Settings → API → Αντιγραφή URL και anon key στο .env
5. Authentication → Users → Δημιουργία χρήστη

**Περιεχόμενο .env αρχείου:**
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Εκκίνηση / Start the App

```bash
npm start
```

Σκανάρετε το QR code με το Expo Go app!  
Scan the QR code with the Expo Go app!

---

## 📱 Βασικές Λειτουργίες / Basic Features

### Προσθήκη Μαθητή / Add Student
```
1. Μαθητές → + Νέος Μαθητής
2. Συμπληρώστε: Όνομα*, Τηλέφωνο*
3. (Προαιρετικά) Γονέας, Email, Μέγεθος βιολιού
4. Ορίστε προεπιλεγμένη διάρκεια και τιμή
5. Προσθήκη Μαθητή
```

### Προγραμματισμός Μαθήματος / Schedule Lesson
```
1. Αρχική → Επιλογή ημερομηνίας
2. + Νέο
3. Επιλέξτε μαθητή
4. Ορίστε ώρα, διάρκεια, τιμή
5. Προσθήκη Μαθήματος
```

### Επαναλαμβανόμενο Μάθημα / Recurring Lesson
```
1. Κατά την προσθήκη μαθήματος
2. Ενεργοποιήστε το "Επαναλαμβανόμενο μάθημα"
3. Το μάθημα θα επαναλαμβάνεται αυτόματα κάθε εβδομάδα
```

### Σημείωση Πληρωμής / Mark Payment
```
1. Πατήστε στο μάθημα
2. Αλλάξτε κατάσταση σε "Πληρώθηκε"
3. Ενημέρωση Μαθήματος

ή από Στατιστικά:
1. Στατιστικά → Λίστα μαθημάτων
2. Πατήστε το ✎ δίπλα στο μάθημα
3. Επιλέξτε νέα κατάσταση
```

### Διαγραφή Μαθητή / Delete Student
```
1. Μαθητές → Επιλέξτε μαθητή
2. Κάντε scroll κάτω
3. Πατήστε "Διαγραφή Μαθητή"
4. Επιβεβαιώστε (θα διαγραφούν και όλα τα σχετικά μαθήματα)
```

### Στατιστικά / Statistics
```
1. Αρχική → 💰 Στατ.
2. Επιλέξτε περίοδο (Μήνας/Έτος/Όλα)
3. Χρησιμοποιήστε ← → για περιήγηση μηνών
4. Δείτε έσοδα, εκκρεμείς πληρωμές
```

---

## 🎯 Νέες Λειτουργίες / New Features

### 1. Dark Mode (Σκούρο Θέμα)
```
Αρχική Οθόνη → Πατήστε 🌙/☀️
ή
Ρυθμίσεις → Σκούρο Θέμα
```

### 2. Ειδοποιήσεις / Notifications
```
Ρυθμίσεις → Ενεργοποίηση "Ειδοποιήσεις Push"
- Υπενθύμιση 60 λεπτά πριν το μάθημα
- Υπενθύμιση πληρωμής 24 ώρες μετά το μάθημα
```

### 3. Εξαγωγή Δεδομένων / Export Data
```
Ρυθμίσεις → Εξαγωγή Δεδομένων (CSV)
- Εξαγωγή μαθητών
- Εξαγωγή μαθημάτων
- Άνοιγμα στο Excel/Google Sheets
```

### 4. Αντίγραφο Ασφαλείας / Backup
```
Ρυθμίσεις → Δημιουργία Αντιγράφου Ασφαλείας
- Αποθηκεύει όλα τα δεδομένα σε JSON
- Μοιραστείτε ή αποθηκεύστε το αρχείο
```

### 5. Αυτόματη Δημιουργία Μαθημάτων / Auto-Generate Lessons
```
Ρυθμίσεις → Δημιουργία Μαθημάτων (30 ημέρες)
- Δημιουργεί μαθήματα από τους κανόνες επανάληψης
- Ελέγχει για διπλότυπα
- Εμφανίζει πόσα μαθήματα δημιουργήθηκαν
```

---

## 🗂️ Δομή Αρχείων / File Structure

```
TeacherVionlin/
├── App.js                      # Κύριο αρχείο εφαρμογής / Main app file
├── ThemeContext.js             # Dark mode theme context
├── supabaseService.js          # Database functions
├── supabase_setup.sql          # Complete SQL schema (RUN THIS FIRST!)
├── notificationService.js      # Push notifications
├── exportService.js            # Data export (CSV)
├── backupService.js            # Backup/restore
├── recurringLessonUtils.js     # Auto-generate lessons
├── screens/                    # Όλες οι οθόνες / All screens
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── StudentsScreen.js
│   ├── AddEditStudentScreen.js
│   ├── AddEditLessonScreen.js
│   ├── AddEditRecurringLessonScreen.js
│   ├── RecurringLessonsScreen.js
│   ├── PaymentStatsScreen.js
│   └── SettingsScreen.js
├── assets/                     # Icons, images
├── .env                        # Environment variables (δημιουργήστε το / create it)
├── package.json                # Dependencies
├── README.md                   # Πλήρης τεκμηρίωση / Full documentation
├── IMPLEMENTATION_GUIDE.md     # Technical details & features guide
└── QUICK_START.md             # This file!
```

---

## 🔧 Χρήσιμα Commands / Useful Commands

```bash
# Εκκίνηση με clear cache
npm start -- --clear

# Εκκίνηση σε web browser
npm start
# Πατήστε 'w'

# Εκκίνηση σε Android emulator
npm start
# Πατήστε 'a'

# Εκκίνηση σε iOS simulator (Mac only)
npm start
# Πατήστε 'i'

# Reload app
# Πατήστε 'r' στο terminal

# Toggle menu
# Πατήστε 'm'

# Open DevTools
# Πατήστε 'd'
```

---

## ⚡ Συντομεύσεις / Shortcuts

### Στο Terminal / In Terminal
- `r` - Reload app
- `m` - Toggle menu
- `d` - Open DevTools
- `shift+d` - Open React DevTools
- `w` - Open in web browser
- `a` - Open in Android emulator
- `i` - Open in iOS simulator
- `c` - Clear console

### Στην Εφαρμογή / In App
- **Swipe** για να δείτε περισσότερες λεπτομέρειες
- **Long press** για διαγραφή
- **Pull down** για refresh
- **Tap** για επεξεργασία

---

## 🛠️ Συχνά Προβλήματα & Λύσεις / Troubleshooting

### "Cannot connect to Metro"
```bash
# Σιγουρευτείτε ότι είστε στο ίδιο Wi-Fi
# Επανεκκινήστε το Metro bundler
npm start -- --clear
```

### "Sign in error"
```bash
# Ελέγξτε το .env
# Επανεκκινήστε την εφαρμογή
# Press 'r' στο terminal
```

### "Module not found"
```bash
rm -rf node_modules
npm install
npm start
```

### Expo Cache Issues
```bash
expo start -c
```

### CRUD Operations Not Working
```bash
# 1. Βεβαιωθείτε ότι τρέξατε το supabase_setup.sql
# 2. Ελέγξτε ότι είστε συνδεδεμένος
# 3. Δείτε τα logs στο Supabase Dashboard
```

### Notifications Not Working
```
1. Ελέγξτε τις άδειες στις ρυθμίσεις συσκευής
2. Βεβαιωθείτε ότι το expo-notifications είναι εγκατεστημένο
3. Επανεκκινήστε την εφαρμογή
```

### Dark Mode Not Saving
```
1. Ελέγξτε τις άδειες AsyncStorage
2. Καθαρίστε το cache της εφαρμογής
3. Επανεγκαταστήστε αν χρειαστεί
```

---

## 📊 Database Fields Reference

### Students (Μαθητές)
```javascript
{
  onoma_mathiti: "Όνομα*",
  epitheto_mathiti: "Επώνυμο",
  kinhto_tilefono: "Τηλέφωνο*",
  etos_gennisis: 2015,
  onoma_gonea: "Όνομα γονέα",
  email: "email@example.com",
  megethos_violiou: "1/4",
  default_diarkeia: 40,
  default_timi: 20.00,
  simiwseis: "Σημειώσεις"
}
```

### Lessons (Μαθήματα)
```javascript
{
  student_id: 1,
  imera_ora_enarksis: "2024-01-20T17:00:00Z",
  diarkeia_lepta: 40,
  timi: 20.00,
  katastasi_pliromis: "pending", // "paid", "cancelled"
  simiwseis_mathimatos: "Σημειώσεις"
}
```

### Payment Status Values (Κατάσταση Πληρωμής)
- `pending` - Εκκρεμεί
- `paid` - Πληρώθηκε
- `cancelled` - Ακυρώθηκε

---

## 📱 App Navigation

```
Home Screen (Αρχική)
├── 👥 Μαθητές → Προβολή/Επεξεργασία/Διαγραφή μαθητών
├── 🔄 Επαναλ. → Διαχείριση κανόνων επανάληψης
├── 💰 Στατ. → Στατιστικά & λίστα μαθημάτων
├── ⚙️ Ρυθμίσεις → Ρυθμίσεις εφαρμογής
├── 🌙/☀️ Theme toggle → Εναλλαγή σκούρου θέματος
└── 🚪 Logout → Αποσύνδεση
```

---

## 💡 Tips & Tricks

### Γρήγορη Πρόσβαση / Quick Access
1. **Long press** για γρήγορη διαγραφή
2. **Swipe** για περισσότερες λεπτομέρειες
3. **Pull down** για ανανέωση λίστας

### Workflow Suggestions
**Πρωί / Morning:**
- Ελέγξτε τα σημερινά μαθήματα
- Λάβετε ειδοποιήσεις 1 ώρα πριν

**Μετά το Μάθημα / After Lesson:**
- Σημειώστε την κατάσταση πληρωμής
- Προσθέστε σημειώσεις προόδου

**Εβδομαδιαίο / Weekly:**
- Δημιουργήστε μαθήματα για τις επόμενες 30 ημέρες
- Εξάγετε δεδομένα για αρχεία
- Ελέγξτε στατιστικά πληρωμών

**Μηνιαίο / Monthly:**
- Δημιουργήστε αντίγραφο ασφαλείας
- Εξάγετε μηνιαία αναφορά σε CSV
- Ελέγξτε στατιστικά μήνα

### Ασφάλεια / Security
- ⚠️ Μην share το .env αρχείο
- ⚠️ Χρησιμοποιήστε ισχυρό password
- ⚠️ Κάντε regular backups στο Supabase
- ⚠️ Κρατήστε τα backups σε ασφαλές μέρος

### Mobile Tips
- Χρησιμοποιήστε το Expo Go για development
- Για production, κάντε standalone build
- Test σε πραγματική συσκευή, όχι μόνο emulator

---

## 🚀 Επόμενα Βήματα / Next Steps

1. ✅ Εξοικειωθείτε με το UI
2. ✅ Προσθέστε 2-3 μαθητές δοκιμής
3. ✅ Δημιουργήστε μερικά μαθήματα
4. ✅ Δοκιμάστε επαναλαμβανόμενα μαθήματα
5. ✅ Ενεργοποιήστε ειδοποιήσεις
6. ✅ Δοκιμάστε dark mode
7. ✅ Εξερευνήστε τα στατιστικά
8. ✅ Δημιουργήστε backup
9. 🚀 Ξεκινήστε να το χρησιμοποιείτε πραγματικά!

---

## 📚 Περισσότερα / Learn More

- **README.md** - Πλήρης τεκμηρίωση / Complete documentation
- **IMPLEMENTATION_GUIDE.md** - Τεχνικές λεπτομέρειες & οδηγός λειτουργιών
- **SETUP_GUIDE.md** - Οδηγός εγκατάστασης / Setup guide
- **API_DOCUMENTATION.md** - API reference
- **FAQ.md** - Ερωτήσεις / Frequently asked questions

---

## 🆘 Υποστήριξη / Need Help?

1. Ελέγξτε τα αρχεία τεκμηρίωσης παραπάνω
2. Δείτε τα error messages στο console
3. Ελέγξτε τα logs στο Supabase Dashboard
4. Ανοίξτε issue στο GitHub repository
5. Επικοινωνήστε με την ομάδα υποστήριξης

---

## 🔗 Links

- **Supabase:** https://supabase.com
- **Expo:** https://expo.dev
- **React Native:** https://reactnative.dev
- **React Navigation:** https://reactnavigation.org
- **Expo Notifications:** https://docs.expo.dev/versions/latest/sdk/notifications/

---

## 📋 Quick Actions Reference

| Ενέργεια / Action | Τοποθεσία / Location | Βήματα / Steps |
|-------------------|----------------------|----------------|
| Προσθήκη Επαναλ. Μαθήματος | Αρχική → + Νέο | Ενεργοποίηση checkbox πριν αποθήκευση |
| Διαγραφή Μαθητή | Μαθητές → Επεξεργασία | Scroll κάτω → Κόκκινο κουμπί |
| Αλλαγή Μήνα | Στατιστικά → Μήνας | Χρήση ← → κουμπιών |
| Επεξ. Πληρωμής | Στατιστικά → Μαθήματα | Πατήστε ✎ στο μάθημα |
| Dark Mode | Αρχική ή Ρυθμίσεις | Πατήστε 🌙/☀️ icon |
| Εξαγωγή | Ρυθμίσεις | Πατήστε Εξαγωγή |
| Backup | Ρυθμίσεις | Πατήστε Backup |
| Δημ. Μαθημάτων | Ρυθμίσεις | Πατήστε Δημιουργία |

---

**Version:** 1.0.0  
**Last Updated:** October 2025

🎻 Καλή χρήση! / Happy Teaching! 🎻
