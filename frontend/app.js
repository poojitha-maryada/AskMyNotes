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
askBtn.addEventListener("click", async function () {

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

    try {

        // Send question to FastAPI backend
        const response = await fetch(
            "https://backend-ppu8.onrender.com/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Request failed");
        }

        // Hide loader
        spinner.classList.add("hidden");
        statusText.textContent = "";

        // Show answer
        answerBox.classList.remove("hidden");

        answerText.textContent = data.answer;

    } catch (error) {

        spinner.classList.add("hidden");

        statusText.style.color = "red";

        statusText.textContent =
            "Unable to connect to the backend.";

        console.error(error);
    }

});