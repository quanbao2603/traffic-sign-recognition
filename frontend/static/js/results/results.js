let imageHistory = [];
let cameraHistory = [];
let currentTab = "image";

async function loadHistory(type) {
    const res = await fetch(`/api/results/${type}`);
    const data = await res.json();

    if (type === "image") {
        imageHistory = data;
    } else {
        cameraHistory = data;
    }

    renderResults();
}

function renderResults() {
    const imageBox = document.getElementById("imageResults");
    const cameraBox = document.getElementById("cameraResults");
    const empty = document.getElementById("emptyState");

    imageBox.innerHTML = "";
    cameraBox.innerHTML = "";

    const currentData =
        currentTab === "image" ? imageHistory : cameraHistory;

    if (currentData.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    currentData.forEach(item => {
        const typeLabel =
            currentTab === "image" ? "Image Detection" : "Camera Detection";
        const box =
            currentTab === "image" ? imageBox : cameraBox;

        box.innerHTML += createCard(item, typeLabel);
    });
}

function createCard(item, type) {
    return `
        <div class="result-card">
            <img src="${item.image}" alt="result">
            <div class="result-info">
                <h3>${item.label}</h3>
                <p>Type: ${type}</p>
                <p>Confidence:
                    <strong>${(item.confidence * 100).toFixed(2)}%</strong>
                </p>
                <p>Time: ${new Date(item.time).toLocaleString()}</p>
            </div>
        </div>
    `;
}

function switchTab(tab, event) {
    currentTab = tab;

    document.querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));
    event.target.classList.add("active");

    document.getElementById("imageResults")
        .classList.toggle("hidden", tab !== "image");
    document.getElementById("cameraResults")
        .classList.toggle("hidden", tab !== "camera");

    loadHistory(tab);
}

async function clearHistory() {
    await fetch(`/api/results/${currentTab}`, {
        method: "DELETE"
    });

    if (currentTab === "image") {
        imageHistory = [];
    } else {
        cameraHistory = [];
    }

    renderResults();
}

loadHistory("image");
