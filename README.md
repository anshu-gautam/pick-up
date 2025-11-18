# AI Gradient Generator

A modern web application that uses AI to generate beautiful, accessible gradients specifically optimized for hero sections and landing pages. Built with Next.js 15, TypeScript, TailwindCSS, and OpenAI.

![AI Gradient Generator](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Core Features

- **AI-Powered Generation**: Natural language input to generate gradients using OpenAI GPT-4
- **Visual Editor**: Real-time gradient editing with color stops, angle controls, and gradient types (linear, radial, conic)
- **Accessibility Tools**: WCAG 2.2 contrast checker with AA/AAA compliance indicators
- **Responsive Preview**: Test gradients across desktop, tablet, and mobile viewports
- **Export Options**: Export as CSS, Tailwind, React, Vue, SVG, or PNG
- **Preset Library**: 25+ curated gradients organized by use case
- **Dark/Light Mode**: Full theme support with smooth transitions

### Gradient Customization

- Interactive color stop manipulation
- Gradient type switching (linear, radial, conic)
- Angle/rotation controls (0-360°)
- Add/remove color stops dynamically
- Real-time preview with text overlay testing

### Accessibility

- Real-time WCAG contrast checking
- Automatic contrast recommendations
- AA/AAA compliance for small and large text
- White and black text overlay testing
- Minimum, maximum, and average contrast analysis

### Export Formats

- **CSS**: Standard CSS gradient syntax
- **Tailwind CSS**: Ready-to-use Tailwind classes
- **React**: Component with inline styles
- **Vue**: Single-file component
- **SVG**: Scalable vector graphics
- **PNG**: High-quality raster image (1200x675px)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: TailwindCSS 3.4
- **UI Components**: Custom components based on shadcn/ui
- **State Management**: Zustand
- **AI Integration**: OpenAI GPT-4o-mini
- **Color Manipulation**: Colord
- **Image Export**: html-to-image
- **Authentication**: Clerk
- **Database**: Supabase (optional)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (required for AI features)
- Clerk account (required, for authentication)
- Supabase project (optional, for data persistence)

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/yourusername/ai-gradient-generator.git
cd ai-gradient-generator
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your API keys:

\`\`\`env
# Required for AI gradient generation
OPENAI_API_KEY=your_openai_api_key_here

# Required - for user authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional - for saving gradients
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

**📖 For detailed Clerk setup instructions, see [docs/CLERK_SETUP.md](docs/CLERK_SETUP.md)**

4. **Run the development server**

\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Get API Keys

- **OpenAI API Key**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Clerk Keys**: [https://dashboard.clerk.com](https://dashboard.clerk.com)
- **Supabase Keys**: [https://supabase.com/dashboard](https://supabase.com/dashboard)

## Usage

### AI Gradient Generation

1. Enter a natural language prompt (e.g., "warm sunset gradient for tech startup hero")
2. Click "Generate" to create 3-5 gradient variations
3. Select your favorite gradient to edit

### Manual Editing

1. Choose a preset from the library or generate a random gradient
2. Adjust gradient type (linear, radial, conic)
3. Modify angle/rotation
4. Add, remove, or edit color stops
5. Preview with text overlays in different colors

### Testing Accessibility

1. View real-time contrast ratios
2. Check WCAG AA/AAA compliance
3. Get recommendations for text color
4. Test across different device sizes

### Exporting

1. Select your desired export format
2. Copy code to clipboard or download file
3. Use in your project

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── generate-gradient/     # AI gradient generation endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── accessibility-checker.tsx  # WCAG compliance checker
│   ├── ai-prompt.tsx              # AI prompt input
│   ├── controls-panel.tsx         # Preview controls
│   ├── export-panel.tsx           # Export functionality
│   ├── gradient-editor.tsx        # Visual gradient editor
│   ├── gradient-preview.tsx       # Gradient preview
│   ├── preset-gallery.tsx         # Preset gradients
│   ├── theme-provider.tsx         # Dark/light mode
│   └── theme-toggle.tsx           # Theme switcher
├── lib/
│   ├── export-utils.ts            # Export utilities
│   ├── gradient-utils.ts          # Gradient generation & analysis
│   ├── presets.ts                 # Preset gradients
│   ├── store.ts                   # Zustand state management
│   └── utils.ts                   # General utilities
├── types/
│   └── gradient.ts                # TypeScript types
└── hooks/                         # Custom React hooks (future)
\`\`\`

## Key Features Explained

### Color Theory Integration

The app uses advanced color theory algorithms to:
- Generate harmonious color palettes
- Create smooth gradient transitions
- Avoid muddy midpoint colors
- Ensure proper color mixing

### WCAG Accessibility

Full WCAG 2.2 compliance checking:
- AA Large: 3:1 contrast ratio
- AA Small: 4.5:1 contrast ratio
- AAA Large: 4.5:1 contrast ratio
- AAA Small: 7:1 contrast ratio

### AI Prompt Examples

Try these prompts:
- "warm sunset gradient for tech startup hero"
- "professional blue gradient with high contrast"
- "vibrant e-commerce gradient for fashion brand"
- "minimal elegant gradient for landing page"
- "energetic gradient for fitness app"

## Development

### Build for production

\`\`\`bash
npm run build
\`\`\`

### Start production server

\`\`\`bash
npm start
\`\`\`

### Run linter

\`\`\`bash
npm run lint
\`\`\`

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-gradient-generator)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to add these in your deployment platform:
- \`OPENAI_API_KEY\`
- \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\` (optional)
- \`CLERK_SECRET_KEY\` (optional)
- \`NEXT_PUBLIC_SUPABASE_URL\` (optional)
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` (optional)

## Roadmap

- [x] User authentication with Clerk
- [ ] Save gradients to personal library
- [ ] Community gradient gallery
- [ ] Mesh gradient support
- [ ] Gradient animations
- [ ] Colorblind simulation
- [ ] Browser extension
- [ ] Figma plugin
- [ ] Gradient history/undo
- [ ] Team collaboration features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [OpenAI](https://openai.com/) - AI-powered gradient generation
- [shadcn/ui](https://ui.shadcn.com/) - UI component inspiration
- [Colord](https://github.com/omgovich/colord) - Color manipulation
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/yourusername/ai-gradient-generator).

---

Made with ❤️ for designers and developers
