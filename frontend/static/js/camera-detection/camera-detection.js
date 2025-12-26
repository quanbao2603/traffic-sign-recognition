let stream = null;
let detectInterval = null;
let isDetecting = false;

const video = document.getElementById("video");
const canvas = document.getElementById("freezeCanvas");
const ctx = canvas.getContext("2d");
const placeholder = document.getElementById("placeholder");

const labelEl = document.getElementById("label");
const confidenceEl = document.getElementById("confidence");
const loadingText = document.getElementById("loadingText");
const previewBox = document.querySelector(".camera-preview");

const CONFIDENCE_THRESHOLD = 0.6;
const DETECT_INTERVAL_MS = 400;

async function startCamera() {
    stopAll();

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    video.style.display = "block";
    canvas.style.display = "none";
    placeholder.style.display = "none";
}

function stopAll() {
    if (detectInterval) {
        clearInterval(detectInterval);
        detectInterval = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    isDetecting = false;
}

function startDetecting() {
    if (!stream) {
        alert("Please start the camera first.");
        return;
    }

    if (isDetecting) return;

    isDetecting = true;
    loadingText.style.display = "block";
    labelEl.innerText = "Detecting...";
    confidenceEl.innerText = "---";

    previewBox.classList.remove("success", "error");

    detectInterval = setInterval(captureAndDetect, DETECT_INTERVAL_MS);
}

async function captureAndDetect() {
    if (!stream || !isDetecting) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob);

    try {
        const res = await fetch("/api/predict/image", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!data.success || !data.best) return;

        const best = data.best;

        if (best.confidence >= CONFIDENCE_THRESHOLD) {
            labelEl.innerText = best.label;
            confidenceEl.innerText = (best.confidence * 100).toFixed(2) + "%";

            previewBox.classList.add("success");

            freezeFrame();
        }
    } catch (err) {
        console.error(err);
    }
}

function freezeFrame() {
    clearInterval(detectInterval);
    detectInterval = null;
    isDetecting = false;

    loadingText.style.display = "none";

    video.style.display = "none";
    canvas.style.display = "block";

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}