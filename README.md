# PortCMS v2.0

Simple CMS for portfolios - second version.

## Features (roadmap)
#### 🎉 Project milestone 2.0 completed!
*This roadmap may change at any time without notice.*
- [x] Basic structure
- [ ] Components:
  - [x] Hero
  - [ ] Footer [*planned for v2.1a*]
  - [x] Navigation bar
  - [x] Page
  - [x] Paragraph (advanced editor)
  - [ ] Card (with image) [*planned for v2.1a*]
  - [ ] Carousel [*planned for v2.1a*]
  - [ ] Accordion [*planned for v2.1a*]
  - [ ] Tabs (with content) [*planned for v2.1a*]
  - [ ] Counter [*planned for v2.2a*]
  - [ ] Team [*planned for v2.2a*]
- [x] Pages management (CRUD)
- [x] Components management (CRUD)
- [x] Quick installation
    - [x] Welcome screen
    - [x] Automatic installation
- [ ] Administration
  - [x] Page list
    - [ ] Advanced taxonomy (subpages) [*planned for v2.4a*]
  - [x] Page editor
  - [x] Component editor
  - [x] Settings
    - [x] Website metadata
    - [x] Progressive Web App
    - [x] Service mode
  - [ ] Logs [*planned for v2.3a*]
  - [ ] Help
  - [x] About
- [ ] UI localisation [*planned for v2.4a*]
- [ ] Advanced user permissions management (roles etc.) [*planned for v2.5a*]

## Installation
1. Install Git (if you don't have it already) and clone this repository:
    ```bash
    sudo apt install git
    git clone https://github.com/PetrusTryb/portcms/
    ```
2. Install Node.js (if you don't have it already) and install dependencies:
    ```bash
    sudo apt install nodejs npm
    npm install
    ```
3. Run `npm run dev` to start the development server. If everything went well, you should see the website with following message:
    ```text
    Database connection error.
    ```
4. That means that all you need to do is to configure the database.
   - Go to https://www.mongodb.com/cloud/atlas/register and create an account.
   - Create a new project and click on "Build a database" button. Select "Shared" and click on "Create" button. Pick any region that is close to you. Give Your cluster a name and click on "Create Cluster" button.
   - Set up your database user. Give it a username and password and click on "Add User" button. Then add your IP address to the whitelist and click on "Add IP Address" button. Finally, click on "Finish and Close" button.
   - On the left side of the screen, click on "Connect" button. Then click on "Connect Your Application" button. Copy the connection string and paste it into .env file (replace <password> with password to Your newly created database account).
5. Run `npm run dev` again. If everything went well, you should see the website with following message:
    ```text
    PortCMS is not installed.
    ```
6. That means that all you need to do is to install the CMS. Follow the instructions on the screen, and you should be good to go.

#### 🚧 Note
It may take a while for the database to be created. If you see the message "Database connection error" for a long time, just wait a bit and try restarting the server.

## Contributing
If you want to contribute to this project, you can do so by forking this repository and creating a pull request. If you want to report a bug or suggest a feature, you can do so by creating an issue.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.