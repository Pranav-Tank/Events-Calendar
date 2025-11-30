# 🗓️ Event Calendar - Next.js Recurring Events Application

A beautiful, full-featured event calendar application built with Next.js 14, Prisma, and SQLite. Create, manage, and organize one-time and recurring events with an intuitive interface.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)

## ✨ Features

### 📅 Event Management
- **One-Time Events** - Create single events for meetings, appointments, and special occasions
- **Recurring Events** - Set up events that repeat:
  - ✅ **Daily** - Every day between start and end dates
  - ✅ **Weekly** - Specific days of the week (e.g., Monday, Wednesday, Friday)
  - ✅ **Monthly** - Same date each month

### 🎨 User Interface
- **Beautiful Calendar View** - Interactive monthly grid showing all events
- **Event List View** - Detailed list of all events with filtering
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern Styling** - Gradient backgrounds, smooth animations, and hover effects

### 🔧 Technical Features
- **Full CRUD Operations** - Create, Read, Update, Delete events
- **Form Validation** - Client-side validation with error messages
- **Server-Side Rendering** - Fast page loads and SEO optimization
- **API Routes** - RESTful API for event management
- **Database Persistence** - SQLite database with Prisma ORM

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.14.0 or higher
- npm or yarn package manager

### Installation

1. **Clone or download the repository**
```bash
cd recurring-events-calendar
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# .env file is already configured with:
DATABASE_URL="file:./dev.db"
```

4. **Set up the database**
```bash
# Create database and tables
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
recurring-events-calendar/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── dev.db                 # SQLite database file
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── events/
│   │   │       ├── route.js           # GET all, POST new
│   │   │       └── [id]/route.js      # GET, PUT, DELETE single
│   │   ├── events/
│   │   │   ├── page.js                # List all events
│   │   │   ├── new/page.js            # Create event form
│   │   │   └── [id]/
│   │   │       ├── page.js            # Event details
│   │   │       └── edit/page.js       # Edit event form
│   │   ├── layout.js          # Root layout with navigation
│   │   ├── page.js            # Home page with calendar
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── Calendar.js        # Calendar component
│   │   ├── EventForm.js       # Reusable event form
│   │   └── Navigation.js      # Navigation bar
│   └── lib/
│       ├── prisma.js          # Prisma client instance
│       └── eventUtils.js      # Helper functions
├── .env                       # Environment variables
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🗄️ Database Schema

```prisma
model Event {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  isRecurring Boolean  @default(false)
  frequency   String?  // "daily", "weekly", "monthly"
  daysOfWeek  String?  // "0,1,2" (0=Sunday, 1=Monday, etc.)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | Get all events |
| `POST` | `/api/events` | Create new event |
| `GET` | `/api/events/[id]` | Get single event |
| `PUT` | `/api/events/[id]` | Update event |
| `DELETE` | `/api/events/[id]` | Delete event |

### Example API Usage

**Create Event:**
```javascript
fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Team Meeting",
    description: "Weekly standup",
    startDate: "2024-12-25T09:00:00",
    endDate: "2024-12-25T10:00:00",
    isRecurring: true,
    frequency: "weekly",
    daysOfWeek: "1,3,5" // Monday, Wednesday, Friday
  })
})
```

---

## 🎯 Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with calendar view |
| `/events` | List of all events |
| `/events/new` | Create new event |
| `/events/[id]` | View event details |
| `/events/[id]/edit` | Edit event |

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** Tailwind CSS
- **Language:** JavaScript (ES6+)
- **API:** Next.js Route Handlers

---

## 🎨 Key Features Explained

### Recurring Events Logic

**Daily Events:**
- Repeat every day between start and end dates
- Example: Daily standup from Jan 1 - Jan 31

**Weekly Events:**
- Repeat on specific days of the week
- Select multiple days (Mon, Wed, Fri)
- Uses day numbers: 0=Sunday, 1=Monday, etc.

**Monthly Events:**
- Repeat on the same date each month
- Example: Rent payment on the 1st of every month

### Calendar Grid
- 7 columns (days of the week)
- 6 rows (weeks)
- 42 cells total
- Shows previous/current/next month days
- Highlights today with blue ring
- Displays up to 3 events per day

---

## 📝 Usage Examples

### Create a Gym Class (Weekly Recurring)
```
Title: Morning Workout
Description: Gym class at FitZone
Start Date: 2024-01-01 06:00 AM
End Date: 2024-12-31 07:00 AM
Recurring: Yes
Frequency: Weekly
Days: Monday, Wednesday, Friday
```

### Create Rent Payment (Monthly Recurring)
```
Title: Rent Payment
Description: Monthly rent due
Start Date: 2024-01-01
End Date: 2024-12-31
Recurring: Yes
Frequency: Monthly
```

### Create Birthday Party (One-Time)
```
Title: John's Birthday Party
Description: Celebration at home
Start Date: 2024-12-25 18:00
End Date: 2024-12-25 22:00
Recurring: No
```

---

## 🐛 Troubleshooting

### Database Issues

**Problem:** "Cannot find module '@prisma/client'"
```bash
# Solution: Regenerate Prisma Client
npx prisma generate
```

**Problem:** "Database file not found"
```bash
# Solution: Run migrations
npx prisma migrate dev --name init
```

### Development Server Issues

**Problem:** Port 3000 is already in use
```bash
# Solution: Run on different port
npm run dev -- -p 3001
```

**Problem:** Changes not reflecting
```bash
# Solution: Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📦 Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🧪 Testing the Application

1. **Create a One-Time Event**
   - Go to "Create Event"
   - Fill in title, dates
   - Leave "Recurring" unchecked
   - Submit

2. **Create a Weekly Recurring Event**
   - Go to "Create Event"
   - Enable "Recurring"
   - Select "Weekly"
   - Choose days (Mon, Wed, Fri)
   - Submit

3. **View in Calendar**
   - Go to home page
   - Navigate between months
   - See recurring instances

4. **Edit an Event**
   - Click on event in list
   - Click "Edit"
   - Modify details
   - Save changes

5. **Delete an Event**
   - Click on event
   - Click "Delete"
   - Confirm deletion

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

---

## 📸 Screenshots

### Calendar View
Beautiful monthly calendar with event display and navigation.

### Events List
Comprehensive list of all events with filtering and search capabilities.

### Event Form
Intuitive form for creating and editing events with recurring options.

### Event Details
Detailed view of individual events with all metadata.

---

## 🤝 Contributing

This is an interview project, but feedback and suggestions are welcome!

---

## 📄 License

This project is created for interview purposes.

---

## 👤 Author

**Your Name**
- GitHub: [Your GitHub Profile]
- Email: [Your Email]

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework

---

## ⏰ Development Timeline

This project was completed within the 48-hour deadline as part of an interview task.

---

## 📊 Project Statistics

- **Total Files:** 20+
- **Lines of Code:** 3000+
- **Components:** 3
- **API Routes:** 2
- **Pages:** 5
- **Development Time:** 48 hours

---

**Built with ❤️ using Next.js, Prisma, and Tailwind CSS**
