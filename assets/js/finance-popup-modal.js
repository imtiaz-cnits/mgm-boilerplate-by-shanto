// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
    document.documentElement.style.overflowY = "hidden"; // Disable scrolling
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    document.documentElement.style.overflowY = "scroll"; // Enable scrolling
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.documentElement.style.overflowY = "scroll"; // Enable scrolling
    }
}


// ................................. End ......................................................................


// Table Action Button Modal Start
// Get all open-modal buttons and close buttons
var openBtns = document.querySelectorAll('.custom-open-modal-btn');
var closeBtns = document.querySelectorAll('.custom-close');

// Function to open the modal instantly
function openModal(modal) {
  modal.classList.remove('hide'); // Ensure the hide class is removed first (if present)
  modal.style.display = "block"; // Instantly make the modal visible

  // Start the fade-in effect after a tiny delay to trigger CSS transition
  setTimeout(function() {
    modal.classList.add('show');
  }, 10);  // Small timeout to trigger the transition
}

// Function to close the modal smoothly
function closeModal(modal) {
  modal.classList.add('hide'); // Add the hide class to trigger fade-out
  modal.classList.remove('show'); // Remove the show class

  // After the fade-out completes, hide the modal
  setTimeout(function() {
    modal.style.display = "none";
  }, 400);  // Match the duration of the transition
}

// Attach event listeners to all open buttons
openBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var modalId = this.getAttribute('data-modal'); // Get the target modal id
    var modal = document.getElementById(modalId); // Get the modal by id
    openModal(modal); // Open the modal instantly
  });
});

// Attach event listeners to all close buttons
closeBtns.forEach(function(closeBtn) {
  closeBtn.addEventListener('click', function() {
    var modal = this.closest('.custom-modal'); // Get the closest modal
    closeModal(modal); // Close the modal smoothly
  });
});

// Close the modal if the user clicks outside of the modal content
window.onclick = function(event) {
  if (event.target.classList.contains('custom-modal')) {
    closeModal(event.target); // Close modal if clicked outside the modal content
  }
}

// Table Action Button Modal End