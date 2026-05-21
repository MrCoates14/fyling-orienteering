# Fyling Hall Orienteering App

A mobile web app for Year 7-8 PE lessons, featuring QR code checkpoint verification, house-based competition, and real-time leaderboards.

## Features

### Student App
- 📱 **Mobile Web App** - Works on iPhone, Android, iPad via browser
- 🏃 **Timer** - Automatic timing for each course run
- 📷 **QR Code Scanner** - Verify checkpoint completion
- 🏆 **Live Leaderboards** - See house standings and course rankings
- 📴 **Offline Mode** - Works without WiFi, syncs when reconnected

### Teacher Dashboard
- 📊 **Live Results** - Watch results stream in real-time
- 🎯 **Course Management** - View results by course difficulty
- 👥 **House Standings** - Track cumulative house points across sessions
- 📥 **Export Data** - Download results as CSV
- 📈 **Year Group Analytics** - Performance breakdown by year

## Quick Start

1. **Install Node.js** on your school server
2. **Upload files** to server directory
3. **Run `npm install`** to install dependencies
4. **Run `npm start`** to launch the app
5. **Access via `http://<server-ip>:3000`** on student phones

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Architecture

```
fyling-orienteering/
├── server.js              # Express API backend
├── package.json           # Node dependencies
├── public/
│   ├── index.html        # Student app (PWA)
│   ├── teacher.html      # Teacher dashboard
│   ├── sw.js             # Service worker (offline support)
│   └── manifest.json     # PWA configuration
├── DEPLOYMENT.md         # Server setup guide
└── README.md             # This file
```

## API Endpoints

### Student Operations
- `POST /api/teams` - Create a team
- `POST /api/results` - Submit course results
- `GET /api/courses` - List available courses
- `GET /api/leaderboard` - Get course results

### Teacher Operations
- `GET /api/results/:courseId` - Get results for a course
- `GET /api/house-totals` - Get house standings
- `GET /api/health` - Health check

## Data Storage

SQLite database with tables:
- `courses` - Course definitions
- `teams` - Student teams
- `results` - Individual run results
- `house_points` - Cumulative house totals

## How It Works

### Student Flow
1. Student opens app on phone
2. Selects house and team name
3. Chooses course difficulty
4. Starts timer and begins navigating
5. At each checkpoint, scans QR code with phone camera
6. Finishes course, results are recorded
7. House points awarded automatically

### Teacher Flow
1. Opens teacher dashboard before lesson
2. Selects course being run
3. Watches live results stream in
4. Sees leaderboard update in real-time
5. Exports final results when lesson ends

## Customization

### Change Houses
Edit `public/index.html` to add/remove houses (search for "Ardsley").

### Change Checkpoint Count
Edit `public/index.html` checkpoint counts:
- Easy: 5 (line ~120)
- Medium: 8
- Hard: 12

### Change Colors
Modify the CSS variables in `public/index.html` (lines 10-20).

## Offline Support

The app uses Service Workers to work completely offline:
- All HTML/CSS/JS cached on first load
- Results stored locally and synced when online
- Perfect for outdoor lessons with poor signal

## Deployment Checklist

- [ ] Node.js installed on server
- [ ] Files uploaded to server
- [ ] `npm install` completed
- [ ] Server started with `npm start`
- [ ] Student app accessible at `http://<server-ip>:3000`
- [ ] Teacher dashboard accessible at `http://<server-ip>:3000/teacher.html`
- [ ] QR codes printed and laminated
- [ ] Checkpoints placed in field
- [ ] Test run completed with a student

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Mobile**: Progressive Web App (PWA)
- **Libraries**: uuid (for IDs)

## Browser Support

- ✅ Safari on iOS 11+
- ✅ Chrome on Android 5+
- ✅ Firefox (all versions)
- ✅ Edge (all versions)

## Known Limitations (MVP)

- No user authentication (anyone can access)
- No custom checkpoint names (auto-generated)
- House points are simplified (no benchmark scoring yet)
- No image/photo evidence of checkpoints
- Data stored in-memory (resets when server restarts)

## Future Enhancements

- [ ] Teacher login/authentication
- [ ] Benchmark scoring (faster/slower than target time)
- [ ] Custom checkpoint names and GPS coordinates
- [ ] Photo evidence at checkpoints
- [ ] Persistent database with backups
- [ ] Mobile app (iOS/Android)
- [ ] Performance analytics
- [ ] Sound effects and achievements
- [ ] Multi-school support

## Support & Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues and solutions.

## License

Built for Fyling Hall School. Use freely within your school.

---

**Version**: 1.0 MVP
**Created**: May 2026
**For**: PE Department, Fyling Hall School
**Contact**: Marcus Coates, PE Teacher
