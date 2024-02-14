
const e = require("path");
const t = require("fs");
const a = require("glob"); 
const { checkMetadataKeyValue : l, extractMetadataMarkdown : r, inexactMetadataMarkdown : n, editMetadataKeyValue : i } = require("./metadata.compressed");

const loadFile = (e, a, l, n, i) => { let o = "", s = null; if (l && l.length > 0) s = l; else if (a && a.length > 0) s = getFilePath(a); else { let c = getFilePaths(); c.length > 1 && (n && n.length > 0 && (c = c.filter(e => e.includes(n))), c.length > 1 && i && i.length > 0 && (c = c.filter(e => e.includes(i)))) } if (!s) return console.error(`File ${a} not found. ${(l?.length || 0) > 0 ? `Path: ${l}` : ""}`), { metadata: {}, markdown: "", name: "", category: "", path: "", date: "" }; try { o = t.readFileSync(s).toString() } catch { o = "" } let { metadata: d, markdown: g } = r(o), { category: h, date: m, name: p } = getCategoryDateName(s), u = { metadata: d, markdown: g, content: o, name: p, category: h, path: s, date: m }; return hasLockAndNoCredentials(u, e) ? null : u }; let hasAllFilterTags = (e, t) => { let a = !0; for (let l = 0; l < t.length; l++) { let r = t[l]; if (!e.includes(r)) { a = !1; break } } return a }, hasLockAndNoCredentials = (e, t) => { let a = void 0 !== e.metadata.credentials, l = 0 === t.length; return (!!a || !!l) && !(t.filter(t => !!e.metadata.credentials && ("string" == typeof e.metadata.credentials ? e.metadata.credentials === t : !!Array.isArray(e.metadata.credentials) && (console.log(`Checking ${e.metadata.credentials} for credential ${t}`), e.metadata.credentials?.includes(t)))).length > 0) };
const loadFiles = (e = null, a = [], l = null, n = null, i = 0) => { let o = getFilePaths(); n && (o = o.filter(e => e.includes(getFileDatePath(n)))), e && (o = o.filter(t => t.includes(e))), i > 0 && (o = o.slice(0, i)); let s = []; return o.forEach(e => { let { metadata: n, markdown: i } = r(t.readFileSync(e).toString()), { category: o, name: c, date: d } = getCategoryDateName(e), g = { metadata: n, markdown: i, name: c, category: o, path: e, date: d }; if (!(!hasAllFilterTags(n?.tags || [], a) && 0 !== a.length || hasLockAndNoCredentials(g, l || []))) ["credentials", "confirmed"].forEach(e => { delete g.metadata[e] }), s.push(g) }), s };
const getCategoryDateName = e => { let t = e.replace(getDocsDir(), ""); return { category: t.split(/(?:\/|\\)([^\/\\]+)/)[1] || "", date: t.split(/(?:\/|\\)(\d+)(?:\/|\\)(\d+)(?:\/|\\)(\d+)/).filter(e => !isNaN(Number(e))).filter(e => e.length > 0).reverse().join("-") || "", name: t.split(/(?:\/|\\)([^\/\\]+)\.md$/)[1] || "" } };
const getChanges = (e, t) => { let a = [], l = l => { let r = (t.metadata[l] || "").toString(), n = (e.metadata[l] || "").toString(); r !== n && a.push({ type: "metadata", key: l, post: r, past: n }) }, r = (e, t, l, r) => { e !== t && a.push({ type: l, key: r, post: e, past: t }) }; Object.keys(t.metadata).forEach(l), Object.keys(e.metadata).forEach(e => { void 0 === t.metadata[e] && l(e) }); let n = (t.markdown || "").split(/\r?\n|\r/), i = (e.markdown || "").split(/\r?\n|\r/), o = Math.max(n.length, i.length); for (let s = 0; s < o; s++) { let c = n[s] || "", d = i[s] || ""; r(c, d, "markdown", `line_${s + 1}`) } return a };
const saveFile = e => { let a = e.path ? e.path : getFilePath(e.name, e.date, e.category); if (a) { let l = a.split(/[\/\\]/).slice(0, -1).join("/"); if (t.existsSync(l) || t.mkdirSync(l, { recursive: !0 }), null == e) { t.unlinkSync(a); return } let r = n(e.metadata, e.markdown); t.writeFileSync(a, r) } };
const getFileDatePath = e => { let t = e.split(".").reverse(); for (let a = 0; a < t.length; a++)t[a].startsWith("0") && (t[a] = t[a].substring(1)); return t.join("/") };
const getFilePath = (t, a = null, l = null) => { let r = getFilePaths(t); return r.length > 0 ? r[0] : a && l ? e.join(getDocsDir(), `${l}s`, getFileDatePath(a), `${t}.md`) : !!l && e.join(getDocsDir(), `${l}s`, `${t}.md`) };
const getDocsDir = () => __dirname.includes(".next") ? e.join(__dirname, "..", "..", "..", "..", "..", "docs").toString() : e.join(__dirname, "..", "docs").toString();
const getFilePaths = (t = "**") => { let l = e.join(getDocsDir(), "**", `${t}.md`); l = (l = l.replace(/\\/g, "/")).replace(/\/\//g, ""); let r = a.sync(l, { nocase: !0 }); return r.length > 0 ? r : [l.replace("**/", "")] };
const deepSearchFiles = (e, a) => { let n = 0; for (let i of getFilePaths()) { let { metadata: o } = r(t.readFileSync(i).toString()); l(o, e, a) && n++ } return n };
const deepListFiles = l => { let n = e.join(getDocsDir(), "**", "*.md"), i = a.sync(n), o = []; for (let s of i) { let { metadata: c } = r(t.readFileSync(s).toString()); c[l] && (Array.isArray(c[l]) ? c[l].forEach(e => { o.includes(e) || o.push(e) }) : o.includes(c[l]) || o.push(c[l])) } return o };
const deepListAllFiles = (n, i) => { let o = e.join(getDocsDir(), "**", "*.md"), s = a.sync(o), c = []; for (let d of s) { let { metadata: g } = r(t.readFileSync(d).toString()); l(g, n, i) && c.push(d.split("docs/")[1]) } return c };
const deleteFile = e => { let a = getFilePath(e); return !!a && (t.unlinkSync(a), !0) };
const generateChangesFile = (e, t) => { let a = e; a.metadata = i(a.metadata, "cancel", "0"), a.metadata = i(a.metadata, "confirmed", "0"), a.metadata = i(a.metadata, "original", `[[${t}]]`); let l = `${new Date().toISOString().split("T")[0]}_${t}`; a.name = l, a.path = a.path?.replace(`${t}.md`, `${l}.md`) || ""; let r = a.category || ""; return a.category = "changes", a.path = (a.path || "").replace(r, a.category), console.log(a.path), a };

module.exports = {
    loadFile,
    loadFiles,
    getCategoryDateName,
    getChanges,
    saveFile,
    getFileDatePath,
    getFilePath,
    getDocsDir,
    getFilePaths,
    deepSearchFiles,
    deepListFiles,
    deepListAllFiles,
    deleteFile,
    generateChangesFile,
}