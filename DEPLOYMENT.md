# Οδηγός Deployment

## Επισκόπηση

Αυτός ο οδηγός περιγράφει τους διάφορους τρόπους deployment της εφαρμογής Teacher Violin.

## Επιλογές Deployment

### 1. Development/Testing με Expo Go (Πιο Εύκολο) ⭐

**Προς:** Άμεσο, χωρίς κόστος, εύκολο sharing
**Κατά:** Χρειάζεται Expo Go app, δεν είναι standalone

#### Βήματα:
```bash
# Εκκίνηση του development server
npm start

# Share το link
# Άλλοι χρήστες μπορούν να σκανάρουν το QR code
```

**Χρήση:**
- Οι χρήστες εγκαθιστούν το Expo Go από App Store/Google Play
- Σκανάρουν το QR code
- Η εφαρμογή φορτώνεται απευθείας

**Κατάλληλο για:** Testing, development, μικρή ομάδα χρηστών

---

### 2. Web Deployment (Εύκολο-Μέτριο) 🌐

**Προς:** Πρόσβαση από browser, δωρεάν hosting, no app store approval
**Κατά:** Περιορισμένη λειτουργικότητα σε mobile devices

#### A. Netlify (Συνιστάται)

1. **Build για web:**
   ```bash
   expo build:web
   ```
   Αυτό δημιουργεί το φάκελο `web-build`

2. **Deploy στο Netlify:**
   
   **Μέθοδος 1: Drag & Drop**
   - Μεταβείτε στο https://netlify.com
   - Δημιουργήστε λογαριασμό (δωρεάν)
   - Σύρετε τον φάκελο `web-build` στο Netlify

   **Μέθοδος 2: Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --dir=web-build --prod
   ```

3. **Custom Domain (Προαιρετικό):**
   - Netlify Dashboard → Domain Settings
   - Add custom domain
   - Update DNS records όπως σας υποδεικνύει

#### B. Vercel

```bash
# Εγκατάσταση Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd web-build
vercel --prod
```

#### C. GitHub Pages

```bash
# Προσθήκη homepage στο package.json
# "homepage": "https://yourusername.github.io/TeacherVionlin"

# Build
expo build:web

# Deploy
npm install -g gh-pages
gh-pages -d web-build
```

**Environment Variables για Web:**
- Στο Netlify: Site Settings → Build & Deploy → Environment
- Στο Vercel: Project Settings → Environment Variables
- Προσθέστε `SUPABASE_URL` και `SUPABASE_ANON_KEY`

---

### 3. Android APK/AAB (Μέτριο) 🤖

**Προς:** Standalone app, δεν χρειάζεται Expo Go
**Κατά:** Χρειάζεται Google Play account ($25) για distribution

#### A. Standalone Build

```bash
# Εγκατάσταση EAS CLI
npm install -g eas-cli

# Login στο Expo
eas login

# Configure το project
eas build:configure

# Build για Android
eas build --platform android
```

#### B. Local Build (Πιο περίπλοκο)

```bash
# Build APK
expo build:android -t apk

# Build AAB για Google Play
expo build:android -t app-bundle
```

**Downloading:**
Το build θα ολοκληρωθεί στα servers του Expo. Θα λάβετε link για download.

#### Google Play Store Submission

1. **Προετοιμασία:**
   - Δημιουργία Google Play Developer account ($25 one-time)
   - Προετοιμασία assets (icon, screenshots, description)
   - Build AAB (app-bundle)

2. **Upload:**
   - Google Play Console
   - Create app → Upload AAB
   - Complete store listing
   - Submit for review

**Timeline:** 1-7 ημέρες για review

---

### 4. iOS IPA (Δύσκολο) 🍎

**Προς:** Standalone iOS app
**Κατά:** Χρειάζεται Mac, Apple Developer account ($99/year)

#### Προαπαιτούμενα:
- Mac computer (για local builds)
- Apple Developer account ($99/year)
- Xcode installed

#### Build Process

```bash
# EAS Build (Συνιστάται)
eas build --platform ios

