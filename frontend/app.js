

const pdfInput = document.getElementById("pdf-input");
const uploadStatus = document.getElementById("upload-status");

const questionInput = document.getElementById("question");
const askBtn = document.getElementById("ask-btn");

const answerBox = document.getElementById("answer");
const answerText = document.getElementById("answer-text");

const statusText = document.getElementById("status");
const spinner = document.getElementById("spinner");

let uploadedFileName = "";

// PDF Upload
pdfInput.addEventListener("change", function () {

    if (pdfInput.files.length > 0) {

        uploadedFileName = pdfInput.files[0].name;

        uploadStatus.textContent =
            `Uploaded: ${uploadedFileName}`;

    } else {

        uploadedFileName = "";

        uploadStatus.textContent =
            "No file uploaded yet.";
    }
});

// Submit Button
askBtn.addEventListener("click", function () {

    const question = questionInput.value.trim();

    // Reset UI
    statusText.textContent = "";
    answerBox.classList.add("hidden");
    spinner.classList.add("hidden");

    statusText.style.color = "red";

    // Validate PDF
    if (uploadedFileName === "") {

        statusText.textContent =
            "Please upload a PDF.";

        return;
    }

    // Validate Question
    if (question === "") {

        statusText.textContent =
            "Please enter a question.";

        return;
    }

    // Show Loader
    statusText.style.color = "gray";
    statusText.textContent = "Thinking...";
    spinner.classList.remove("hidden");

    // Simulate AI Response
    setTimeout(function () {

        spinner.classList.add("hidden");

        statusText.textContent = "";

        answerBox.classList.remove("hidden");

        answerText.textContent =
            `The answer for "${question}" is displayed here.`;

    }, 2000);

});