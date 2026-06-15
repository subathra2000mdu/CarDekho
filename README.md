# CarDekho — Smart Car Research Platform

## The Problem
A car research platform with a massive dataset of cars. Buyers arrive confused, overwhelmed by options, and unable to figure out which car is right for them.

## The Solution
Built something that helps a car buyer go from *"I don't know what to buy"* to *"I'm confident about my shortlist."*

### What Did I Build and Why?
The core experience is the **Smart Car Finder Wizard**. Instead of forcing users to sift through hundreds of cars using complex filters, the wizard asks simple questions about their lifestyle (budget, family size, priorities like mileage vs performance) and uses a **weighted scoring algorithm** to recommend the best matches. This directly addresses the "confused buyer" problem by transforming passive browsing into active guidance.

Supporting features:
- **Browse & Filter**: For users who prefer manual exploration, a robust filtering system.
- **Compare**: Side-by-side spec comparison to help finalize the shortlist.
- **Car Details**: Clean, tabbed interface for specs, variants, and pros/cons.

### What Did I Deliberately Cut?
- User Authentication: Adding login friction to a research tool reduces conversion.
- Dealer Listings / Lead Gen: Distracts from the core "research" phase.
- Image Galleries / 360 views: Complex to build, low ROI for MVP.
- Admin Panel: Data is managed via seeds for this MVP.

### Tech Stack and Why I Picked It
- **Frontend**: React.js + Vite. Vite offers extremely fast HMR, and React's component model is perfect for complex UIs like the Wizard and Compare pages.
- **Styling**: Tailwind CSS v3. Allows for rapid, utility-first styling. I built a custom "glassmorphism" design system for a premium, trustworthy feel.
- **Backend**: Node.js + Express. Lightweight, fast to set up, and perfect for JSON APIs.
- **Database**: MongoDB + Mongoose. The flexible schema is ideal for car data where specs and variants can differ wildly between models.
- **Tooling**: `concurrently` allows running both frontend and backend with a single `npm run dev` command.

### AI Tool Delegation
- **Delegated to AI**:
  - Scaffolding the boilerplate (Vite setup, Express setup).
  - Generating realistic seed data (30+ cars with detailed specs) which would have taken hours manually.
  - Writing repetitive UI components (StarRating, basic Layouts).
  - The core math of the weighted scoring recommendation engine.
- **Manual/Architectural Guidance**:
  - Product scoping: Deciding that the Wizard is the MVP.
  - Designing the prompt/logic for the recommendation engine.
  - State management strategy (React Context for the Compare feature, URL params for filtering).
  - Overall premium UI aesthetic choices (dark mode, glass cards).
- **Where tools helped most**: Data generation and boilerplate.
- **Where they got in the way**: Sometimes AI struggles with complex React Router v6 setups combined with URL search parameters, requiring careful review.

### If I had another 4 hours...
1. **Fuzzy Search & NLP**: Integrate Algolia or Elasticsearch for "cars under 10 lakhs with sunroof" natural language queries.
2. **EMI Calculator**: Add a dynamic EMI calculator on the detail page.
3. **User Accounts**: Allow users to save multiple shortlists across sessions.
4. **Reviews System**: Allow verified owners to leave detailed text reviews, aggregating sentiment.

## Run Instructions

```bash
# 1. Install all dependencies (root, server, client)
npm run install:all

# 2. Seed the database with car data (Requires MongoDB running locally on port 27017)
npm run seed

# 3. Start the application (Client on :5173, Server on :5000)
npm run dev
```
