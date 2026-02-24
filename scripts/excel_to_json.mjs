import fs from "fs";
import path from "path";
import xlsx from "xlsx";

const INPUT_XLSX = path.resolve("data", "2025 PCP Accept New Patients.xlsx");
const OUTPUT_JSON = path.resolve("public", "data", "clinics.json");

const workbook = xlsx.readFile(INPUT_XLSX);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const rows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

function normalizePhone(s) {
  const digits = String(s || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits;
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const clinics = rows
  .filter((r) => r.Clinic && String(r.Clinic).trim() !== "")
  .map((r) => {
    const clinic = String(r.Clinic || "").trim();
    const address = String(r.Address || "").trim();
    const area = String(r.Area || "").trim();
    const phoneRaw = String(r.Contact || "").trim();

    return {
      id: slugify(clinic + "-" + address),
      clinic,
      address,
      intersection: String(r.Intersection || "").trim(),
      area,
      phone: normalizePhone(phoneRaw),
      phone_display: phoneRaw,
      hours: String(r["Operating Hours"] || "").trim(),
      wheelchair_accessible: String(r["Wheelchair Accessible"] || "").trim(),
      updated_at: new Date().toISOString().slice(0, 10),
    };
  });

fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(clinics, null, 2), "utf-8");

console.log(`✅ Wrote ${clinics.length} clinics to ${OUTPUT_JSON}`);