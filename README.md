# PortCMS v2.0

Simple CMS for portfolios - second version.

## Features (roadmap)
- [x] Basic structure
- [ ] Components:
  - [x] Header
  - [ ] Footer
  - [x] Navigation bar
  - [ ] Page
  - [ ] Paragraph (text)
  - [ ] Image (with caption)
  - [ ] Button (link)
  - [ ] List (ordered or unordered)
  - [ ] Card (with image)
  - [ ] Form
  - [ ] Table
  - [ ] Code (with syntax highlighting)
  - [ ] Video
  - [ ] Map
  - [ ] Carousel
  - [ ] Accordion
  - [ ] Tabs (with content)
- [ ] Fetching components from database (read-only)
  - API endpoints:
    - [ ] GET /api/pages/?lang={lang}
    - [ ] GET /api/pages/{id}/?lang={lang}
    - [ ] GET /api/pages/{id}/components/?lang={lang}
    - [ ] GET /api/pages/{id}/components/{id}/?lang={lang}
- [ ] Adding components to database, editing them (read-write)

## Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open http://localhost:3000/