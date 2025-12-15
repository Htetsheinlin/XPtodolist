# Styling Documentation

This document explains the Windows XP theme system and CSS architecture used in the Todo List application. Understanding the styling system helps you customize the appearance and maintain the nostalgic Windows XP aesthetic.

## Table of Contents

- [Overview](#overview)
- [CSS Custom Properties (Variables)](#css-custom-properties-variables)
- [Component Classes](#component-classes)
- [Color Palette](#color-palette)
- [Styling Approach](#styling-approach)
- [Customization Guide](#customization-guide)

---

## Overview

The application uses a custom Windows XP theme built with:
- **Tailwind CSS 4**: Utility-first CSS framework
- **CSS Custom Properties**: For theme colors and values
- **Custom Classes**: Windows XP-styled components
- **Inline Styles**: For dynamic values and specific XP styling

The theme recreates the classic Windows XP interface with:
- 3D raised/inset button effects
- Classic Windows XP color palette
- Tahoma/MS Sans Serif fonts
- Authentic window frames and title bars

---

## CSS Custom Properties (Variables)

CSS custom properties (CSS variables) define the Windows XP color palette and can be easily customized.

### Location

Variables are defined in `app/globals.css` in the `:root` selector:

```css
:root {
  /* Windows XP Color Palette */
  --xp-taskbar-blue: #245EDB;
  --xp-window-bg: #ECE9D8;
  --xp-window-border: #808080;
  --xp-button-face: #ECE9D8;
  --xp-button-highlight: #FFFFFF;
  --xp-button-shadow: #808080;
  --xp-button-dark-shadow: #000000;
  --xp-text: #000000;
  --xp-desktop-bg: #3A6EA5;
  --xp-title-bar-active: #0054E3;
  --xp-title-bar-inactive: #808080;
}
```

### Usage

Variables are used throughout the stylesheet:

```css
.xp-button-raised {
  background: var(--xp-button-face);
  border: 2px outset var(--xp-button-face);
}
```

### Benefits

- **Easy Customization**: Change colors in one place
- **Theme Switching**: Can create multiple themes
- **Maintainability**: Centralized color definitions
- **Consistency**: Ensures consistent colors across components

---

## Component Classes

The application defines custom CSS classes for Windows XP-styled components.

### .xp-button-raised

Creates a 3D raised button effect (classic Windows XP style).

```css
.xp-button-raised {
  border: 2px outset var(--xp-button-face);
  background: var(--xp-button-face);
  color: var(--xp-text);
  padding: 2px 12px;
  font-family: Tahoma, "MS Sans Serif", sans-serif;
  font-size: 11px;
  cursor: pointer;
}
```

**Key Features:**
- `outset` border creates raised 3D effect
- Hover state maintains appearance
- Active state uses `inset` for pressed effect
- Disabled state shows grayed-out text

**Usage:**
```tsx
<button className="xp-button-raised">
  Click Me
</button>
```

### .xp-input

Styles text input fields to match Windows XP.

```css
.xp-input {
  border: 2px inset var(--xp-button-face);
  background: #FFFFFF;
  color: var(--xp-text);
  padding: 2px 4px;
  font-family: Tahoma, "MS Sans Serif", sans-serif;
  font-size: 11px;
}
```

**Key Features:**
- `inset` border creates sunken effect
- White background for contrast
- Focus state uses dotted outline (Windows XP style)

**Usage:**
```tsx
<input type="text" className="xp-input" />
```

### .xp-window

Creates a window frame container.

```css
.xp-window {
  border: 2px solid var(--xp-window-border);
  background: var(--xp-window-bg);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

**Key Features:**
- Solid border for window frame
- Box shadow for depth
- Window background color

**Usage:**
```tsx
<div className="xp-window">
  {/* Window content */}
</div>
```

### .xp-title-bar

Styles the window title bar (blue gradient).

```css
.xp-title-bar {
  background: linear-gradient(to bottom, var(--xp-title-bar-active), #0044CC);
  color: #FFFFFF;
  padding: 2px 4px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
```

**Key Features:**
- Blue gradient background (active window)
- White text for contrast
- Flexbox layout for content alignment
- `user-select: none` prevents text selection

**Usage:**
```tsx
<div className="xp-title-bar">
  <span>Window Title</span>
  <button>Close</button>
</div>
```

### .xp-checkbox

Custom-styled checkbox matching Windows XP.

```css
.xp-checkbox {
  width: 13px;
  height: 13px;
  border: 1px solid #808080;
  background: #FFFFFF;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}
```

**Key Features:**
- Removes default browser styling (`appearance: none`)
- Custom checkmark using `::after` pseudo-element
- Small size matching Windows XP checkboxes

**Checked State:**
```css
.xp-checkbox:checked::after {
  content: "✓";
  position: absolute;
  left: 2px;
  top: -1px;
  color: #000000;
  font-size: 12px;
  font-weight: bold;
}
```

**Usage:**
```tsx
<input type="checkbox" className="xp-checkbox" />
```

### .xp-panel

Generic panel/container component.

```css
.xp-panel {
  background: var(--xp-window-bg);
  border: 1px solid var(--xp-window-border);
  padding: 4px;
}
```

**Usage:**
```tsx
<div className="xp-panel">
  Panel content
</div>
```

### .xp-dialog

Dialog/modal window styling.

```css
.xp-dialog {
  border: 2px solid var(--xp-window-border);
  background: var(--xp-window-bg);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}
```

**Usage:**
```tsx
<div className="xp-dialog">
  {/* Dialog content */}
</div>
```

---

## Color Palette

The Windows XP color palette is carefully chosen to match the original operating system.

### Primary Colors

| Variable | Hex Code | Usage |
|----------|----------|-------|
| `--xp-desktop-bg` | `#3A6EA5` | Desktop/background color |
| `--xp-window-bg` | `#ECE9D8` | Window background (beige) |
| `--xp-title-bar-active` | `#0054E3` | Active window title bar |
| `--xp-button-face` | `#ECE9D8` | Button background |

### Border Colors

| Variable | Hex Code | Usage |
|----------|----------|-------|
| `--xp-window-border` | `#808080` | Window borders, dividers |
| `--xp-button-shadow` | `#808080` | Button shadow (outset) |
| `--xp-button-dark-shadow` | `#000000` | Dark shadow for depth |

### Text Colors

| Variable | Hex Code | Usage |
|----------|----------|-------|
| `--xp-text` | `#000000` | Primary text color |
| `#FFFFFF` | White | Text on dark backgrounds |
| `#808080` | Gray | Disabled text, secondary |

### Special Colors

- **Taskbar Blue**: `#245EDB` - Classic XP taskbar color
- **Button Highlight**: `#FFFFFF` - Light edge for 3D effect

---

## Styling Approach

### Hybrid Approach

The application uses a combination of:

1. **Tailwind CSS**: Utility classes for layout and spacing
2. **Custom Classes**: Windows XP-specific styling
3. **Inline Styles**: Dynamic values and specific XP details

### Example Component Styling

```tsx
<div 
  className="xp-window w-full max-w-2xl"
  style={{ background: "#3A6EA5" }}
>
  <div className="xp-title-bar">
    <span>Title</span>
  </div>
  <div className="xp-panel" style={{ padding: "8px" }}>
    {/* Content */}
  </div>
</div>
```

**Breakdown:**
- `xp-window`: Custom Windows XP window class
- `w-full max-w-2xl`: Tailwind utilities (width)
- `style={{ background: "#3A6EA5" }}`: Inline style for desktop background

### Font System

Windows XP uses specific fonts:

```css
font-family: Tahoma, "MS Sans Serif", sans-serif;
```

**Font Stack:**
1. **Tahoma**: Primary Windows XP font
2. **MS Sans Serif**: Fallback for older systems
3. **sans-serif**: Generic fallback

**Font Sizes:**
- Title bar: `11px`
- Buttons: `11px`
- Inputs: `11px`
- Body text: `10px` - `12px`

---

## Customization Guide

### Changing the Color Theme

To change colors, modify CSS variables in `app/globals.css`:

```css
:root {
  /* Change desktop background to green */
  --xp-desktop-bg: #4A8A5A;
  
  /* Change window background to white */
  --xp-window-bg: #FFFFFF;
  
  /* Change title bar to purple */
  --xp-title-bar-active: #8B4A8B;
}
```

All components using these variables will update automatically.

### Creating a New Theme

1. **Define new variables**:
```css
:root[data-theme="modern"] {
  --xp-desktop-bg: #1a1a1a;
  --xp-window-bg: #2d2d2d;
  --xp-text: #ffffff;
}
```

2. **Apply theme**:
```tsx
<html data-theme="modern">
```

3. **Update component classes** to use new variables

### Modifying Component Styles

To change a component's appearance:

1. **Find the class** in `app/globals.css`
2. **Modify properties**:
```css
.xp-button-raised {
  /* Add rounded corners */
  border-radius: 4px;
  
  /* Change padding */
  padding: 4px 16px;
}
```

### Adding New Components

To create a new Windows XP-styled component:

1. **Define CSS class**:
```css
.xp-list-item {
  background: var(--xp-window-bg);
  border: 1px solid var(--xp-window-border);
  padding: 4px 8px;
  font-size: 11px;
}
```

2. **Use in components**:
```tsx
<div className="xp-list-item">
  List item content
</div>
```

### Responsive Design

The application uses Tailwind's responsive utilities:

```tsx
<div className="w-full md:max-w-2xl lg:max-w-4xl">
  {/* Responsive width */}
</div>
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 3D Button Effects

Windows XP buttons use border tricks to create 3D effects.

### Raised Button (Outset)

```css
border: 2px outset var(--xp-button-face);
```

**Effect:**
- Top/left: Light color (highlight)
- Bottom/right: Dark color (shadow)
- Creates raised appearance

### Pressed Button (Inset)

```css
border: 2px inset var(--xp-button-face);
```

**Effect:**
- Top/left: Dark color (shadow)
- Bottom/right: Light color (highlight)
- Creates pressed appearance

### Active State

```css
.xp-button-raised:active {
  border: 2px inset var(--xp-button-face);
}
```

When clicked, border switches from `outset` to `inset` for visual feedback.

---

## Best Practices

### 1. Use CSS Variables

Always use CSS variables for colors:
```css
/* Good */
color: var(--xp-text);

/* Bad */
color: #000000;
```

### 2. Combine Tailwind and Custom Classes

Use Tailwind for layout, custom classes for XP styling:
```tsx
<div className="xp-panel flex gap-2 p-4">
```

### 3. Maintain Consistency

Use the same font sizes and spacing throughout:
- Buttons: `11px` font, `2px 12px` padding
- Inputs: `11px` font, `2px 4px` padding
- Panels: `4px` padding

### 4. Preserve 3D Effects

Maintain the 3D button effects for authenticity:
- Use `outset` for raised buttons
- Use `inset` for pressed/input states
- Don't use `border-radius` (Windows XP didn't have rounded corners)

### 5. Test Across Browsers

Windows XP styling works best when:
- Testing in modern browsers
- Ensuring fallbacks for older browsers
- Verifying font rendering

---

## Troubleshooting Styling Issues

### Issue: Colors not updating

**Solution:**
- Clear browser cache
- Verify CSS variables are defined in `:root`
- Check for typos in variable names

### Issue: Buttons don't look 3D

**Solution:**
- Verify `outset`/`inset` border styles
- Check that border width is `2px`
- Ensure background color matches border color

### Issue: Fonts look different

**Solution:**
- Verify Tahoma font is installed
- Check font-family fallback chain
- Ensure font-size is set correctly

### Issue: Styles not applying

**Solution:**
- Check CSS file is imported in `layout.tsx`
- Verify class names match exactly
- Check for CSS specificity issues
- Inspect element in browser DevTools

---

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Windows XP Design Guidelines](https://en.wikipedia.org/wiki/Windows_XP)

---

The Windows XP theme system provides an authentic nostalgic experience while using modern web technologies. Understanding this system helps you customize the appearance and maintain the classic aesthetic!

