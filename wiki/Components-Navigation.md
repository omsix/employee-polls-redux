# Navigation Components

This document covers the navigation-related components: NavBar, NotFound, and CircularText.

---

## Nav Bar Component

### 📍 Location

`src/components/nav-bar/nav-bar.component.tsx`

### 🎯 Purpose

A minimal navigation component providing a simple logout button.

### 📋 Component Signature

```typescript
export const NavBarComponent: React.FunctionComponent = () => {
  // ...
}
```

### 🔧 Props

This component accepts no props.

### 🏪 Redux Integration

| Action | Purpose |
|--------|---------|
| `logout` | Clear authentication state |

### 🖼️ UI Structure

```
┌─────────────────────────────────────────┐
│                            [Logout]     │
└─────────────────────────────────────────┘
```

### 📝 Implementation

```typescript
export const NavBarComponent: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles["nav-bar-component"]}>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
```

### 🧪 Testing

**Test File:** `src/components/nav-bar/nav-bar.test.tsx`

```typescript
it("renders logout button", () => {
  renderWithProviders(<NavBarComponent />);
  expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
});
```

---

## Not Found Component

### 📍 Location

`src/components/not-found/not-found.component.tsx`

### 🎯 Purpose

Displays a 404 error page with an interactive torch/flashlight effect.

### 📋 Component Signature

```typescript
export const NotFoundComponent: React.FunctionComponent = () => {
  // ...
}
```

### 🔧 Props

This component accepts no props and has no Redux connection.

### 🖼️ UI Structure

```
┌─────────────────────────────────────────┐
│                                         │
│                  404                    │
│                                         │
│         Page Not Found                  │
│                                         │
│     The page you're looking for         │
│     doesn't exist.                      │
│                                         │
│              [🔦 Torch]                 │
│          (follows mouse)                │
│                                         │
└─────────────────────────────────────────┘
```

### 📝 Implementation

#### Mouse Tracking

```typescript
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

const handleMouseMove = (event: React.MouseEvent) => {
  setMousePosition({
    x: event.clientX,
    y: event.clientY,
  });
};
```

#### Torch Effect

```typescript
<div
  className={styles["torch"]}
  style={{
    left: mousePosition.x,
    top: mousePosition.y,
  }}
/>
```

### 🎨 CSS Styling

The torch effect is achieved with CSS:

```css
.torch {
  position: fixed;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.not-found-component {
  background-color: #1a1a1a;
  color: white;
  min-height: 100vh;
}
```

### 🧪 Testing

**Test File:** `src/components/not-found/not-found.test.tsx`

```typescript
it("displays 404 message", () => {
  render(<NotFoundComponent />);
  expect(screen.getByText(/404/i)).toBeInTheDocument();
  expect(screen.getByText(/page not found/i)).toBeInTheDocument();
});
```

---

## Circular Text Component

### 📍 Location

`src/components/circular-text/circular-text.component.tsx`

### 🎯 Purpose

A utility component that renders text along a circular SVG path, typically used to display usernames around avatars.

### 📋 Component Signature

```typescript
interface CircularTextProps {
  text: string;
  radius?: number;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  children?: ReactNode;
}

export const CircularText: React.FunctionComponent<CircularTextProps> = ({
  text,
  radius = 75,
  fontSize = 14,
  fontWeight = "bold",
  color = "var(--AppBar-color)",
  children,
}) => {
  // ...
}
```

### 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Text to display in circular path |
| `radius` | `number` | `75` | Radius of the circle |
| `fontSize` | `number` | `14` | Font size in pixels |
| `fontWeight` | `string \| number` | `"bold"` | Font weight |
| `color` | `string` | CSS variable | Text color |
| `children` | `ReactNode` | `undefined` | Content to render in center |

### 🖼️ Visual Output

```
        ╭─ T ─ e ─ x ─ t ─╮
       ╱                   ╲
      │                     │
      │     [Avatar]        │
      │                     │
       ╲                   ╱
        ╰─ t ─ x ─ e ─ T ─╯
```

### 📝 Implementation

#### SVG Path Calculation

```typescript
const pathId = `circlePath-${Math.random().toString(36).substr(2, 9)}`;

const svgSize = radius * 2 + fontSize * 2;
const pathRadius = radius + fontSize / 2;
const centerX = svgSize / 2;
const centerY = svgSize / 2;

// Create circular path
const d = `
  M ${centerX - pathRadius}, ${centerY}
  A ${pathRadius}, ${pathRadius} 0 1, 1 ${centerX + pathRadius}, ${centerY}
  A ${pathRadius}, ${pathRadius} 0 1, 1 ${centerX - pathRadius}, ${centerY}
`;
```

#### SVG Rendering

```typescript
return (
  <div className={styles["circular-text"]} style={{ width: svgSize, height: svgSize }}>
    <svg width={svgSize} height={svgSize}>
      <defs>
        <path id={pathId} d={d} fill="none" />
      </defs>
      <text
        fill={color}
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
    <div className={styles["center-content"]}>
      {children}
    </div>
  </div>
);
```

### 🎨 CSS Styling

```css
.circular-text {
  position: relative;
  display: inline-block;
}

.center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### 📖 Usage Example

```typescript
import { CircularText } from "./circular-text/circular-text.component";

// In MenuToolbar
<CircularText text="Omar Cisse" radius={40} fontSize={10}>
  <Avatar src="/avatars/omarcisse.png" />
</CircularText>
```

### 🧪 Testing

**Test File:** `src/components/circular-text/circular-text.test.tsx`

```typescript
it("matches snapshot", () => {
  const { container } = render(
    <CircularText text="Test User" radius={50}>
      <span>Center</span>
    </CircularText>
  );
  expect(container).toMatchSnapshot();
});
```

### ⚠️ Notes

- **Unique Path IDs**: Each instance generates a unique ID to prevent conflicts
- **Responsive**: Size automatically adjusts based on radius and fontSize
- **Accessibility**: Text is rendered in SVG, may need aria-label for screen readers

---

## Component Comparison

| Component | Purpose | Redux | Interactive |
|-----------|---------|-------|-------------|
| NavBar | Simple logout | Yes | Click |
| NotFound | 404 page | No | Mouse move |
| CircularText | Text utility | No | None |

## 🔗 Related Components

- **[MenuToolbarComponent](Components-Menu-Toolbar.md)** - Uses CircularText for user display
- **[App](../src/App.tsx)** - Routes to NotFound for invalid paths
