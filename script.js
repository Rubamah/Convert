let translatedText = "";

// تحميل ملف SRT
document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('inputText').value = e.target.result;
    };
    reader.readAsText(e.target.files[0]);
});

// ترجمة دفعة واحدة
async function translateBatch(lines) {
    const source = document.getElementById("sourceLang").value;
    const target = document.getElementById("targetLang").value;

    const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: lines.join("\n"),
            source,
            target
        })
    });

    const data = await res.json();

    // 👇 مهم: نشوف وش رجع API
    console.log("API response:", data);

    // 👇 حماية من الخطأ
    if (!data || !data.translatedText) {
        throw new Error("No translation returned from API");
    }

    return data.translatedText.split("\n");
}

// الترجمة
async function translateSRT() {
    const input = document.getElementById('inputText').value;
    const lines = input.split("\n");

    let textLines = [];
    let mapIndex = [];

    lines.forEach((line, i) => {
        if (
            line.trim() !== "" &&
            !line.match(/^\d+$/) &&
            !line.includes("-->")
        ) {
            textLines.push(line);
            mapIndex.push(i);
        }
    });

    document.getElementById("status").innerText = "⏳ جاري الترجمة...";
    document.getElementById("progressBar").value = 30;

    try {
        let translated = await translateBatch(textLines);

        mapIndex.forEach((index, i) => {
            lines[index] = translated[i] || lines[index];
        });

        translatedText = lines.join("\n");
        document.getElementById('outputText').value = translatedText;

        document.getElementById("progressBar").value = 100;
        document.getElementById("status").innerText = "✅ تمت الترجمة!";
    } catch (e) {
        console.error("Translation error:", e);

        document.getElementById("status").innerText =
            "❌ فشل الترجمة — تحقق من API أو الشبكة";
    }
}

// تحميل الملف
function downloadSRT() {
    const blob = new Blob([translatedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "translated.srt";
    link.click();
}
