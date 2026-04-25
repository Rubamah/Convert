export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text, target } = req.body;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    let translated = "";

    data[0].forEach(item => {
      translated += item[0];
    });

    return res.status(200).json({
      translatedText: translated
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Translation failed" });
  }
}
