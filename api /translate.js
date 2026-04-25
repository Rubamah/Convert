export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text } = req.body;

    // ترجمة وهمية للتجربة
    const fake = text
      .split("\n")
      .map(line => "🔹 " + line)
      .join("\n");

    return res.status(200).json({
      translatedText: fake
    });

  } catch (error) {
    return res.status(500).json({ error: "Server failed" });
  }
}
