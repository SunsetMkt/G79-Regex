import fs from "fs/promises";
import { createDecipheriv, createHash } from "crypto";

const patchVersion = "unknown";
const inputFile = "./g79_regex.txt";

try {
    const base64Data = await fs.readFile(inputFile, "utf8");
    const encryptedMD5 = createHash("md5").update(base64Data).digest("hex");

    const encrypted = Buffer.from(base64Data, "base64");

    const encryptedFileName = `./g79_regex_${patchVersion}_encrypted_${encryptedMD5}.bin`;
    await fs.writeFile(encryptedFileName, base64Data);

    const decipher = createDecipheriv(
        "aes-256-cbc",
        Buffer.from(
            "6334326266376633396434373664623363343262663766333964343736646233",
            "hex"
        ),
        Buffer.from("63343262663766333964343736646233", "hex")
    );
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]).subarray(16);

    const decryptedMD5 = createHash("md5").update(decrypted).digest("hex");

    const decryptedFileName = `./g79_regex_${patchVersion}_decrypted_${decryptedMD5}.json`;
    await fs.writeFile(decryptedFileName, decrypted);

    await fs.unlink(inputFile);

    console.log(`解密完成`);
} catch (err) {
    console.error(err);
}
