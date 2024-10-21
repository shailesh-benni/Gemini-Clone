import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayWord = (index, nextPart, isBold) => {
    setTimeout(() => {
      if (isBold) {
        setResultData((prev) => prev + `<b>${nextPart}</b> `); // Bold text
      } else {
        setResultData((prev) => prev + nextPart + " "); // Regular text
      }
    }, 150 * index); // Adjust speed (150ms delay between words)
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);

    try {
      const response = await runChat(input);

      // Split response by '**' to identify bold sections
      const responseArray = response.split("**");

      responseArray.forEach((part, index) => {
        const isBold = index % 2 === 1; // Bold for odd indices (between **)
        const words = part.split(" "); // Split part by words
        words.forEach((word, wordIndex) => {
          delayWord(index * words.length + wordIndex, word, isBold); // Add each word with delay
        });
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setResultData("Error: Failed to get a response.");
    } finally {
      setLoading(false);
      setInput(""); // Clear input field after sending
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    setShowResult,
    loading,
    input,
    setInput,
    setLoading,
    resultData,
    setResultData,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
