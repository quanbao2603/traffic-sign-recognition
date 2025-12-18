let stream = null;
const video = document.getElementById("video");
const placeholder = document.getElementById("placeholder");

async function startCamera() {
    if (stream) return;

    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = "block";
    placeholder.style.display = "none";
}

function stopCamera() {
    if (!stream) return;

    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.style.display = "none";
    placeholder.style.display = "block";
}

async function detectFrame() {
    if (!stream) {
        alert("Please start the camera first.");
        return;
    }

    document.getElementById("loadingText").style.display = "block";
    document.getElementById("label").innerText = "Detecting...";
    document.getElementById("confidence").innerText = "---";

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob);

    const res = await fetch("/api/predict/image", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    document.getElementById("label").innerText = data.label || "Unknown";
    document.getElementById("confidence").innerText =
        data.confidence ? (data.confidence * 100).toFixed(2) + "%" : "N/A";

    document.getElementById("loadingText").style.display = "none";
}