# ή Local Build (χρειάζεται Mac)
expo build:ios
```

#### App Store Submission

1. **Προετοιμασία:**
   - App Store Connect account
   - Provisioning profiles
   - App icons, screenshots
   - Privacy policy URL

2. **Upload:**
   - Xcode ή Application Loader
   - Complete App Store listing
   - Submit for review

**Timeline:** 1-7 ημέρες για review

---

## Σύγκριση Επιλογών

| Μέθοδος | Δυσκολία | Κόστος | Χρόνος | Best For |
|---------|----------|--------|--------|----------|
| Expo Go | ⭐ Εύκολο | Δωρεάν | 5' | Testing |
| Web | ⭐⭐ Μέτριο | Δωρεάν | 30' | Web access |
| Android | ⭐⭐⭐ Μέτριο | $25 | 2-5 ημέρες | Android users |
| iOS | ⭐⭐⭐⭐ Δύσκολο | $99/έτος | 3-7 ημέρες | iOS users |

## Συστάσεις ανά Use Case

### Μόνο για εσάς
→ **Expo Go** ή **Web (Netlify)**

### Μικρή ομάδα (2-10 άτομα)
→ **Expo Go** ή **Web με custom domain**

### Επαγγελματική χρήση
→ **Web (custom domain)** + **Android APK** (προαιρετικά)

### Ευρεία διανομή
→ **Web** + **Google Play** + **App Store**

## Προτεινόμενη Διαδρομή

### Φάση 1: Testing (Εβδομάδα 1)
```
1. Τρέξτε local με npm start
2. Test με Expo Go
3. Share με 2-3 χρήστες για feedback
```

### Φάση 2: Beta (Εβδομάδα 2-3)
```
1. Deploy σε Netlify
2. Share το web link
3. Συλλέξτε feedback
4. Διορθώστε bugs
```

### Φάση 3: Production (Εβδομάδα 4+)
```
1. Web: Production deployment στο Netlify με custom domain
2. Android: Build APK, share με Android users
3. (Προαιρετικά) iOS: Build IPA, share με iOS users
4. (Μελλοντικά) Submit σε app stores
```

## Configuration για Production

### 1. Environment Variables
```bash
# .env για production
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
```

### 2. App Configuration (app.json)
```json
{
  "expo": {
    "name": "Teacher Violin",
    "slug": "teacher-violin",
    "version": "1.0.0",
    "privacy": "unlisted",
    "ios": {
      "bundleIdentifier": "com.yourcompany.teacherviolin"
    },
    "android": {
      "package": "com.yourcompany.teacherviolin"
    }
  }
}
```

### 3. Build Configuration
```bash
# Δημιουργία eas.json
eas build:configure

# Επεξεργασία eas.json για production builds
```

## Monitoring & Analytics

### Supabase Dashboard
- Monitor database usage
- Check authentication logs
- View API requests

### Expo Analytics (για EAS builds)
- User analytics
- Crash reports
- Performance monitoring

## Troubleshooting

### Build Failures
```bash
# Clear cache και retry
expo start -c
eas build --clear-cache --platform android
```

### Web Build Issues
```bash
# Ensure all dependencies are compatible
npm install
expo build:web
```

### Environment Variable Issues
- Ελέγξτε ότι το .env έχει τις σωστές τιμές
- Για web builds, set variables στο hosting provider
- Restart development server μετά από αλλαγές

## Κόστη (Ετήσια)

### Minimum (Δωρεάν)
- Netlify: $0
- Supabase Free: $0
- Expo Go: $0
**Σύνολο: $0**

### Basic ($25-50/έτος)
- Netlify: $0
- Supabase Pro: $25/μήνα = $300/έτος
- Android Developer: $25 one-time
**Σύνολο: ~$325 πρώτο έτος**

### Professional ($400+/έτος)
- Custom domain: $10-20/έτος
- Netlify Pro: $19/μήνα = $228/έτος
- Supabase Pro: $25/μήνα = $300/έτος
- Google Play: $25 one-time
- Apple Developer: $99/έτος
**Σύνολο: ~$650 πρώτο έτος**

## Συμβουλές

1. **Ξεκινήστε μικρό:** Expo Go ή web deployment
2. **Test εκτενώς:** Πριν το production deployment
3. **Backup:** Regular backups της Supabase database
4. **Monitor:** Παρακολουθήστε usage και errors
5. **Update:** Κρατήστε dependencies updated
6. **Document:** Καταγράψτε αλλαγές στο CHANGELOG.md

## Επόμενα Βήματα

1. Διαλέξτε τη μέθοδο deployment που ταιριάζει στις ανάγκες σας
2. Ακολουθήστε τα βήματα για την επιλεγμένη μέθοδο
3. Test thoroughly
4. Share με τους χρήστες
5. Συλλέξτε feedback
6. Iterate και βελτιώστε

## Υποστήριξη

Για deployment issues:
- Expo Documentation: https://docs.expo.dev/
- Netlify Support: https://www.netlify.com/support/
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: Project repository

---

**Καλή επιτυχία με το deployment! 🚀**
