
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    document.querySelector(".loading").style.display = "block";
    document.querySelector(".err-message").style.display = "none";
    document.querySelector(".sent-message").style.display =
      "none";

    var formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
    };

    emailjs
      .send("service_nescwfd", "template_9pjxwwb", formData)
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);

          document.querySelector(".loading").style.display =
            "none";
          document.querySelector(".err-message").style.display =
            "none";
          document.querySelector(".sent-message").style.display =
            "block";

          document.getElementById("contact-form").reset();
        },
        function (error) {
          console.log("FAILED...", error);

          document.querySelector(".loading").style.display =
            "none";
          document.querySelector(".sent-message").style.display =
            "none";
          document.querySelector(".err-message").style.display =
            "block";
          document.querySelector(".err-message").innerHTML =
            "❌ Error: " + error.text;
        }
      );
  });
