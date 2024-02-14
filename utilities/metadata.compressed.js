const displayMetadata = t => {
    let e = ""; for (let a in t) e += `**${a}:** ${t[a]}
`; return e
}; 
const deserializeMetadata = t => { let e = t.split("\n").filter(t => "" !== t.trim()), a = {}; for (let r of e) { let [n, ...i] = r.split(":").map(t => t.trim()); a[n] = i.join(":").trim() } let l = ""; for (let o in a) { let d = o.includes(" ") && o.includes("-"), s = "" === a[o]; d && s ? (a[l] && Array.isArray(a[l]) || (a[l] = []), a[l].push(o.replace(/ /g, "").replace(/-/g, "").replace(/\"/g, "")), delete a[o]) : l = o } return a }; 
const serializeMetadata = t => {
    let e = ""; for (let a in t) Array.isArray(t[a]) ? (e += `${a}:
`, t[a].forEach(t => {
        e += `  - ${isNaN(Number(t)) ? t : `"${t}"`}
`})) : e += `${a}: ${t[a]}
`; return e
}; 
const editMetadataKeyValue = (t, e, a) => { let r = { ...t }; return Array.isArray(r[e]) ? r[e].map(t => t.toString()).includes(a.toString()) ? r[e] = r[e].filter(t => t.toString() !== a.toString()) : r[e].push(a) : "confirmed" == e ? r[e] = [a] : r[e] = a, r }; 
const checkMetadataKeyValue = (t, e, a) => !!t && !!t[e] && (Array.isArray(t[e]) ? t[e].filter(t => t.toString() === a.toString()).length > 0 : t[e] === a); 
const removeMetadataKeyValue = (t, e, a = null) => (Array.isArray(t[e]) && a ? t[e] = t[e].filter(t => t !== a) : delete t[e], t); 
const updateMetadataKeyValue = (t, e, a) => (t[e] = a, t); 
const extractMetadataMarkdown = t => { let e = t.split("---"); if (e.length < 3) return { metadata: {}, markdown: "", content: t }; if (e.length <= 1) return { metadata: {}, markdown: e[0], content: t }; let a = deserializeMetadata(e[1]), r = e[2]; return { metadata: a, markdown: r, content: t } }; 
const inexactMetadataMarkdown = (t, e) => `---
${serializeMetadata(t)}---${e}`;

module.exports =  {
    displayMetadata,
    deserializeMetadata,
    serializeMetadata,
    editMetadataKeyValue,
    checkMetadataKeyValue,
    removeMetadataKeyValue,
    updateMetadataKeyValue,
    extractMetadataMarkdown,
    inexactMetadataMarkdown
}