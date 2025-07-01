import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
    import {
      getStorage,
      ref,
      uploadBytes,
      getDownloadURL,
    } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
    import {
      getFirestore,
      collection,
      getDocs,
      deleteDoc,
      onSnapshot,
      doc,
    } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDKHZ1viqinUqJcs4He9QGnq2Ld82jSt-M",
      authDomain: "juli-tola.firebaseapp.com",
      projectId: "juli-tola",
      storageBucket: "juli-tola.appspot.com",
      messagingSenderId: "452807393853",
      appId: "1:452807393853:web:2c58c3ca257ea605f6e054",
      measurementId: "G-FVNPXHKQLJ",
    };

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const db = getFirestore(app);
    const galleryRef = collection(db, "gallery");
    const newsletterRef = collection(db, "newsletters");

    function displayMessage(message, isError = false) {
      const messageDiv = document.getElementById("message");
      messageDiv.textContent = message;
      messageDiv.style.color = isError ? "red" : "green";
      setTimeout(() => (messageDiv.textContent = ""), 3000);
    }

    async function loadGallery() {
      const galleryContainer = document.getElementById("gallery-preview");
      galleryContainer.innerHTML = "";
      try {
        const querySnapshot = await getDocs(galleryRef);
        querySnapshot.forEach((doc) => {
          const imageData = doc.data();
          const galleryItem = document.createElement("div");
          galleryItem.classList.add("col-lg-4", "col-md-4");

          galleryItem.innerHTML = `
      <div class="gallery-item">
        <a href="${imageData.url}" class="glightbox" data-gallery="images-gallery">
          <img src="${imageData.url}" alt="Gallery Image" class="img-fluid">
        </a>
      </div>
    `;
          galleryContainer.appendChild(galleryItem);
        });

        const lightbox = GLightbox({
          selector: ".glightbox",
        });
      } catch (error) {
        console.error("Error loading gallery:", error);
        displayMessage("Error loading gallery", true);
      }
    }
    /*******NEWSLETTER SECTION********/
  async function loadNewsletters() {
const swiperWrapper = document.querySelector(".swiper-wrapper");
swiperWrapper.innerHTML = ""; // Clear current slides

try {
    const querySnapshot = await getDocs(newsletterRef);
    querySnapshot.forEach((doc) => {
        const newsletterData = doc.data();
        const swiperSlide = createNewsletterSlide(newsletterData);
        swiperWrapper.appendChild(swiperSlide);
    });

    // Initialize GLightbox for both images and videos
    const lightbox = GLightbox({
        selector: ".glightbox",
    });

    // Check for PiP support before adding event listeners
    if ('pictureInPictureEnabled' in document) {
        document.querySelectorAll(".pulsating-play-btn").forEach((playButton) => {
            playButton.addEventListener("click", async (event) => {
                const video = event.target.closest(".swiper-slide").querySelector(".newsletter-video");

                if (video) {
                    try {
                        // Exit PiP if already active, otherwise enter PiP mode
                        if (document.pictureInPictureElement) {
                            await document.exitPictureInPicture();
                        } else {
                            await video.requestPictureInPicture();
                        }
                    } catch (error) {
                        console.error("Error with Picture-in-Picture:", error);
                        displayMessage("Picture-in-Picture is not supported or permission denied.", true);
                    }
                }
            });
        });
    } else {
        // Notify if PiP is unsupported on this browser
        console.warn("Picture-in-Picture is not supported in this browser.");
        displayMessage("Picture-in-Picture is not supported in this browser.", true);
    }
} catch (error) {
    console.error("Error loading newsletters:", error);
    displayMessage("Error loading newsletters", true);
}
}

function createNewsletterSlide(newsletterData) {
const swiperSlide = document.createElement("div");
swiperSlide.className = "swiper-slide";

swiperSlide.innerHTML = `
<section id="news" class="about">
    <div class="container">
        <div class="row gy-4">
            <div class="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="100">
                <img src="${newsletterData.thumbnailURL}" class="img-fluid" alt="Video Thumbnail">
                <a href="${newsletterData.mediaURL}" class="glightbox pulsating-play-btn" data-glightbox="type: video"></a>
                <video class="newsletter-video" controls style="display: none;">
                    <source src="${newsletterData.mediaURL}" type="video/mp4">
                </video>
            </div>
            <div class="col-lg-6 content" data-aos="fade-up" data-aos-delay="200">
                <h3>${newsletterData.title}</h3>
                <p class="fst-italic">${newsletterData.description}</p>
                <ul>
                    ${newsletterData.highlights
                      .map(
                          (highlight) => `<li><i class="bi bi-check2-circle"></i> <span>${highlight}</span></li>`
                      )
                      .join("")}
                </ul>
                <p>${newsletterData.additionalInfo}</p>
            </div>
        </div>
    </div>
</section>
`;

return swiperSlide;
}

// Function to load and display teachers
function loadTeachers() {
    const teacherList = document.getElementById("teacherList");
    onSnapshot(collection(db, "teachers"), (snapshot) => {
        teacherList.innerHTML = ""; // Clear existing content
        snapshot.forEach((doc) => {
            const teacher = doc.data();
            const teacherCard = `
<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
    <div class="member">
        <div class="pic">
            <img src="${teacher.profilePic}" class="img-fluid" alt="${teacher.name}">
        </div>
        <div class="member-info">
            <h4>${teacher.name}</h4>
            <span>${teacher.position}</span>
            <div class="social">
                ${teacher.twitter ? `<a href="${teacher.twitter}" target="_blank"><i class="bi bi-twitter-x"></i></a>` : ""}
                ${teacher.facebook ? `<a href="${teacher.facebook}" target="_blank"><i class="bi bi-facebook"></i></a>` : ""}
                ${teacher.instagram ? `<a href="${teacher.instagram}" target="_blank"><i class="bi bi-instagram"></i></a>` : ""}
                ${teacher.linkedin ? `<a href="${teacher.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>` : ""}
            </div>
        </div>
    </div>
</div>`;

                teacherList.insertAdjacentHTML('beforeend', teacherCard);
        });
    });
}


    window.onload = function () {
      loadGallery();
      loadNewsletters();
      loadTeachers();
    };

