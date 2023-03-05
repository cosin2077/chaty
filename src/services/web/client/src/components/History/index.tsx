import "./index.css";
import { marked } from "marked";
import highlight from "highlight.js";
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
