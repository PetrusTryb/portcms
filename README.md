# PortCMS v2.0

Simple CMS for portfolios - second version.

## Features (roadmap)
- [x] Basic structure
- [ ] Components:
  - [x] Header
  - [ ] Footer
  - [x] Navigation bar
  - [ ] Page
  - [ ] Paragraph (advanced editor)
  - [ ] Card (with image)
  - [ ] Form
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
    - API endpoints:
        - [ ] PUT /api/pages/
        - [ ] PATCH /api/pages/{id}
        - [ ] DELETE /api/pages/{id}
        - [ ] PUT /api/pages/{id}/components/
        - [ ] PATCH /api/pages/{id}/components/{id}
        - [ ] DELETE /api/pages/{id}/components/{id}
- [ ] Quick installation
    - [ ] Welcome screen
    - [ ] Automatic installation
      - API endpoints:
        - [ ] POST /api/install
- [ ] Dashboard
  - [ ] Page list
  - [ ] Page editor
  - [ ] Component editor
  - [ ] Settings
  - [ ] Logs
  - [ ] Help
  - [ ] About

## Installation
1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Open http://localhost:3000/