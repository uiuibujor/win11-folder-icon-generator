# Windows 11 Folder Icon Generator

English | [中文](README.md)

A modern web application for creating and customizing Windows 11-style folder icons. Supports multiple preset styles, custom colors, gradient effects, and label content, with export options for PNG or ICO formats.

![Windows 11 Folder Generator](https://img.shields.io/badge/Windows%2011-Folder%20Generator-blue?style=for-the-badge&logo=windows)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

### 🎨 Style Customization
- **8 Preset Styles**: Classic Yellow, Deep Blue, Emerald Green, Lavender, Sunset Orange, Midnight Blue, Coral Pink, Violet
- **Custom Colors**: Full control over folder body and tab colors
- **Gradient Effects**: Support for simple and advanced gradient modes, including linear and radial gradients
- **Highlight Effect**: Toggleable top highlight effect for enhanced depth (disabled by default)
- **Smart Snapping**: Slider automatically snaps to recommended sizes (128px, 256px, 384px)

### 📝 Label Content
- **Text Labels**: Support for custom text content, colors, and fonts
- **Image Labels**: Support for uploading custom images as labels
- **Font Selection**: Multiple font options (Segoe UI, Microsoft YaHei, PingFang, Inter, etc.)
- **Precise Positioning**: Independent control of text and image position and size
- **Real-time Adjustment**: Text size and position adjustable in real-time

### 🔧 Advanced Settings
- **Gradient Angle**: 360-degree free adjustment of gradient direction
- **Color Adjustment**: Independent control of hue, saturation, and brightness
- **Three-point Gradient**: Precise control with start, middle, and end points
- **Icon Size**: Continuously adjustable from 100px-512px, recommended 256px
- **Real-time Preview**: All modifications instantly reflected in preview

### 💾 Export Features
- **PNG Format**: Transparent background, suitable for general use
- **ICO Format**: Auto-optimized Windows system icon format
- **Smart Scaling**: Automatic content boundary detection and export optimization
- **Multi-size Support**: Support for any size export from 100px to 512px

## 🚀 Quick Start

### Requirements
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/uiuibujor/win11-folder-icon-generator
cd win11-folder-icon-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
Open your browser and visit `http://localhost:3000`

### Build for production
```bash
npm run build
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Hooks
- **Build Tool**: Vite 5.0
- **CSS Framework**: Tailwind CSS 3.0
- **Icon Library**: Lucide React
- **Color Picker**: react-best-gradient-color-picker
- **Canvas Drawing**: HTML5 Canvas API
- **Development Language**: JavaScript (ES6+)

## 📖 Usage Guide

### Basic Usage

1. **Select Preset Style**
   - Choose your favorite preset style from the top style panel
   - Or select "Custom" for personalized settings

2. **Customize Colors**
   - Adjust folder body and tab colors
   - Use gradient mode to create richer visual effects

3. **Add Labels**
   - Choose text or image label mode
   - Adjust label position, size, and style

4. **Export Icon**
   - Choose PNG or ICO format
   - Click download button to save the icon

### Advanced Features

#### Gradient Settings
- **Simple Mode**: Quick adjustment of overall color tone
- **Advanced Mode**: Precise control of every gradient detail
  - Start point color and position
  - Middle point color and position
  - End point color and position

#### Image Labels
- Support for JPG, PNG, GIF and other common formats
- Automatic scaling and centering
- Adjustable transparency and position

#### ICO Export Optimization
- Automatic content boundary detection
- Smart centering and scaling
- Maintains optimal visual quality

## 🎯 Project Structure

```
win11-folder-icon-generator/
├── src/
│   ├── components/        # React components
│   │   ├── ColorPickers.jsx
│   │   ├── ExportControls.jsx
│   │   ├── Preview.jsx
│   │   └── panels/        # Control panel components
│   │       ├── BasicSettings.jsx
│   │       ├── ColorControls.jsx
│   │       ├── IconSizeControl.jsx
│   │       └── LabelControls.jsx
│   ├── constants/         # Configuration constants
│   │   ├── colorPickerLocales.js
│   │   └── presetStyles.js
│   ├── utils/             # Utility functions
│   │   ├── canvasDraw.js
│   │   ├── colors.js
│   │   ├── exportIcon.js
│   │   └── gradients.js
│   ├── App.jsx            # Main component
│   ├── main.jsx           # Application entry
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Project configuration
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
├── README.md              # Chinese documentation
└── README_EN.md           # English documentation
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for style management, with configuration file located at `tailwind.config.js`.

### Vite Configuration
Build tool configuration is located at `vite.config.js`, optimized for React development.

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### v1.2.0 (Latest)
- 🎯 Fixed slider and recommended size label alignment issue
- ⚡ Highlight effect disabled by default for better performance
- 🎨 Optimized color picker interface and interaction
- 📐 Improved icon size control precision
- 🔧 Enhanced text and image position adjustment features

### v1.1.0
- 🎨 Added smart snapping functionality
- 📝 Improved label control panel
- 🔧 Optimized gradient effect algorithms
- 💾 Enhanced ICO export quality

### v1.0.0
- ✨ Initial release
- 🎨 8 preset styles
- 🔧 Complete customization features
- 💾 PNG/ICO export support
- ⚡ Highlight effect toggle

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - User interface library
- [Vite](https://vitejs.dev/) - Fast build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library

---

**Enjoy creating your personalized folder icons!** 🎉