
const { sendFileNotFoundError: t, sendEditMenu: e, sendConfirmedError: a, sendChangeInformation: n, sendConfirmedQuestion: r, isEditMenu: i, sendCantConfirmYourself: o, sendIsConfirmed: m, sendIsUnconfirmed: d, sendTelegramId: l, sendFileAlreadyExists: c, sendYouNeedAtLeast : s, sendFileCreated: f, sendConfirmedFiles: p, sendCantConfirmAMoreConfirmed: u, sendDeleteConfirmation: g, sendUpdate: h } = require("./messages.compressed");
const { loadFile: x, saveFile: w, deepSearchFiles: y, deepListAllFiles: k, deleteFile: C, getChanges: _ } = require("./file.compressed");
const { checkMetadataKeyValue: U, editMetadataKeyValue: j, extractMetadataMarkdown: b, inexactMetadataMarkdown: M } = require("./metadata.compressed");
const onCallbackQuery = async (t, e, a) => { switch (e.data) { case "confirm": await onConfirmed(t, e.message, a); break; case "delete": await onDelete(t, e, a) }t.answerCallbackQuery(e.id) };
const onDelete = async (e, a, n) => { if (!a.message || !a.message.text || !a.message.chat || !a.message.chat.id) return; let r = a.message.chat.id, i = a.message.text.match(/\[([^)]+)\]/)[1].replace(/\[|\]/g, ""), o = x(n, i); if (!o || null == o) return t(e, `${r}`, i); let m = U(o.metadata, "confirmed", `${r}`); if (!m) { t(e, `${r}`, i); return } C(i), await onUpdate(e, i, "deleted", n), g(e, `${r}`, i) };
const onConfirm = async (e, a, n) => { if (!a.text || !a.chat || !a.chat.id || !a.from || !a.from.id) return; let r = a.chat.id, i = a.text.split(" ").slice(2).join(" "), l = a.from.id; if (r == l) { o(e, `${r}`); return } let c = x(n, i); c || t(e, `${r}`, i); let s = U(c?.metadata || {}, "confirmed", `${l}`), f = y("confirmed", `${l}`), p = y("confirmed", `${r}`); if (!s && f >= p) return u(e, `${r}`, i, f, p); let g = c || {}; g.name = i, g.metadata = j(g?.metadata || {}, "confirmed", `${l}`), w(g); await onUpdate(e, i, M(g.metadata, g.markdown), n); let h = U(g.metadata, "confirmed", `${l}`); h ? m(e, `${r}`, l, i) : d(e, `${r}`, l, i) };
const onChange = async (n, r, i) => { let o = r.chat.id, m = (r.text || "").split(" ").slice(1).join(" "), d = x(i, m); if (!d || null == d) { t(n, `${o}`, m); return } await n.sendMessage(`${o}`, M(d.metadata, d.markdown)); let l = U(d.metadata, "confirmed", `${o}`), c = y("confirmed", `${o}`), s = c >= 3; l || s ? e(n, `${o}`, m) : a(n, `${o}`, m) };
const onMessage = async (e, o, m) => { if (o.reply_to_message) { if (!i(o.reply_to_message.text || "")) return; let d = o.chat.id, l = (o.reply_to_message.text || "").match(/\[([^)]+)\]/)[1].replace(/\[|\]/g, ""), c = o.text || "", s = b(c); s && null != s || t(e, `${d}`, l); let f = x(m, l); if (!f) return t(e, `${d}`, l); if (!U(f?.metadata || {}, "confirmed", `${d}`)) { a(e, `${d}`, l); return } let p; if (await n(e, `${d}`, _(f, { name: l, metadata: s.metadata, markdown: s.markdown, category: f?.category || null, path: f?.path || null, date: f?.date || null })), !f || null == f) return t(e, `${d}`, l); r(e, `${d}`, l, s.content) } };
const onConfirmed = async (n, r, i) => { let o = r.chat.id, m = (r.text || "").split("\n")[0].match(/\[([^)]+)\]/)[1].replace(/\[|\]/g, ""), d = (r.text || "").split("\n").slice(1).join("\n"), l = x(i, m); if (!l || null == l) return t(n, `${o}`, m); if (!U(l.metadata, "confirmed", `${o}`)) { a(n, `${o}`, m); return } let c = b(d); c || t(n, `${o}`, m), l.metadata = c.metadata, l.markdown = c.markdown, l.name = m, w(l), await onUpdate(n, m, M(l.metadata, l.markdown), i), e(n, `${o}`, m) };
const onCreate = async (t, a, n) => { let r = a.chat.id, i = (a.text || "").split(" ").slice(2).join(" "), o = (a.text || "").split(" ").slice(-1)[0], m = i.replace(o, "").trim(), d = y("confirmed", `${a.from?.id}`); if (d < 1) return s(t, `${r}`, 1); let l = x(n, m); if (l) return c(t, `${r}`, m); let p = { mail: "", connections:  "", tags: [], connections: [], confirmed: [a.from?.id || ""] }, u = "\n42", g = M(p, u), h = m, k = { category: null, path: null, date: null, markdown: u, metadata: p, name: h }; w(k), await onUpdate(t, m, g, n), f(t, `${r}`, m), await t.sendMessage(`${r}`, g), e(t, `${r}`, m) };
const onCheck = async (t, e) => { let a = e.chat.id; if (e.from?.id != void 0) { await l(t, `${a}`, `${e.from.id}`); await p(t, `${a}`, k("confirmed", `${e.from.id}`)) } };
const onUpdate = async (t, e, a, n) => { let r = x(n, "Singularity"), i = x(n, e); if (!i || !r) return; let o = r.metadata.confirmed; if (!o) return; o.forEach(n => { h(t, n, e, a) }); let m = i.metadata.confirmed; m && m.forEach(n => { o.includes(n) || h(t, n, e, a) }) };

module.exports = {
    onCallbackQuery,
    onDelete,
    onConfirm,
    onChange,
    onConfirmed,
    onMessage,
    onCreate,
    onCheck,
    onUpdate
}