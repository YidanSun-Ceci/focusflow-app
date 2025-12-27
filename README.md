<div align="center">

# 🎯 FocusFlow

**A Modern Productivity & Time Management Application**

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/yourusername/focusflow)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.3-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)](https://www.typescriptlang.org/)

*Track your time, boost your productivity, and achieve your goals with AI-powered insights.*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Development](#-development)

</div>

---

## ✨ Features

### 🕐 Time Tracking
- **Focus Timer**: Track time spent on tasks with a beautiful circular timer
- **Task Management**: Create, edit, and organize tasks with custom tags and priorities
- **Pause & Resume**: Seamlessly pause and resume tasks without losing progress
- **Idle Detection**: Automatic idle time detection with smart categorization options

### 🏷️ Customizable Tags
- **Preset Tags**: 8 built-in tag categories (Design, Code, Meeting, Docs, Testing, Learn, Planning, General)
- **Custom Tags**: Create your own tags with custom names and colors
- **Color Coding**: Choose from 16 vibrant colors for visual organization
- **Inline Editing**: Quick tag selection with dropdown menu

### ⚡ Priority Management
- **Three Priority Levels**: Low, Medium, High with color-coded indicators
- **Visual Hierarchy**: Red (High), Amber (Medium), Gray (Low)
- **Easy Editing**: Click to change priority levels inline
- **Smart Sorting**: Tasks automatically sorted by priority

### 📊 Analytics & Insights
- **Time Distribution**: Visualize time spent across different categories with pie charts
- **Efficiency Metrics**: Track completion rate and productivity trends
- **Focus Heatmap**: See your most productive hours of the day
- **Session Statistics**: Average session time and total focus time

### 🤖 AI Assistant
- **Task Suggestions**: AI-powered task recommendations based on your work patterns
- **Smart Planning**: Get help breaking down complex projects
- **Conversational Interface**: Natural language interaction with Google Gemini
- **Context-Aware**: Understands your workflow and provides relevant insights

### 🌓 Modern UI/UX
- **Dark/Light Mode**: Automatic theme switching with system preference
- **Smooth Animations**: Powered by Framer Motion for fluid interactions
- **Responsive Design**: Works seamlessly on all screen sizes
- **Keyboard Shortcuts**: `Cmd/Ctrl + K` for quick task creation
- **Command Palette**: Fast navigation and task management

### 🌍 Internationalization
- **Multi-language Support**: English and Chinese (中文)
- **Easy Switching**: Toggle between languages in settings
- **Fully Localized**: All UI elements translated

### 💾 Data Management
- **Auto-Save**: Tasks automatically saved to local storage
- **Export Data**: Export your task history as JSON
- **Import/Restore**: (Coming soon) Restore from backups
- **Privacy First**: All data stored locally on your device

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/YidanSun-Ceci/focusflow-app.git

# Navigate to the project directory
cd focusflow

# Install dependencies
npm install

# Set up environment variables (for AI features)
# Create a .env.local file with:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the web app
npm run build

# Preview the production build
npm run preview
```

### Desktop App (Tauri)

```bash
# Install Tauri CLI (if not already installed)
npm install --save-dev @tauri-apps/cli

# Run in development mode
npm run tauri:dev

# Build desktop app
npm run tauri:build
```

---

## 📖 Usage

### Creating Tasks

1. **Quick Start**: Type a task name in the search bar and press Enter
2. **Detailed Creation**: Click "+ Add New Task" to open the task dialog
   - Enter task name
   - Select a preset tag or create a custom one
   - Choose tag color (for custom tags)
   - Set priority level (Low/Medium/High)

### Managing Tasks

- **Start Task**: Click on a task name or press "Start" button
- **Pause/Resume**: Click the pause button during focus session
- **Complete Task**: Click the checkmark button
- **Edit Tag**: Click on the tag badge to open tag selector
- **Edit Priority**: Click on the priority badge to change level
- **Delete Task**: Hover over task and click the trash icon

### Using the Timer

- **Focus Mode**: Timer runs and tracks your active work time
- **Paused Mode**: Timer paused but task remains active
- **Idle Detection**: After 5 minutes of inactivity, choose to:
  - Keep time in current task
  - Create a new "Meeting" task
  - Create a new "Break/Rest" task
  - Discard idle time

### Analytics View

- View time distribution across categories
- Check your efficiency score
- See average session times
- Analyze focus patterns by hour

### AI Assistant

1. Navigate to the Assistant view
2. Ask questions or describe your goals
3. Get task suggestions and productivity tips
4. Add suggested tasks directly to your task list

### Keyboard Shortcuts

- `Cmd/Ctrl + K`: Open command palette
- `Enter`: Start/create task (when in input field)
- `Escape`: Close dialogs/cancel edits

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.3** - UI library
- **TypeScript 5.8.2** - Type-safe JavaScript
- **Vite 6.2.0** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion 12.23.26** - Animation library

### UI Components
- **Lucide React 0.562.0** - Icon library
- **Recharts 3.6.0** - Data visualization

### AI Integration
- **@google/genai 1.34.0** - Google Gemini API
- **OpenAI 6.15.0** - (Optional) OpenAI integration

### Desktop
- **Tauri 2.9.6** - Cross-platform desktop app framework

### Development
- **@vitejs/plugin-react 5.0.0** - React plugin for Vite
- **@types/node 22.14.0** - Node.js type definitions

---

## 👨‍💻 Development

### Project Structure

```
focusflow/
├── components/          # Reusable React components
│   ├── CommandPalette.tsx
│   ├── IdleOverlay.tsx
│   ├── MenuBarPopover.tsx
│   ├── Sidebar.tsx
│   └── TaskDialog.tsx
├── views/              # Main view components
│   ├── Analytics.tsx
│   ├── AssistantView.tsx
│   ├── Dashboard.tsx
│   ├── HistoryView.tsx
│   └── Settings.tsx
├── App.tsx             # Main app component
├── types.ts            # TypeScript type definitions
├── locales.ts          # Internationalization strings
├── utils.ts            # Utility functions
├── geminiService.ts    # AI service integration
├── index.tsx           # App entry point
└── vite.config.ts      # Vite configuration
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Desktop App (Tauri)
npm run tauri            # Tauri CLI
npm run tauri:dev        # Run Tauri in dev mode
npm run tauri:build      # Build desktop app
```

### Adding New Features

1. **New View**: Create component in `views/` directory
2. **New Component**: Add to `components/` directory
3. **Update Types**: Modify `types.ts` for new interfaces
4. **Localization**: Add strings to `locales.ts`
5. **Routing**: Update `App.tsx` to include new view

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🎨 Customization

### Theme Colors

Edit Tailwind configuration in `tailwind.config.js`:

```javascript
colors: {
  'terminal-green': '#00FF00',
  'terminal-green-dim': '#00CC00',
  // Add custom colors
}
```

### Preset Tags

Modify tag presets in `views/Dashboard.tsx` and `components/TaskDialog.tsx`:

```typescript
const PRESET_TAGS = [
  { name: 'YourTag', color: 'bg-your-color' },
  // Add more tags
];
```

### Idle Detection Timeout

Change idle timeout in `App.tsx` (line 183):

```typescript
timeout = setTimeout(() => {
  // ...
}, 300000); // 5 minutes in milliseconds
```

---

## 📊 Data Storage

FocusFlow stores all data locally using browser's `localStorage`:

- `focusflow_tasks` - Task list
- `focusflow_current_task` - Active task
- `focusflow_timer` - Timer state
- `focusflow_status` - App status

### Exporting Data

1. Navigate to Settings
2. Click "Export Data"
3. Save the JSON file
4. Data includes all tasks with metadata

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React library
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide Icons** - For beautiful, consistent icons
- **Google Gemini** - For AI-powered insights
- **Tauri** - For the desktop app framework

---

## 📮 Contact

Have questions or suggestions? Feel free to reach out!

- **Issues**: [GitHub Issues](https://github.com/YidanSun-Ceci/focusflow-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YidanSun-Ceci/focusflow-app/discussions)

---

<div align="center">

**Made with ❤️ and ☕**

If you find FocusFlow useful, please consider giving it a ⭐ on GitHub!

</div>
