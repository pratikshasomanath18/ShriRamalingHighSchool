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


  firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Global form data object
let formData = {};

// Handle form steps
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show current step
  const currentStepElement = document.querySelectorAll('.form-step')[step - 1];
  if (currentStepElement) {
    currentStepElement.style.display = 'block';
  }
}

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
  showStep(1);
  
  // Add event listeners to all next buttons
  document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', function() {
      if (this.textContent === 'Preview') {
        // Generate preview before showing final step
        generatePreview();
        currentStep = totalSteps;
      } else {
        currentStep++;
      }
      showStep(currentStep);
    });
  });
  
  // Add event listeners to all previous buttons
  document.querySelectorAll('.prev-btn').forEach(button => {
    button.addEventListener('click', function() {
      currentStep--;
      showStep(currentStep);
    });
  });
  
  // Handle passport photo preview
  document.getElementById('passport').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
      document.getElementById('passportPreview').src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
  
  // Handle form submission
  document.getElementById('applicationForm').addEventListener('submit', handleSubmit);
});

// Generate preview of form data
function generatePreview() {
  // Collect all form data
  const formElements = document.getElementById('applicationForm').elements;
  for (let element of formElements) {
    if (element.id) {
      formData[element.id] = element.value;
    }
  }
  
  // Create preview HTML
  const previewHTML = `
    <div class="preview-container p-4">
      <h4 class="text-center mb-4">Application Preview</h4>
      
      <!-- Personal Details -->
      <div class="section mb-4">
        <h5>Personal Details</h5>
        <div class="row">
          <div class="col-md-4">
            <img src="${document.getElementById('passportPreview').src}" 
                 alt="Passport Preview" 
                 class="img-fluid rounded mb-2" 
                 style="max-width: 150px">
          </div>
          <div class="col-md-8">
            <p><strong>Name:</strong> ${formData.applicantName || ''}</p>
            <p><strong>Date of Birth:</strong> ${formData.dob || ''}</p>
            <p><strong>Gender:</strong> ${formData.gender || ''}</p>
            <p><strong>Religion:</strong> ${formData.religion || ''}</p>
            <p><strong>Nationality:</strong> ${formData.nationality || ''}</p>
          </div>
        </div>
      </div>
      
      <!-- Medical Information -->
      <div class="section mb-4">
        <h5>Medical Information</h5>
        <p><strong>Allergies:</strong> ${formData.allergies || ''}</p>
        <p><strong>Allergy List:</strong> ${formData.allergyList || ''}</p>
        <p><strong>Medications:</strong> ${formData.medications || ''}</p>
        <p><strong>Immunization Status:</strong> ${formData.immunization || ''}</p>
        <p><strong>Special Needs:</strong> ${formData.specialNeeds || ''}</p>
      </div>
      
      <!-- Parents Information -->
      <div class="section mb-4">
        <h5>Parents Information</h5>
        <div class="father-info mb-3">
          <h6>Father's Details</h6>
          <p><strong>Name:</strong> ${formData.fatherName || ''}</p>
          <p><strong>Office Address:</strong> ${formData.fatherOfficeAddress || ''}</p>
          <p><strong>Residential Address:</strong> ${formData.fatherResidentialAddress || ''}</p>
          <p><strong>Phone:</strong> ${formData.fatherPhone || ''}</p>
        </div>
        <div class="mother-info">
          <h6>Mother's Details</h6>
          <p><strong>Name:</strong> ${formData.motherName || ''}</p>
          <p><strong>Office Address:</strong> ${formData.motherOfficeAddress || ''}</p>
          <p><strong>Residential Address:</strong> ${formData.motherResidentialAddress || ''}</p>
          <p><strong>Phone:</strong> ${formData.motherPhone || ''}</p>
        </div>
      </div>
    </div>
  `;
  
  // Insert preview into the last step
  const previewStep = document.querySelectorAll('.form-step')[totalSteps - 1];
  previewStep.innerHTML = previewHTML + `
    <div class="d-flex justify-content-between mt-4">
      <button type="button" class="btn btn-secondary prev-btn rounded-pill">Previous</button>
      <button type="submit" class="btn btn-success rounded-pill">Submit Application</button>
    </div>
  `;
  
  // Reattach previous button event listener
  previewStep.querySelector('.prev-btn').addEventListener('click', function() {
    currentStep--;
    showStep(currentStep);
  });
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  try {
    // Upload passport photo
    const passportFile = document.getElementById('passport').files[0];
    let passportUrl = '';
    
    if (passportFile) {
      const storageRef = storage.ref(`passports/${Date.now()}_${passportFile.name}`);
      await storageRef.put(passportFile);
      passportUrl = await storageRef.getDownloadURL();
    }
    
    // Collect final form data
    const finalFormData = {
      ...formData,
      passportUrl,
      submittedAt: new Date()
    };
    
    // Save to Firestore
    await db.collection('applications').add(finalFormData);
    
    // Show success message
    Swal.fire({
      title: 'Success!',
      text: 'Your application has been submitted successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Reset form and return to first step
        document.getElementById('applicationForm').reset();
        document.getElementById('passportPreview').src = 'https://via.placeholder.com/150';
        currentStep = 1;
        showStep(1);
      }
    });
    
  } catch (error) {
    console.error('Error submitting form:', error);
    Swal.fire({
      title: 'Error!',
      text: 'There was an error submitting your application',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}