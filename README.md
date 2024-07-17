# SchoolConnect

SchoolConnect is a platform designed to bridge the gap between volunteers and schools by making it easier for schools to search for volunteers based on specific criteria and for volunteers to see and apply for opportunities posted by schools.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Components](#components)
7. [Firestore Structure](#firestore-structure)
8. [Contributing](#contributing)
9. [License](#license)

## Overview

SchoolConnect aims to facilitate the connection between volunteers and schools by providing an intuitive interface for managing volunteer opportunities and applications. Schools can post listings for volunteer opportunities, and volunteers can apply for these listings based on their qualifications and interests.

## Features

- **Volunteer and School Profiles**: Manage detailed profiles for both volunteers and schools.
- **Listing Management**: Schools can create and manage listings for volunteer opportunities.
- **Search and Filter**: Search and filter functionalities for both schools and volunteers based on multiple criteria.
- **Application Process**: Seamless application process for volunteers.
- **Notifications**: Custom notifications for application statuses and updates.
- **PDF Rendering**: Render volunteer details and certificates in PDF format.

## Tech Stack

- **Frontend**: React, Material UI, Vite
- **Backend**: Firebase (Firestore, Authentication)
- **PDF Rendering**: `react-pdf`, `react-pdf-viewer`
- **Date Handling**: `date-fns`

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Aka-Jr/SchoolConnect.git
    cd schoolconnect
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Setup Firebase:**

    - Create a Firebase project.
    - Add your Firebase configuration to `src/firebaseConfig.js`.

4. **Start the development server:**

    ```bash
    npm run dev
    ```

## Usage

### Running the Project

To start the project in development mode, use:

```bash
npm run dev
