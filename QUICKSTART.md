# Quick Start Guide for Marcus

## What You've Got

A complete orienteering app ready to deploy to your school server before June 30th. Here's what's built:

### Files Created

```
fyling-orienteering/
├── server.js                 # Backend API (Express)
├── package.json             # Node dependencies
├── setup.sh                 # One-click setup script
├── README.md                # Full documentation
├── DEPLOYMENT.md            # Step-by-step deployment guide
├── QUICKSTART.md            # This file
└── public/
    ├── index.html           # Student app (QR scanning, timer, leaderboard)
    ├── teacher.html         # Teacher dashboard (live results, house standings)
    ├── sw.js                # Offline support (Service Worker)
    └── manifest.json        # PWA configuration
```

---

## 3-Step Deployment

### Step 1: Prepare Your Server
Your school server needs Node.js installed. If you don't have it:
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Upload & Install
Copy the `fyling-orienteering` folder to your server, then:
```bash
cd fyling-orienteering
npm install
```

### Step 3: Run
```bash
npm start
```

That's it. The app is live at `http://<your-server-ip>:3000`

---

## Before Your Pilot Lesson (with Year 7-8)

### 1. Print QR Codes
- **Easy course**: 5 QR codes (CP1, CP2, CP3, CP4, CP5)
- **Medium course**: 8 QR codes (CP1-CP8)
- **Hard course**: 12 QR codes (CP1-CP12)

Use: https://www.qr-code-generator.com/ (free, online)

### 2. Laminate & Place
- Laminate each QR code
- Place at checkpoint locations in High Park Wood/school grounds

### 3. Test
- Open app on your phone: `http://<server-ip>:3000`
- Scan a QR code to test
- Open teacher dashboard: `http://<server-ip>:3000/teacher.html`

---

## Running a Lesson

### Before Class
1. Tell Year 7-8 students to organize into teams (2-3 per team)
2. Ask them to pick a house and course difficulty

### During Lesson
**Students:**
- Open app on one shared phone per group
- Select house and team name
- Select course difficulty
- Start scanning QR codes at each checkpoint
- Finish when done, see results

**You (Teacher):**
- Open teacher dashboard in a browser
- Select the course being run
- Watch live leaderboard update
- Click "Refresh" to see latest results

### After Lesson
- Click "Export Results" on teacher dashboard
- Save CSV file for records
- House points automatically carry forward to next session

---

## Key Numbers

| Metric | Value |
|--------|-------|
| Deployment time | ~5 minutes (once server is ready) |
| Time before June 30 | ~6 weeks |
| Year groups | 7-8, 9-10, 11-13 (start with 7-8) |
| Houses | Ardsley, Bainbridge, Constantine, Dalton |
| Course difficulties | Easy (5 CP), Medium (8 CP), Hard (12 CP) |
| Teams per group | 2-3 students, one phone |
| House points per run | 100 points (auto-awarded) |

---

## What Students See

1. **Welcome screen** - Pick house, team name, course difficulty
2. **Course screen** - Timer running, scan QR codes, checkpoint checklist
3. **Results screen** - Final time, checkpoints completed, house points awarded
4. **Leaderboard** - See their team ranking and house standings

---

## What You See (Teacher Dashboard)

1. **Key stats** - Total teams, completed runs, average time
2. **House standings** - Cumulative points by house (updates live)
3. **Course results** - Ranked team results for selected course
4. **Year group breakdown** - Performance by year 7-8, 9-10, 11-13
5. **Export** - Download results as CSV

---

## Customization (Optional)

### Add/Remove Houses
Edit `public/index.html` line ~150. Find:
```html
<option value="Ardsley">Ardsley</option>
```
Add or remove options as needed.

### Change Colors
Edit `public/index.html` line ~13:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Pick new colors from https://coolors.co/

### Change Checkpoint Counts
Edit `public/index.html` line ~120:
```javascript
const checkpointCounts = { easy: 5, medium: 8, hard: 12 };
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` |
| Port 3000 already in use | Change port in `server.js` line 7 |
| QR codes don't scan | Try manual entry (type checkpoint ID) |
| App is slow | Works offline - sign out of WiFi networks |
| Data reset | Delete server, restart |

---

## Timeline

- **This week**: Deploy on test server, invite Year 7-8 for a trial
- **Next 2 weeks**: Run 2-3 lessons, gather feedback
- **Week before summer**: Make any adjustments, finalize for next year
- **After summer**: Roll out to Year 9-10 and 11-13

---

## What's Next (After Pilot)

If the pilot goes well, Phase 2 could include:

- [ ] Benchmark scoring (faster/slower than target times = gain/lose points)
- [ ] Custom checkpoint names
- [ ] Photo evidence at checkpoints
- [ ] Persistent data storage (so house points persist across years)
- [ ] Student achievement badges
- [ ] SMS notifications for final results

---

## Files & Support

- **Documentation**: See `README.md` and `DEPLOYMENT.md` for full details
- **Code**: All source code is in the files above
- **Database**: Results stored in SQLite (survives server restarts)

---

**You're ready to go.** Deploy this week, run a pilot with Year 7-8, and you'll have proof-of-concept for your 2026-2031 Games strategy.

Good luck! 🏕️

---

Questions? Refer to:
1. `QUICKSTART.md` (this file)
2. `DEPLOYMENT.md` (detailed setup)
3. `README.md` (features & tech)
