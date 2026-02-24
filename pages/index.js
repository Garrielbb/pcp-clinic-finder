import { useMemo, useState } from "react";

export async function getStaticProps() {
  const clinics = require("../public/data/clinics.json");
  return { props: { clinics } };
}

export default function Home({ clinics }) {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("All");

  const areas = useMemo(() => {
    const set = new Set(clinics.map(c => c.area).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [clinics]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return clinics.filter(c => {
      const matchArea = area === "All" ? true : c.area === area;
      const hay = `${c.clinic} ${c.address} ${c.area}`.toLowerCase();
      const matchQ = query ? hay.includes(query) : true;
      return matchArea && matchQ;
    });
  }, [clinics, q, area]);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Find a Family Doctor (Accepting New Patients)</h1>

      <input
        placeholder="Search clinic or address..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: 10, width: "60%", marginRight: 10 }}
      />

      <select value={area} onChange={(e) => setArea(e.target.value)}>
        {areas.map(a => <option key={a}>{a}</option>)}
      </select>

      <p>{filtered.length} clinics found</p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map(c => (
          <li key={c.id} style={{ border: "1px solid #ddd", marginBottom: 12, padding: 12 }}>
            <b>{c.clinic}</b><br/>
            {c.address}<br/>
            {c.phone && <a href={`tel:${c.phone}`}>📞 {c.phone_display}</a>}
          </li>
        ))}
      </ul>
      <hr style={{ marginTop: "40px" }} />

<div style={{
  fontSize: "14px",
  color: "#555",
  background: "#f7f7f7",
  padding: "16px",
  borderRadius: "8px",
  marginTop: "20px"
}}>
  <strong>Disclaimer:</strong><br/>
  This website is an independently maintained community resource intended to help individuals locate primary care clinics that may be accepting new patients. 
  Information is compiled from publicly available sources and may change without notice. 
  Please contact clinics directly to confirm availability, hours, and eligibility. 
  This site does not provide medical advice and is not affiliated with any clinic, hospital, or government agency.
</div>
    </main>
  );
}