# School Website Project

This repository contains the source code for a **School Website** that I developed using a combination of HTML, Bootstrap, Glistbox, AOS (Animate on Scroll), Swiper, Isotope-Layout, ImagesLoaded, and JavaScript. The project also includes a Firebase-powered **Admin Interface** for content management, enabling administrators to add or delete content, images, and more from the main website. Additionally, I integrated **Email.js** for collecting emails directly from the website.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Admin Interface](#admin-interface)
- [Firebase Integration](#firebase-integration)
- [Email Integration](#email-integration)
- [Installation](#installation)
- [Usage](#usage)
- [Live Demo](#live-demo)

## Overview

The school website is designed to be responsive, interactive, and user-friendly. It features animated content, a clean gallery section, and smooth scrolling transitions. Users can navigate through different sections of the website with ease, and the admin interface allows real-time updates to the content.

## Features

- **Responsive Design**: Built with HTML and Bootstrap, the site works across all devices and screen sizes.
- **Interactive Animations**: Utilizes AOS for smooth animations and Glistbox for a stunning gallery experience.
- **Swiper Integration**: Dynamic content sliders and carousels enhance the user experience.
- **Isotope & ImagesLoaded**: Intelligent layout for filtering and sorting content with seamless loading of images.
- **Admin Interface**: A custom admin interface built with Firebase for managing website content in real-time.
- **Email Collection**: Integrated Email.js for gathering emails through contact forms.

## Technologies Used

- **HTML5**
- **Bootstrap 5**: For responsive design and components.
- **JavaScript**: For interactive functionality across the website.
- **[Glistbox](https://www.glightbox.com/)**: A lightbox gallery plugin.
- **[AOS](https://michalsnik.github.io/aos/)**: Animation on scroll library.
- **[Swiper](https://swiperjs.com/)**: A modern mobile touch slider.
- **[Isotope-Layout](https://isotope.metafizzy.co/)**: A filtering and sorting layout library.
- **[ImagesLoaded](https://imagesloaded.desandro.com/)**: Ensures images are loaded before layout rendering.
- **Firebase**: For database and content management.
- **Email.js**: For email collection and handling contact form submissions.

## Admin Interface

The admin interface provides a way to:

- **Add or Delete Content**: Admins can upload new content, delete outdated information, and update the website dynamically.
- **Image Management**: Upload or remove images from galleries or other sections using Firebase.
- **Real-time Updates**: Changes made by the admin are reflected on the website instantly without requiring manual intervention.

## Firebase Integration

The website uses Firebase for storing and retrieving content dynamically:

- **Firestore Database**: Stores data such as text, images, and other content.
- **Firebase Storage**: Manages media files like images.
- **Firebase Authentication**: Protects the admin panel with secure login functionality.

## Email Integration

Using **Email.js**, the website includes a contact form that allows visitors to send emails directly from the website. This email service is integrated without the need for backend infrastructure, making it lightweight and easy to maintain.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/reachverse/school-website.git
   ```

```bash
cd school-website

npm install

npm start

```

## Usage

- Viewing the Website: Once installed, open index.html in your preferred web browser to view the site.
- Admin Panel: Navigate to the /admin path (e.g., localhost/admin) to access the admin interface. You will need to authenticate using the Firebase-provided credentials.
- Updating Content: Use the admin panel to add, edit, or delete content. Changes are reflected on the website in real time.

## Live Demo

Check out the live version of the website [here](https://reachverse.github.io/school-website/).

## License

This project is licensed under the Reach License
