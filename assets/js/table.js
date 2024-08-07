$(document).ready(function () {
  let currentPage = 1; // Current page number
  let rowsPerPage = parseInt($("#entries").val(), 10); // Rows per page
  let currentFilter = "all"; // Default filter

  // Function to update table based on current filters and pagination
  function updateTable() {
    const searchQuery = $("#searchInput").val().toLowerCase();
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    const filteredRows = $("tbody tr").filter(function () {
      const rowDate = $(this).data("date");
      const rowText = $(this).text().toLowerCase();

      // Filter by search query
      if (!rowText.includes(searchQuery)) {
        return false;
      }

      // Filter by date range
      if (currentFilter === "today") {
        return rowDate === today;
      } else if (currentFilter === "all") {
        return true;
      } else {
        const filterDays = parseInt(currentFilter, 10);
        const filterDate = new Date();
        filterDate.setDate(filterDate.getDate() - filterDays);
        return new Date(rowDate) >= filterDate;
      }
    });

    const totalRows = filteredRows.length;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    $("tbody tr").hide();
    filteredRows.slice(start, end).show();

    $("#display-info").text(
      `Showing ${start + 1} to ${Math.min(
        end,
        totalRows
      )} of ${totalRows} entries`
    );

    updatePagination(); // Update pagination links
  }

  // Update table when search input changes
  $("#searchInput").on("input", function () {
    currentPage = 1;
    updateTable();
  });

  // Update table when rows per page changes
  $("#entries").on("change", function () {
    rowsPerPage = parseInt($(this).val(), 10);
    currentPage = 1;
    updateTable();
  });

  // Update table when filter changes
  $(".dropdown-menus a").on("click", function (e) {
    e.preventDefault();
    currentFilter = $(this).data("filter");
    currentPage = 1;
    updateTable();
  });

  // Update pagination links
  function updatePagination() {
    const numRows = parseInt($("#entries").val(), 10);
    const totalRows = $("tbody tr").length;
    const totalPages = Math.ceil(totalRows / numRows);
    const pagesToShow = 3; // Number of pagination links to show
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    // Adjust startPage if not enough pages before it
    if (endPage - startPage + 1 < pagesToShow) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    let paginationHtml = "";

    if (currentPage > 1) {
      paginationHtml += `<a href="#" id="page-link-btn" class="page-link">Prev</a>`;
    }

    // Create page number links
    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `<a href="#" class="page-link ${
        i === currentPage ? "page-link--current" : ""
      }">${i}</a>`;
    }

    if (currentPage < totalPages) {
      paginationHtml += `<a href="#" id="page-link-btn" class="page-link">Next</a>`;
    }

    $("#pagination").html(paginationHtml);
  }

  // Handle page changes
  function handlePageChange(pageNum) {
    if (pageNum !== currentPage) {
      currentPage = pageNum;
      updateTable();
    }
  }

  // Event handler for pagination link clicks
  $(document).on("click", ".page-link", function (e) {
    e.preventDefault();
    let text = $(this).text();

    if (text === "Prev") {
      handlePageChange(currentPage - 1);
    } else if (text === "Next") {
      handlePageChange(currentPage + 1);
    } else {
      handlePageChange(parseInt(text, 10));
    }
  });

  // Event handler for previous and next buttons
  $("#prevBtn").on("click", function () {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  });

  $("#nextBtn").on("click", function () {
    const numRows = parseInt($("#entries").val(), 10);
    const totalRows = $("tbody tr").length;
    const totalPages = Math.ceil(totalRows / numRows);

    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  });

  // Event handler for changing the number of entries per page
  $("#entries").change(function () {
    updateTable();
  });

  // Initial setup of table and pagination
  updateTable();

  // Copy table to clipboard
  $("#copyBtn").click(function () {
    const range = document.createRange();
    range.selectNode(document.querySelector("table"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Table copied to clipboard!");
  });

  // Export table to CSV
  $("#csvBtn").click(function () {
    let csv = [];
    const rows = document.querySelectorAll("table tr");

    rows.forEach((row) => {
      const cols = row.querySelectorAll("td, th");
      let rowData = [];
      cols.forEach((col) => rowData.push(col.innerText));
      csv.push(rowData.join(","));
    });

    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = "data.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.click();
  });

  // Export table to PDF
  $("#pdfBtn").click(function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add the table content to the PDF
    doc.autoTable({
      html: "table",
      startY: 10,
    });

    // Save the PDF
    doc.save("data.pdf");
  });

  // Export table to XLSX
  $("#xlsxBtn").click(function () {
    const wb = XLSX.utils.table_to_book(document.querySelector("table"));
    XLSX.writeFile(wb, "data.xlsx");
  });

  // Print table
  $("#printBtn").click(function () {
    window.print();
  });
});

// Dropdown functionality
document.addEventListener("click", function (event) {
  const dropdownMenu = document.querySelector(".dropdown-menus");
  if (!event.target.closest(".dropdown-custom")) {
    dropdownMenu.style.display = "none"; // Hide dropdown if clicking outside
  }
});

document
  .querySelector(".dropdown-button")
  .addEventListener("click", function () {
    const dropdownMenu = document.querySelector(".dropdown-menus");
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block"; // Toggle dropdown visibility
  });

const filterLinks = document.querySelectorAll(".dropdown-menus a");
filterLinks.forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const filter = this.getAttribute("data-filter");
    applyFilter(filter); // Apply the selected filter
  });
});

function applyFilter(filter) {
  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case "today":
      startDate = endDate = today;
      break;
    case "7":
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      endDate = today;
      break;
    case "30":
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      endDate = today;
      break;
    case "365":
      startDate = new Date();
      startDate.setDate(today.getDate() - 365);
      endDate = today;
      break;
    case "custom":
      document.getElementById("custom-date-range").classList.remove("d-none"); // Show custom date range input
      return; // Return early to avoid applying the filter immediately
    case "all":
      startDate = null;
      endDate = null;
      break;
  }

  filterTable(startDate, endDate);

  if (filter !== "custom") {
    document.querySelector(".dropdown-menus").style.display = "none"; // Hide dropdown after applying filter
  }
}

document
  .getElementById("apply-date-range")
  .addEventListener("click", function () {
    const startDate = new Date(document.getElementById("start-date").value);
    const endDate = new Date(document.getElementById("end-date").value);
    filterTable(startDate, endDate);
    document.getElementById("custom-date-range").classList.add("d-none"); // Hide custom date range input
    document.querySelector(".dropdown-menus").style.display = "none"; // Hide dropdown
  });

function filterTable(startDate, endDate) {
  document.querySelectorAll("tbody tr").forEach((row) => {
    const rowDate = new Date(row.getAttribute("data-date"));

    if (!startDate && !endDate) {
      row.style.display = "";
    } else if (rowDate >= startDate && rowDate <= endDate) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });

  updateTable(); // Optionally call this to refresh table display information
}
