export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text, source, target } = req.body;

    // لو المستخدم اختار Auto نخليه English افتراضي
    const from = source === "auto" ? "en" : source;

    const url = "https://api.mymemory.translated.net/get?q="
      + encodeURIComponent(text)
      + "&langpair=" + from + "|" + target;

    const response = await fetch(url);
    const data = await response.json();

    console.log("API response:", data);

    if (!data || !data.responseData) {
      return res.status(500).json({ error: "No translation returned" });
    }

    return res.status(200).json({
      translatedText: data.responseData.translatedText
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Translation failed" });
  }
}
