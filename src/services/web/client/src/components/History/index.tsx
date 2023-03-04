import "./index.css";
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
              <p key={index + history?.role} className="user-history">
                <span className="avatar">🧑‍🦲</span>
                <span className="content">{history?.content}</span>
              </p>
            );
          }
          if (history?.role === "assistant") {
            html = (
              <p key={index + history?.role} className="assistant-history">
                <span className="avatar">🤖</span>
                <span className="content">{history?.content}</span>
              </p>
            );
          }
          return html;
        })}
    </section>
  );
}
export default History;
