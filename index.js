const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// 计算md5
const calculateMd5 = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

// 保存图片
const saveImage = (data, fileName) => {
  const outputDir = path.resolve(__dirname, "./output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const filePath = path.resolve(outputDir, fileName);
  if (fs.existsSync(filePath)) {
    console.log(`File ${fileName} already exists`);
    return;
  }
  fs.writeFileSync(filePath, data);
};

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 创建ErrorResponse
const createErrorResponse = (message) => {
  return {
    success: false,
    message,
  };
};

// 上传文件
app.post("/upload", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { url } = req.body;
  if (!url) {
    res.status(400).json(createErrorResponse("Missing url"));
    return;
  }
  // 校验url是否合法
  try {
    const parsedUrl = new URL(url);
  } catch (error) {
    res.status(400).json(createErrorResponse("Invalid url"));
    return;
  }

  // 通过axios请求url
  try {
    const image = await axios.get(url, { responseType: "arraybuffer" });
    const md5 = calculateMd5(image.data);
    const ext = url.split("?")[0].split(".").pop();
    const fileName = `${md5}.${ext}`;
    console.log(`Saving image to ./output/${fileName}`);
    saveImage(image.data, fileName);
    res.send(
      JSON.stringify({
        success: true,
        data: {
          md5,
          fileName,
        },
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(createErrorResponse("Failed to download image from url"));
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
