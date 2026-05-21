# Fyling Hall Orienteering App - Deployment Guide

## Quick Start

This guide will help you deploy the orienteering app on your school server.

---

## System Requirements

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Linux/Mac/Windows server
- Port 3000 available (or configure alternative)

---

## Installation Steps

### 1. Install Node.js

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Mac:**
```bash
brew install node
```

**Windows:**
Download from https://nodejs.org/ and run installer

### 2. Copy Files to Server

Upload all files from `fyling-orienteering/` to your server. For example:
```bash
/home/web/orienteering/
```

### 3. Install Dependencies

```bash
cd /home/web/orienteering
npm install
```

This will install Express, CORS, SQLite3, and other required packages.

### 4. Start the Server

```bash
npm start
```

You should see:
```
Orienteering app running on http://localhost:3000
Connected to SQLite database
Database schema initialized
```

---

## Accessing the App

### Student App (for Year 7-8)
Students access via mobile browsers:
- **iPhone Safari**: `http://<your-server-ip>:3000`
- **Android Chrome**: `http://<your-server-ip>:3000`

When students visit, they can "Add to Home Screen" to install as a PWA (app-like experience).

### Teacher Dashboard
Teachers access the admin dashboard:
- **URL**: `http://<your-server-ip>:3000/teacher.html`

---

## Setting Up Courses

Before a lesson, create 3 courses:

1. **Easy Course**: 5 checkpoints (CP1, CP2, CP3, CP4, CP5)
2. **Medium Course**: 8 checkpoints (CP1-CP8)
3. **Hard Course**: 12 checkpoints (CP1-CP12)

### Create QR Codes

For each checkpoint, print a QR code containing just the checkpoint ID. For example:
- Checkpoint 1 = `CP1`
- Checkpoint 2 = `CP2`
- etc.

**Free QR Code Generator**: https://www.qr-code-generator.com/

Laminate the printed QR codes and place them at physical checkpoint locations.

---

## Houses

The app uses these houses (customize as needed):
- Ardsley
- Bainbridge
- Constantine
- Dalton

To add more houses, edit `public/index.html` line ~150:
```html
<select id="houseSelect" class="house-select">
  <option value="">-- Select your house --</option>
  <option value="Ardsley">Ardsley</option>
  <option value="Bainbridge">Bainbridge</option>
  <option value="Constantine">Constantine</option>
  <option value="Dalton">Dalton</option>
  <option value="MyNewHouse">My New House</option>  <!-- Add here -->
</select>
```

---

## Using the App in Lessons

### Before the Lesson
1. Print QR codes for all checkpoints
2. Laminate and place at checkpoint locations
3. Tell students which course difficulty they'll do
4. Ask them to organize into teams of 2-3

### During the Lesson

**For Students:**
1. Open the app on a phone: `http://<server-ip>:3000`
2. Select house and team name
3. Select course difficulty
4. Click "Start Course" to begin timer
5. At each checkpoint, scan the QR code
6. When finished, click "Finish Course"
7. Results show and contribute to house totals

**For Teacher:**
1. Open teacher dashboard: `http://<server-ip>:3000/teacher.html`
2. Select the course being run
3. Watch live results and leaderboard
4. Click "Refresh Live Data" for latest results
5. Export results at end of lesson (CSV file)

---

## Data Storage

All results are stored in a SQLite database (`fyling-orienteering.db` in the server directory).

**Backup:** Periodically copy this file to a safe location.

**Reset Data:** Delete `fyling-orienteering.db` and restart the server to start fresh.

---

## Troubleshooting

### "Cannot find module 'express'"
**Solution:** Run `npm install` in the app directory.

### "Port 3000 already in use"
**Solution:** Change the port in `server.js` line 7:
```javascript
const PORT = process.env.PORT || 3000;  // Change 3000 to something else
```

### QR codes not scanning
- Make sure phone camera is steady and well-lit
- Check laminated QR code for scratches/damage
- Try manual checkpoint entry (type the checkpoint ID)

### Slow connections
- The app works fully offline, so local network connectivity is not required
- Data syncs when connection returns
- Consider running the server on a laptop in the field if signal is poor

---

## Optional: Running on Startup (Linux)

To auto-start the app when the server boots:

Create a systemd service file:
```bash
sudo nano /etc/systemd/system/orienteering.service
```

Add:
```
[Unit]
Description=Fyling Hall Orienteering App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/web/orienteering
ExecStart=/usr/bin/node /home/web/orienteering/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable orienteering
sudo systemctl start orienteering
```

---

## Features

✅ Student QR code scanning
✅ Real-time house leaderboards
✅ Offline-capable (Progressive Web App)
✅ Teacher live results dashboard
✅ Multi-course difficulty levels
✅ House point accumulation
✅ Timer tracking
✅ Export results (CSV)
✅ Mobile-responsive (iPhone + Android)

---

## Support

If you encounter issues:

1. Check the server console for error messages
2. Make sure all files are uploaded correctly
3. Verify Node.js is installed: `node --version`
4. Restart the server: Stop (Ctrl+C) and run `npm start` again

---

## Next Steps (Phase 2)

For future updates, consider:
- User authentication (teacher login)
- Benchmark scoring (faster/slower than target time)
- Historical trend tracking
- Mobile app version (iOS/Android)
- Custom checkpoint names/locations
- Sound effects and animations

---

**Version**: 1.0 MVP
**Last Updated**: May 2026
**Contact**: Marcus Coates, PE Teacher, Fyling Hall School
