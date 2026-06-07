Build a highly immersive, dark-themed 3D portfolio website using Next.js, React Three Fiber (Three.js), Tailwind CSS, and Shadcn UI components. 

### 1. Global Setup & Tech Stack
*   **Frameworks:** Next.js (App Router), React Three Fiber (R3F), Drei.
*   **Styling:** Tailwind CSS, Glassmorphism design language (heavy use of `backdrop-blur`, semi-transparent backgrounds, and thin borders). Use Shadcn UI for standard components like buttons.
*   **Color Palette:** 
    *   Background/Base: `#000107` (Deep void black)
    *   Accent 1: `#FAB7C9` (Ethereal bioluminescent pink)
    *   Accent 2: `#E3F6FF` (Electric cyan/light blue)
*   **Typography:**
    *   Primary Font: A bold, futuristic, tech-related non-monospace font (e.g., 'Orbitron', 'Space Grotesk', or 'Syncopate'). Use this for logos and headings.
    *   Secondary Font: 'Poppins' or 'Open Sans' for body copy, subheadings, and UI elements.

### 2. The 3D Environment (Global Canvas)
*   Create a fixed, full-screen `<Canvas>` positioned behind the main HTML content (`z-index: -1`).
*   **The Centerpiece (Ultra-Realistic Fictional Jellyfish):** 
    *   Render a highly detailed, hypothetical 3D jellyfish model. Its materials should look organic but otherworldly, emitting a soft, bioluminescent glow using the accent colors (`#FAB7C9` and `#E3F6FF`).
    *   **Natural Animation:** Use `useFrame` to give the jellyfish fluid, pulsating, breathing-like movements. The tentacles should sway smoothly as if floating in a zero-gravity water environment.
    *   **Interactivity:** Track the user's mouse position. Smoothly lerp the jellyfish's position slightly towards the cursor when the user moves the mouse. When the mouse stops, the jellyfish should resume its own slow, ambient, wandering trajectory.
    *   **Persistence:** This jellyfish will remain in the scene as the user scrolls down to other sections later. Set up its camera and lighting so it serves as the dynamic backdrop for the entire site.

### 3. Hero Section (First Section)
*   **Layout:** A full viewport height (`min-h-screen`) section placed over the 3D canvas.
*   **Header/Navigation (Top bar):**
    *   **Left:** A minimal, clean text logo "Aayush Bhardwaj" using the primary futuristic font.
    *   **Right:** A subtle navigation row with links (About, Projects, Services, Contact) using glassmorphic styling and the secondary font. Hover effects should glow with `#E3F6FF`.
*   **Hero Content (Center of the screen):**
    *   The 3D Jellyfish must be the central visual anchor, floating directly behind or weaving around the text.
    *   **Headline:** "Elevating the Web. Defying Limits." (Large, bold, primary font, perhaps with a subtle gradient text effect using the palette colors).
    *   **Subheading:** "I'm Aayush Bhardwaj. A Full-Stack Developer engineering scalable, high-performance digital experiences." (Secondary font, readable, slight opacity).
    *   **CTAs (Glassmorphic Buttons):**
        *   Primary Button: "Explore My Orbit" (Solid or glowing border using Shadcn UI button, accentuating `#FAB7C9`).
        *   Secondary Button: "Initiate Contact" (Ghost or outline button with hover effect).

### 4. Execution Details
Ensure that the HTML content is layered correctly over the R3F canvas so text is perfectly readable and clickable, while the jellyfish moves fluidly in the background without causing layout shifts or scroll-bars. Provide the code for the global layout, the 3D canvas setup, and the complete Hero section component.