let selectedFile = null;

function selectImage() {
    document.getElementById("imageInput").click();
}

document.getElementById("imageInput").addEventListener("change", (e) => {
    selectedFile = e.target.files[0];

    const preview = document.getElementById("preview");
    const placeholder = document.getElementById("placeholder");

    preview.classList.remove("success", "error");

    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.style.display = "block";
            placeholder.style.display = "none";
        };
        reader.readAsDataURL(selectedFile);
    }
});

async function detectImage() {
    if (!selectedFile) {
        alert("Please upload an image first.");
        return;
    }

    const preview = document.getElementById("preview");

    document.getElementById("label").innerText = "Detecting...";
    document.getElementById("confidence").innerText = "...";
    document.getElementById("loadingText").style.display = "block";
    document.getElementById("resultCard").style.display = "block";

    preview.classList.remove("success", "error");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await fetch("/api/predict/image", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        document.getElementById("loadingText").style.display = "none";

        if (!data.success || !data.detections || data.detections.length === 0) {
            document.getElementById("label").innerText = "No traffic sign detected";
            document.getElementById("confidence").innerText = "N/A";
            preview.classList.add("error");
            return;
        }

        const detection = data.detections[0];

        document.getElementById("label").innerText = detection.label;
        document.getElementById("confidence").innerText =
            (detection.confidence * 100).toFixed(2) + "%";

        preview.classList.add("success");

    } catch (err) {
        console.error(err);
        document.getElementById("loadingText").innerText = "❌ Detection failed";
        preview.classList.add("error");
    }
}