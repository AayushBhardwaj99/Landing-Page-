Refine and upgrade the existing Hero Section of the 3D portfolio website. Implement the following specific enhancements for glassmorphism, color balance, and spatial depth. 


### 1. True Glassmorphism on UI Elements
* **Buttons:** Update the "Explore My Orbit" and "Initiate Contact" buttons to use authentic glassmorphism. Apply `bg-white/10`, `backdrop-blur-md`, and a subtle `border border-white/20`. 
* **Badge:** For the top badge ("INTRODUCING THE DIGITAL FRONTIER"), increase its visibility against the dark background. Give it a subtle glowing border or a slight backdrop blur so it pops.
* **Readability:** Ensure the main headline text has a soft `text-shadow` or a tightly cropped `backdrop-blur-sm` behind it so the word "Defying" remains perfectly readable even when the brightest part of the jellyfish passes behind it.

### 2. Integrate Electric Cyan (#E3F6FF)
Balance the existing pink (#FAB7C9) by introducing the electric cyan color from the palette:
* **Navigation:** Apply a text color change and a subtle `#E3F6FF` text-glow effect on hover for all top navigation links.
* **Primary Button:** Update the border of the primary "Explore My Orbit" button to glow softly with `#E3F6FF` on hover.
* **3D Lighting:** Add a secondary `PointLight` or `DirectionalLight` to the React Three Fiber scene, colored `#E3F6FF`, aimed at one side of the jellyfish. This should create a beautiful dual-tone rim light (pink on one side, cyan on the other).

### 3. Enhance 3D Spatial Depth (The Anti-Gravity Illusion)
We need to stop the text from feeling plastered on a flat background. Implement the following depth features:
* **Drei Text Integration:** Move the main headline ("Elevating the Web. Defying Limits.") into the 3D canvas itself using `@react-three/drei`'s `<Text>` component. Position it on the Z-axis so that the jellyfish's tentacles can occasionally float *in front* of the text, creating true spatial occlusion.
* **Mouse Parallax:** Use `useFrame` to track pointer movement. Apply a parallax effect where the 3D text, the jellyfish, and the camera shift at slightly different speeds in response to the user's mouse position. 

### Execution Requirements
Maintain the existing Next.js, Tailwind, and R3F architecture. Provide the updated component code, ensuring the layering between the R3F `<Text>` and the standard HTML DOM (for buttons and nav) is handled seamlessly.