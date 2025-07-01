import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKHZ1viqinUqJcs4He9QGnq2Ld82jSt-M",
  authDomain: "juli-tola.firebaseapp.com",
  projectId: "juli-tola",
  storageBucket: "juli-tola.appspot.com",
  messagingSenderId: "452807393853",
  appId: "1:452807393853:web:2c58c3ca257ea605f6e054",
  measurementId: "G-FVNPXHKQLJ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

let formData = {};
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.form-step')[step - 1].style.display = 'block';
}
document.getElementById('parentSignature').addEventListener('change', event => {
const file = event.target.files[0];
const reader = new FileReader();

if (file) {
  reader.onload = () => {
    const signaturePreview = document.getElementById('signaturePreview');
    signaturePreview.src = reader.result;
    signaturePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
}
});


document.addEventListener('DOMContentLoaded', () => {
  showStep(1);

  document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        if (this.textContent === 'Preview') {
          generatePreview();
          currentStep = totalSteps;
        } else {
          currentStep++;
        }
        showStep(currentStep);
      }
    });
  });

  document.querySelectorAll('.prev-btn').forEach(button => {
    button.addEventListener('click', () => {
      currentStep--;
      showStep(currentStep);
    });
  });

  document.getElementById('passport').addEventListener('change', event => {
    const reader = new FileReader();
    reader.onload = () => document.getElementById('passportPreview').src = reader.result;
    reader.readAsDataURL(event.target.files[0]);
  });

  document.getElementById('applicationForm').addEventListener('submit', handleSubmit);
});

function validateStep(step) {
  const currentStepElement = document.querySelectorAll('.form-step')[step - 1];
  const inputs = currentStepElement.querySelectorAll('input, select, textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      input.classList.add('is-invalid');
      if (!input.nextElementSibling?.classList.contains('invalid-feedback')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = 'This field is required';
        input.parentNode.appendChild(errorDiv);
      }
    } else {
      input.classList.remove('is-invalid');
      const errorDiv = input.nextElementSibling;
      if (errorDiv?.classList.contains('invalid-feedback')) errorDiv.remove();
    }
  });

  return isValid;
}

function generatePreview() {
  const formElements = document.getElementById('applicationForm').elements;
  for (let element of formElements) {
    if (element.id) {
      formData[element.id] = element.value;
    }
  }
  const signatureImageSrc = document.getElementById('signaturePreview').src;

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
         <div class="col-md-6">
          <p><strong>State:</strong> ${formData.state || ''}</p>
          <p><strong>LGA:</strong> ${formData.lga || ''}</p>
          <p><strong>Home Town:</strong> ${formData.homeTown || ''}</p>
          <p><strong>Present Class:</strong> ${formData.presentClass || ''}</p>
          <p><strong>Name of Last School Attended:</strong> ${formData.lastSchool || ''}</p>
          <p><strong>Class To Which Admission Is Being Sought:</strong> ${formData.admissionClass || ''}</p>

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

    <!-- Declaration Section -->
    <div class="section mb-4">
      <h5>Declaration</h5>
      <p>I, <strong>${formData.declarationName || ''}</strong>, the parent of the applicant, 
         hereby declare that all the information provided in this form are accurate and true.</p>
<p><strong>Parent's Signature:</strong></p>
      <img src="${signatureImageSrc}" alt="Parent's Signature" class="img-fluid rounded" style="max-width: 150px;">
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

  previewStep.querySelector('.prev-btn').addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
  });
}
async function handleSubmit(e) {
e.preventDefault();

try {
  const passportFile = document.getElementById('passport').files[0];
  const signatureFile = document.getElementById('parentSignature').files[0];

  let passportUrl = '';
  let signatureUrl = '';

  if (passportFile) {
    const passportRef = ref(storage, `passports/${Date.now()}_${passportFile.name}`);
    await uploadBytes(passportRef, passportFile);
    passportUrl = await getDownloadURL(passportRef);
  }

  if (signatureFile) {
    const signatureRef = ref(storage, `signatures/${Date.now()}_${signatureFile.name}`);
    await uploadBytes(signatureRef, signatureFile);
    signatureUrl = await getDownloadURL(signatureRef);
  }

  const finalFormData = { 
    ...formData, 
    passportUrl, 
    signatureUrl, 
    submittedAt: new Date() 
  };

  await addDoc(collection(db, 'applications'), finalFormData);

  Swal.fire({
    title: 'Success!',
    text: 'Your application has been submitted successfully',
    icon: 'success',
    confirmButtonText: 'OK'
  }).then(result => {
    if (result.isConfirmed) {
      document.getElementById('applicationForm').reset();
      document.getElementById('passportPreview').src = 'https://via.placeholder.com/150';
      document.getElementById('signaturePreview').src = 'https://via.placeholder.com/150';
      document.getElementById('signaturePreview').style.display = 'none';
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

