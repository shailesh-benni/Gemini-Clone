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

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async () => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    
    let newResponse = ""; // Initialize newResponse
    try {
      const response = await runChat(input); // Fetch response
      let responseArray = response.split("**");
      
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<br>" + responseArray[i] + "</br>";
        }
      }
      
      let newResponse2 = newResponse.split("*").join("</br>");
      setResultData(newResponse2); // Set the formatted result data
    } catch (error) {
      console.error("Error fetching data:", error);
      setResultData("Error: Failed to get a response."); // Handle error
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
