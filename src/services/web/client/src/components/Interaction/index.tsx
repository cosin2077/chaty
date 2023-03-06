import { disable } from "colors";
import {
  useState,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useEffect,
} from "react";
import { resetMessage, sendMessage } from "../../hooks/useFetch";
import "./index.css";
type InteractionType = {
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  history: any[];
};
function useLatest(value: any) {
  const ref = useRef<any[]>([]);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
function Interaction({ history, setHistory }: InteractionType) {
  const [placeholder, setPlaceholder] = useState("Enter something...");
  const [searchText, setSearchText] = useState("ask");
  const latestHistory = useLatest(history);
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const onlyUser = "user";
  const handleAsk = useCallback(async () => {
    if (!value) return;
    try {
      setDisabled(true);
      setSearchText("loading...");
      const oldValue = value;
      setValue("");
      let newHistory = [...latestHistory.current!];
      newHistory.push({
        role: "user",
        content: oldValue,
      });
      setHistory(newHistory);

      setPlaceholder("AI is thinking...");
      const res = await sendMessage(oldValue, onlyUser);

      let historyAfter = [...latestHistory.current!];
      historyAfter.push({
        role: "assistant",
        content: res?.data || res,
      });
      setHistory(historyAfter);
    } catch (err) {
      console.log(err);
    } finally {
      setDisabled(false);
      setSearchText("ask");
      setPlaceholder("Enter something...");
    }
  }, [value, history]);
  const handleClear = useCallback(() => {
    setHistory([]);
    resetMessage(onlyUser);
  }, [value]);
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);
  const handleKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleAsk();
      }
    },
    [value]
  );

  return (
    <section className="interaction">
      <input
        type="text"
        className="input"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
      <button disabled={disabled} className="send" onClick={handleAsk}>
        {searchText}
      </button>
      <button
        title="clear dialog/清除会话"
        className="clear"
        onClick={handleClear}
      >
        🧹
      </button>
    </section>
  );
}

export default Interaction;
