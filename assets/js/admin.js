
  // Import Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
  import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
  import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot, updateDoc, arrayUnion, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDKHZ1viqinUqJcs4He9QGnq2Ld82jSt-M",
    authDomain: "juli-tola.firebaseapp.com",
    projectId: "juli-tola",
    storageBucket: "juli-tola.appspot.com",
    messagingSenderId: "452807393853",
    appId: "1:452807393853:web:2c58c3ca257ea605f6e054",
    measurementId: "G-FVNPXHKQLJ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const db = getFirestore(app);

  const galleryRef = collection(db, 'gallery');
  const newsletterRef = collection(db, 'newsletters');

  // ----------------------------------------------
  // Helper Functions
  // ----------------------------------------------

  // Display SweetAlert message for success or error
  function displayMessage(message, isError = false) {
    if (isError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
      });
      
    }
  }

  // ----------------------------------------------
  // Gallery Functions
  // ----------------------------------------------

  async function loadGallery() {
    const galleryContainer = document.getElementById('gallery-preview');
    galleryContainer.innerHTML = '';

    try {
      const querySnapshot = await getDocs(galleryRef);
      querySnapshot.forEach((doc) => {
        const imageData = doc.data();
        const imageElement = document.createElement('div');
        imageElement.classList.add('gallery-item');
        imageElement.innerHTML = `
          <img src="${imageData.url}" alt="Gallery Image">
          <button data-id="${doc.id}" class="delete-button">Delete</button>
        `;
        galleryContainer.appendChild(imageElement);
      });
    } catch (error) {
      console.error("Error loading gallery: ", error);
    }
  }

  document.getElementById('gallery-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('gallery-upload');
    const urlInput = document.getElementById('image-url');

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = ref(storage, `gallery/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await addDoc(galleryRef, { url: downloadURL });
        displayMessage('Image added successfully!');
        loadGallery();
      } catch (error) {
        displayMessage('Error uploading image', true);
      }
    } else if (urlInput.value.trim() !== '') {
      try {
        await addDoc(galleryRef, { url: urlInput.value.trim() });
        displayMessage('Image added successfully!');
        loadGallery();
      } catch (error) {
        displayMessage('Error adding image', true);
      }
    } else {
      displayMessage('Please upload an image or provide a URL', true);
    }

    fileInput.value = '';
    urlInput.value = '';
  });

  document.getElementById('gallery-preview').addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
      const docId = event.target.getAttribute('data-id');
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this image. This cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(galleryRef, docId));
          displayMessage('Image deleted successfully!');
          loadGallery();
        } catch (error) {
          displayMessage('Error deleting image', true);
        }
      }
    }
  });

  loadGallery();

  // ----------------------------------------------
// Newsletter Functions
// ----------------------------------------------

async function fetchCurrentNewsletters() {
  const newslettersContainer = document.getElementById('currentNewsletters');
  newslettersContainer.innerHTML = '';

  try {
    const querySnapshot = await getDocs(newsletterRef);
    querySnapshot.forEach(async (docSnapshot) => {
      const newsletterData = docSnapshot.data();
      console.log('Fetched newsletter data:', newsletterData); // Log full data
      const newsletterCard = createNewsletterCard(newsletterData, docSnapshot.id);
      newslettersContainer.appendChild(newsletterCard);
    });

    if (querySnapshot.empty) {
      displayMessage("No newsletters available.");
    }
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    displayMessage('Error fetching newsletters', true);
  }
}
function createNewsletterCard(newsletterData, newsletterId) {
  const newsletterCard = document.createElement('div');
  newsletterCard.className = 'newsletter-card';

  const title = document.createElement('h5');
  title.textContent = `Title: ${newsletterData.title}`;
  newsletterCard.appendChild(title);

  const description = document.createElement('p');
  description.textContent = `Description: ${newsletterData.description}`;
  newsletterCard.appendChild(description);

  const highlights = document.createElement('ul');
  newsletterData.highlights.forEach((highlight) => {
    const li = document.createElement('li');
    li.textContent = highlight;
    highlights.appendChild(li);
  });
  newsletterCard.appendChild(highlights);

  const additionalInfo = document.createElement('p');
  additionalInfo.textContent = newsletterData.additionalInfo.split(',').join('\n');
  newsletterCard.appendChild(additionalInfo);

  // Check if mediaURL exists and create video element
  if (newsletterData.mediaURL) {
    const videoElement = document.createElement('video');
    videoElement.src = newsletterData.mediaURL;
    videoElement.controls = true;
    videoElement.style.width = '100%';
    newsletterCard.appendChild(videoElement);
  } else {
    const noVideoText = document.createElement('p');
    noVideoText.textContent = 'No video available';
    newsletterCard.appendChild(noVideoText);
  }

  // Check if thumbnailURL exists and create image element
  if (newsletterData.thumbnailURL) {
    const thumbnail = document.createElement('img');
    thumbnail.src = newsletterData.thumbnailURL;
    thumbnail.alt = 'Video Thumbnail';
    thumbnail.style.width = '100%';
    newsletterCard.appendChild(thumbnail);
  } else {
    const noThumbnailText = document.createElement('p');
    noThumbnailText.textContent = 'No thumbnail available';
    newsletterCard.appendChild(noThumbnailText);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-button';
  deleteBtn.textContent = 'Delete Newsletter';
  deleteBtn.addEventListener('click', () => deleteNewsletter(newsletterId));
  newsletterCard.appendChild(deleteBtn);

  return newsletterCard;
}

// Delete newsletter with confirmation
async function deleteNewsletter(newsletterId) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this newsletter. This cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      const docRef = doc(db, 'newsletters', newsletterId);
      await deleteDoc(docRef);
      Swal.fire('Deleted!', 'Newsletter has been deleted successfully.', 'success');
      fetchCurrentNewsletters();
    } catch (error) {
      Swal.fire('Error', 'Error deleting newsletter', 'error');
    }
  }
}

document.getElementById('newsletter-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('newsletterTitle').value.trim();
  const description = document.getElementById('newsletterDescription').value.trim();
  const mediaInput = document.getElementById('newsletterMedia');
  const highlightsInput = document.getElementById('newsletterHighlights').value.trim();
  const additionalInfo = document.getElementById('newsletterAdditionalInfo').value.trim();
  const thumbnailInput = document.getElementById('newsletterThumbnail');

  if (title && description && mediaInput.files.length > 0) {
    const mediaFile = mediaInput.files[0];
    const mediaRef = ref(storage, `newsletter-media/${mediaFile.name}`);
    try {
      await uploadBytes(mediaRef, mediaFile);
      const mediaURL = await getDownloadURL(mediaRef);

      let thumbnailURL = '';
      if (thumbnailInput.files.length > 0) {
        const thumbnailFile = thumbnailInput.files[0];
        const thumbnailRef = ref(storage, `newsletter-thumbnails/${thumbnailFile.name}`);
        await uploadBytes(thumbnailRef, thumbnailFile);
        thumbnailURL = await getDownloadURL(thumbnailRef);
      }

       // Log media URL and thumbnail URL to see if they exist
  console.log('Media URL:', newsletterData.mediaURL);
  console.log('Thumbnail URL:', newsletterData.thumbnailURL);

  
      const highlightList = highlightsInput.split(',').map(item => item.trim());
      await addDoc(newsletterRef, {
        title,
        description,
        thumbnail: thumbnailURL,
        video: mediaURL,
        highlights: highlightList,
        additionalInfo
      });

      displayMessage('Newsletter added successfully!');
      fetchCurrentNewsletters();
    } catch (error) {
      displayMessage('Error adding newsletter', true);
    }
  } else {
    displayMessage('Please provide all required fields', true);
  }
});

fetchCurrentNewsletters();
 // ----------------------------------------------
  // Alumni Functions
  // ----------------------------------------------

        document.getElementById('student-form').addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const className = document.getElementById('class-name').value.trim();
            const studentName = document.getElementById('student-name').value.trim();
            const studentImage = document.getElementById('student-image').files[0];
    
            try {
                const storageRef = ref(storage, `students/${studentImage.name}`);
                await uploadBytes(storageRef, studentImage);
                const imageUrl = await getDownloadURL(storageRef);
    
                const classDoc = doc(db, 'classes', className);
                const classData = await getDoc(classDoc);
    
                if (classData.exists()) {
                    await updateDoc(classDoc, {
                        students: arrayUnion({
                            name: studentName,
                            imageUrl: imageUrl
                        })
                    });
                } else {
                    await setDoc(classDoc, {
                        students: [{
                            name: studentName,
                            imageUrl: imageUrl
                        }]
                    });
                }
    
                document.getElementById('student-form').reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Student added successfully!',
                    showConfirmButton: false,
                    timer: 1500
                });
                loadClasses();
            } catch (error) {
                console.error('Error adding student:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to add student',
                    text: 'Please try again.',
                });
            }
        });
    
        async function loadClasses() {
            const classList = document.getElementById('class-list');
            classList.innerHTML = '';
    
            const classesSnapshot = await getDocs(collection(db, 'classes'));
            classesSnapshot.forEach(doc => {
                const className = doc.id;
                const students = doc.data().students || [];
    
                const classItem = document.createElement('li');
                classItem.classList.add('class-item');
                classItem.innerHTML = `
                    <div class="class-header">
                        <strong class="class-name">${className}</strong>
                        <button class="delete-class-btn" onclick="deleteClass('${className}')">Delete Class</button>
                    </div>
                    <ul class="student-list">
                        ${students.map((student, index) => `
                            <li class="student-item">
                                <div class="student-info">
                                    <img class="student-img" src="${student.imageUrl}" alt="${student.name}">
                                    <span class="student-name">${student.name}</span>
                                </div>
                                <button class="delete-student-btn" onclick="deleteStudent('${className}', ${index})">Delete</button>
                            </li>`).join('')}
                    </ul>
                `;
                classList.appendChild(classItem);
            });
        }
    
        window.deleteClass = async function(className) {
            Swal.fire({
                title: `Are you sure you want to delete ${className}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await deleteDoc(doc(db, 'classes', className));
                    loadClasses();
                    Swal.fire({
                        icon: 'success',
                        title: `${className} deleted!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        };
    
window.deleteStudent = async function(className, studentIndex) {
    Swal.fire({
        title: `Are you sure you want to delete this student?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const classDoc = doc(db, 'classes', className);
            const classData = await getDoc(classDoc);

            if (classData.exists()) {
                const students = classData.data().students;
                students.splice(studentIndex, 1); // Remove the student at the specified index

                await updateDoc(classDoc, { students: students });

                loadClasses(); // Refresh the UI

                Swal.fire({
                    icon: 'success',
                    title: 'Student deleted!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    });
};

        window.onload = loadClasses;

 // ----------------------------------------------
  // Teacher Functions
  // ----------------------------------------------


         // Load teachers
    function loadTeachers() {
        const teacherList = document.getElementById("teacherList");
        onSnapshot(collection(db, "teachers"), (snapshot) => {
            teacherList.innerHTML = "";
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
                                    ${teacher.twitter ? `<a href="${teacher.twitter}" target="_blank"><i class="bi bi-twitter"></i></a>` : ""}
                                    ${teacher.facebook ? `<a href="${teacher.facebook}" target="_blank"><i class="bi bi-facebook"></i></a>` : ""}
                                    ${teacher.instagram ? `<a href="${teacher.instagram}" target="_blank"><i class="bi bi-instagram"></i></a>` : ""}
                                    ${teacher.linkedin ? `<a href="${teacher.linkedin}" target="_blank"><i class="bi bi-linkedin"></i></a>` : ""}
                                </div>
                                <button onclick="deleteTeacher('${doc.id}', '${teacher.profilePic}')" class="btn btn-danger mt-2">Delete</button>
                            </div>
                        </div>
                    </div>`;
                teacherList.insertAdjacentHTML('beforeend', teacherCard);
            });
        });
    }

    // Add teacher
    document.getElementById("teacherForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const position = document.getElementById("position").value;
        const profilePicFile = document.getElementById("profilePic").files[0];
        const twitter = document.getElementById("twitter").value;
        const facebook = document.getElementById("facebook").value;
        const instagram = document.getElementById("instagram").value;
        const linkedin = document.getElementById("linkedin").value;

        if (!profilePicFile) return;

        const storageRefPic = storageRef(storage, `teacherPics/${profilePicFile.name}`);
        const snapshot = await uploadBytes(storageRefPic, profilePicFile);
        const profilePicURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "teachers"), {
            name,
            position,
            profilePic: profilePicURL,
            twitter: twitter || null,
            facebook: facebook || null,
            instagram: instagram || null,
            linkedin: linkedin || null
        });

        Swal.fire("Added!", "Teacher has been added successfully.", "success");
        document.getElementById("teacherForm").reset();
    });

    // Delete teacher
    window.deleteTeacher = async function (id, profilePicURL) {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the teacher.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });
        if (confirmDelete.isConfirmed) {
            const picRef = storageRef(storage, profilePicURL);
            await deleteObject(picRef);
            await deleteDoc(doc(db, "teachers", id));
            Swal.fire("Deleted!", "Teacher has been deleted.", "success");
        }
    };

    loadTeachers();
  // ----------------------------------------------
  // Application Functions
  // ----------------------------------------------
  let applications = [];

async function loadApplications() {
  try {
    const querySnapshot = await getDocs(collection(db, "applications"));
    applications = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() });
    });
    renderApplications();
  } catch (error) {
    console.error("Error loading applications:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to load applications",
      icon: "error",
    });
  }
}

function renderApplications() {
  const container = document.getElementById("applicationsList");
  container.innerHTML = "";

  applications.forEach((app) => {
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";
    card.innerHTML = `
              <div class="card application-card h-100">
                  <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                          <h5 class="card-title">${
                            app.applicantName || "No Name"
                          }</h5>
                        
                      </div>
                      <p class="card-text">
                          <strong>Class:</strong> ${
                            app.admissionClass || "Not specified"
                          }<br>
                          <strong>Submitted:</strong> ${formatDate(
                            app.submittedAt
                          )}
                      </p>
                      <div class="d-flex justify-content-between mt-3">
  <button class="btn btn-success btn-sm d-flex align-items-center justify-content-center" style="width: 100px;" onclick="viewApplication('${app.id}')">
    <i class="fas fa-eye me-2"></i>View
  </button>
  <button class="btn btn-danger btn-sm d-flex align-items-center justify-content-center" style="width: 100px;" onclick="deleteApplication('${app.id}')">
    <i class="fas fa-trash me-2"></i>Delete
  </button>
</div>

                  </div>
              </div>
          `;
    container.appendChild(card);
  });
}

function formatDate(timestamp) {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
}

function getStatusColor(status) {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    default:
      return "warning";
  }
}

window.viewApplication = (id) => {
  const app = applications.find((a) => a.id === id);
  if (!app) return;

  const modalBody = document.getElementById("applicationDetails");
  modalBody.innerHTML = `
          <div class="container-fluid">
              <div class="row">
                  <div class="col-md-4">
                      <img src="${
                        app.passportUrl ||
                        "https://via.placeholder.com/150"
                      }" 
                           alt="Passport" 
                           class="img-fluid rounded mb-3">
                  </div>
                  <div class="col-md-8">
                      <h4>${app.applicantName}</h4>
                      <p class="text-muted">Application ID: ${app.id}</p>
                  </div>
              </div>
              <hr>
              <div class="row">
                  <div class="col-md-8">
<h2><strong>Personal Details</strong></h2> 
      <p><strong>Name:</strong> ${app.applicantName || ""}</p>
      <p><strong>Date of Birth:</strong> ${app.dob || ""}</p>
      <p><strong>Gender:</strong> ${app.gender || ""}</p>
      <p><strong>Religion:</strong> ${app.religion || ""}</p>
      <p><strong>Nationality:</strong> ${app.nationality || ""}</p>
    </div>
     <div class="col-md-6">
      <p><strong>State:</strong> ${app.state || ""}</p>
      <p><strong>LGA:</strong> ${app.lga || ""}</p>
      <p><strong>Home Town:</strong> ${app.homeTown || ""}</p>
      <p><strong>Present Class:</strong> ${app.presentClass || ""}</p>
      <p><strong>Name of Last School Attended:</strong> ${
        app.lastSchool || ""
      }</p>
      <p><strong>Class To Which Admission Is Being Sought:</strong> ${
        app.admissionClass || ""
      }</p>

              </div>

          </div>

           <div class="row">
              <hr/>
                  <div class="col-md-8">
<h2><strong>Medical Information</strong></h2> 
     <div class="section mb-4">
  <h5>Medical Information</h5>
  <p><strong>Allergies:</strong> ${app.allergies || "none"}</p>
  <p><strong>Allergy List:</strong> ${app.allergyList || "none"}</p>
  <p><strong>Medications:</strong> ${app.medications || "none"}</p>
  <p><strong>Immunization Status:</strong> ${
    app.immunization || "none"
  }</p>
  <p><strong>Special Needs:</strong> ${app.specialNeeds || "none"}</p>
</div>
              </div>

          </div>

           <div class="row">
              <hr/>
                  <div class="col-md-8">


<h2><strong>Parents Information</strong></h2> 
  <div class="father-info mb-3">
    <h6 class="mt-2"><strong>Father's Details</strong></h6>
    <p><strong>Name:</strong> ${app.fatherName || ""}</p>
    <p><strong>Office Address:</strong> ${
      app.fatherOfficeAddress || ""
    }</p>
    <p><strong>Residential Address:</strong> ${
      app.fatherResidentialAddress || ""
    }</p>
    <p><strong>Phone:</strong> ${app.fatherPhone || ""}</p>
  </div>
  <div class="mother-info">
    <h6 class="border-top mt-2"><strong>Mother's Details</strong></h6>
    <p><strong>Name:</strong> ${app.motherName || ""}</p>
    <p><strong>Office Address:</strong> ${
      app.motherOfficeAddress || ""
    }</p>
    <p><strong>Residential Address:</strong> ${
      app.motherResidentialAddress || ""
    }</p>
    <p><strong>Phone:</strong> ${app.motherPhone || ""}</p>
  </div>


</div>
              </div>


       <div class="row">
              <hr/>
                  <div class="col-md-8">


<h2><strong>Declaration</strong></h2> 
   <div class="section mb-4">
  <p>I, <strong>${app.declarationName || ''}</strong>, the parent of the applicant, 
     hereby declare that all the information provided in this form are accurate and true.</p>
<div>
  <strong>Parent's Signature:</strong><br>
          ${app.signatureUrl 
            ? `<img src="${app.signatureUrl}" alt="Parent's Signature" class="img-fluid mt-2" style="max-height: 150px;">`
            : "No signature uploaded."}
</div>
</div>



</div>
              </div>
              
              


          </div>

          
          </div>
      `;

  const modal = new bootstrap.Modal(
    document.getElementById("applicationModal")
  );
  modal.show();
};
window.deleteApplication = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this application? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  });

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, "applications", id));
      Swal.fire({
        title: "Deleted!",
        text: "The application has been deleted.",
        icon: "success",
      });
      loadApplications(); // Reload the applications list
    } catch (error) {
      console.error("Error deleting application:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the application.",
        icon: "error",
      });
    }
  } else {
    Swal.fire({
      title: "Cancelled",
      text: "The application was not deleted.",
      icon: "info",
    });
  }
};

// Initialize the app
loadApplications();

