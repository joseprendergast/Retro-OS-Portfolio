# RetroOSPortfolio Design Guidelines

## Design Approach
**Aesthetic Direction**: Authentic Windows 95 operating system recreation with pixel-perfect retro accuracy. This is a nostalgic experience-focused project requiring precise adherence to 1995 Microsoft design language.

## Visual Design System

### Color Palette (Windows 95 Authentic)
- **Desktop Background**: Teal (#008080) default, switchable via Display Settings
- **Window Chrome**: Silver gray (#c0c0c0)
- **Dark Gray**: #808080
- **Active Window Title**: Gradient from #000080 to #1084d0
- **Inactive Window Title**: Gradient from #808080 to #c0c0c0
- **Highlight Blue**: #000080
- **Text**: Black (#000000) on light backgrounds, white on dark/desktop
- **Border Highlights**: #ffffff (light), #dfdfdf (medium light), #808080 (shadow), #000000 (dark shadow)

### Typography
- **Primary Font**: MS Sans Serif (fallbacks: Arial, Segoe UI)
- **Monospace**: Fixedsys or Courier New for system dialogs
- **Icon Labels**: 8pt, white text with black shadow/outline for desktop readability
- **Menu/UI Text**: 8pt regular
- **Title Bars**: 8pt bold
- **All text anti-aliasing**: OFF (crisp pixel rendering)

### 3D Border System (Critical Authenticity Element)
**Raised/Outset** (buttons, window frames, toolbar buttons):
- Top/Left borders: 2px #ffffff (highlight) + 2px #dfdfdf (light)
- Bottom/Right borders: 2px #808080 (shadow) + 2px #000000 (dark shadow)

**Sunken/Inset** (text inputs, pressed buttons, content wells):
- Top/Left borders: 2px #808080 (shadow) + 2px #000000 (dark shadow)
- Bottom/Right borders: 2px #dfdfdf (light) + 2px #ffffff (highlight)

**Flat**: No 3D effect for certain menu items and separators

## Layout System

### Desktop Grid
- Icons arrange in vertical columns, left-to-right flow
- Grid snapping: ~80px horizontal, ~90px vertical spacing
- Icon size: 32x32px or 48x48px with label underneath
- Selection: Blue highlight (#000080) background with white text

### Window System
**Title Bar**: 30px height, gradient background, centered or left-aligned text
**Menu Bar**: 20px height, gray background, left-aligned menu items
**Status Bar**: 20px height, sunken border, left-aligned text
**Content Area**: White or application-specific background, scrollable
**Borders**: 3px resizable borders with 8-directional corner handles

### Taskbar (Always Visible Bottom)
- Height: 30px
- Start button: Left-aligned, 60px wide
- Window buttons: Center area, 150px max width each with icon + truncated text
- System tray: Right-aligned with clock (HH:MM AM/PM), volume icon, network icon

### Spacing
- Window padding: 2-4px consistent
- Menu item padding: 4px vertical, 8px horizontal
- Button padding: 4px vertical, 12px horizontal
- Desktop icon spacing: 16px between icon and label
- Dialog margins: 8px around edges

## Component Library

### Buttons
- Raised border (3D outset) in normal state
- Sunken border (3D inset) when pressed
- 1px border focus indicator (dotted black line inside button)
- Min-width: 75px, height: 23px

### Windows
- Draggable via title bar, resizable via borders
- Minimize (underscore), Maximize/Restore (square), Close (X) buttons on title bar right
- Blue gradient when active, gray when inactive
- Cascade positioning for multiple windows (+20px offset)
- Minimum size: 200x150px

### Menus & Dropdowns
- Gray background (#c0c0c0)
- Blue highlight (#000080) on hover with white text
- Separator lines: 1px sunken border
- Submenu indicators: Right-pointing triangle (►)
- Keyboard shortcuts: Right-aligned, underlined access keys

### Icons
- Pixelated 32x32 or 48x48 assets
- 256-color palette maximum
- Slight isometric/3D perspective
- Shortcut arrows: Small curved arrow overlay on bottom-left

### Text Inputs
- Sunken border (3D inset)
- White background
- Black text, 8pt
- Blinking cursor (1px black vertical line)

### Scrollbars
- Width: 16px
- Gray track (#c0c0c0)
- Raised arrow buttons (up/down or left/right)
- Draggable thumb with raised border

## Cursor States
- **Default**: Standard arrow pointer
- **Pointer**: Pointing hand (links, buttons)
- **Text**: I-beam (text fields)
- **Move**: Four-directional arrows (window dragging)
- **Resize**: Bidirectional arrows (N-S, E-W, NE-SW, NW-SE)
- **Wait**: Hourglass animation (loading)

## Animations
**Minimal and authentic**:
- Window open: 150ms scale from center + fade in
- Window close: 150ms scale to center + fade out
- Window minimize: 200ms animate to taskbar button position
- Solitaire win: Cascading cards from foundations
- Button press: Instant border swap (raised to sunken)
- Menu expand: Instant (no slide animations)

## Images
**Photos Folder Contents** (90s nostalgic imagery):
- CRT monitor with beige computer setup (chunky keyboard and ball mouse)
- Stack of 3.5" floppy diskettes (colorful labels)
- CD-ROM jewel cases and spindle
- Dial-up modem with phone cord
- Windows 95 boot screen screenshot
- Retro pixel art graphics
- Geocities "Under Construction" animated GIF
- Vintage tech magazine advertisements

**Wallpaper Options** (selectable via Display Settings):
1. Classic clouds (teal sky, white fluffy clouds) - DEFAULT
2. Teal geometric tessellation pattern
3. Red brick wall texture (tiled)
4. Blue circuit board pattern
5. Solid teal (#008080)

**Icon Assets**: Create or source authentic Windows 95-style icons for My Computer, Internet Explorer, Recycle Bin, folders, games, social shortcuts with proper pixelated aesthetic.

## Interaction Patterns

### Desktop
- Single-click: Select/highlight icon (blue background)
- Double-click: Open application/folder
- Right-click: Context menu (Open, Properties, Delete, etc.)
- Click-drag empty area: Blue selection rectangle
- Drag icons: Move with grid snapping

### Windows
- Click title bar: Bring to front + make active
- Drag title bar: Move window
- Drag borders/corners: Resize (8 directions)
- Double-click title bar: Maximize/restore toggle
- Minimize button: Animate to taskbar
- Maximize button: Fill screen minus taskbar
- Close button: Confirm dialogs for important actions

### Games
- **Solitaire**: Drag-and-drop cards, double-click auto-move to foundation
- **Minesweeper**: Left-click reveal, right-click flag, chord-clicking (both buttons)

### Start Menu
- Click Start button: Open menu from bottom-left
- Hover items with ►: Show submenu to right
- Click item: Execute action, close menu
- Click outside: Dismiss menu

## Accessibility
- High contrast mode available (Windows 95 had this)
- Keyboard navigation: Tab through focusable elements, Enter to activate, Arrow keys in menus
- Focus indicators: 1px dotted border inside focused elements
- Screen reader labels: Proper ARIA for modern accessibility while maintaining retro appearance

## Special Requirements
- All UI elements must look clickable (raised borders indicate interactivity)
- System sounds references (can be decorative): Startup chime, error beep, minimize/maximize sounds
- Consistent 3D lighting direction: Light from top-left, shadow bottom-right
- No modern flat design elements - everything has dimension
- Pixel-perfect alignment on 1px grid for crisp rendering