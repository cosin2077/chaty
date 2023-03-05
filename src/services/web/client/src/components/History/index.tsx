import "./index.css";
import { marked } from "marked";
import hljs from "highlight.js";
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
});

type HistoryType = {
  history: any[];
};
function History({ history }: HistoryType) {
  return (
    <section className="history">
      {history &&
        history.map((history, index) => {
          let html;
          if (history?.role === "user") {
            html = (
              <div key={index + history?.role} className="user-history">
                <span className="avatar">🤔</span>
                <span className="content">{history?.content}</span>
              </div>
            );
          }
          if (history?.role === "assistant") {
            html = (
              <div key={index + history?.role} className="assistant-history">
                <span className="avatar">🤖</span>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(history?.content),
                  }}
                ></div>
              </div>
            );
          }
          return html;
        })}
    </section>
  );
}
export default History;
