import StaticMath from "../components/StaticMath/StaticMath";
import MathInput from "../components/MathInput/MathInput";
import { useState, useEffect } from "react";
import "../public/styles/globals.css";
import { evaluateTex } from "tex-math-parser";

export default function App({}) {
  // lots of state management, could be improved(useReducer?)
  const [memory, setMemory] = useState({});
  const [solutionShown, setSolutionShown] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [quantity1, setQuantity1] = useState(1);
  const [quantity2, setQuantity2] = useState(1);
  const [quantity3, setQuantity3] = useState(1);
  const [quantity4, setQuantity4] = useState(1);
  const [totalCost1, setTotalCost1] = useState(1);
  const [totalCost2, setTotalCost2] = useState(1);
  const [answer, setAnswer] = useState();
  const [itemType, setItemType] = useState([]);
  const [hintFlag, setHintFlag] = useState(0);
  const items = [
    {
      item1: "apple",
      item2: "carrot",
      measurement: "kg of",
      denomination: "pence",
    },
    {
      item1: "TV",
      item2: "Washing machine",
      denomination: "pound",
    },
    {
      item1: "cars",
      item2: "vans",
      denomination: "pound",
    },
  ];

  useEffect(() => {
    let q1, q2, q3, q4, tc1, tc2, cost1, cost2;

    // Generate costs of each item
    cost1 = Math.ceil(Math.random() * 100);
    cost2 = Math.ceil(Math.random() * 100);

    // Generate quantities of each item (will loop, regenerating until the ratio of quantities of each item is not the same, therefore making the question solveable)
    do {
      q1 = Math.round(Math.random() * 10) + 1;
      q2 = Math.round(Math.random() * 10) + 1;
      q3 = Math.round(Math.random() * 10) + 1;
      q4 = Math.round(Math.random() * 10) + 1;
    } while (q1 / q2 === q3 / q4);

    // Calculate total costs based on quantities and costs
    tc1 = q1 * cost1 + q2 * cost2;
    tc2 = q3 * cost1 + q4 * cost2;

    // Calculate the answer to be stored in state later
    let answer = cost1 + cost2;

    setQuantity1(q1);
    setQuantity2(q2);
    setQuantity3(q3);
    setQuantity4(q4);
    setTotalCost1(tc1);
    setTotalCost2(tc2);
    setAnswer(answer);
    setItemType(answer < 75 ? items[0] : items[1]);
    console.log(answer);
  }, []);

  function addToMemory(newValue) {
    setMemory((prev) => {
      return { ...prev, ...newValue };
    });
  }

  let itemDenominationPrefix = itemType.denomination === "pound" ? "£" : "";
  let itemDenominationSuffix = itemType.denomination === "pence" ? "p" : "";

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "800px",
          width: "calc(100vw - 40px)",
          marginTop: "50px",
        }}
      >
        {/* <StaticMath
          latex={`\\text{The <StaticMath /> component can be used to write text inline with latex equations: } x^2 + 3x - 2`}
        /> */}
        <StaticMath
          latex={`\\text{${quantity1} ${
            itemType.measurement ? itemType.measurement : ""
          } ${itemType.item1}s and ${quantity2} ${
            itemType.item2
          }s have a total cost of ${itemDenominationPrefix}${totalCost1}${itemDenominationSuffix}. }`}
        />
        <br />
        <StaticMath
          latex={`\\text{${quantity3} ${
            itemType.measurement ? itemType.measurement : ""
          } ${itemType.item1}s and ${quantity4} ${
            itemType.item2
          }s have a total cost of ${itemDenominationPrefix}${totalCost2}${itemDenominationSuffix}. }`}
        />
        <br />
        <br />
        <StaticMath
          latex={`\\text{Work out the total cost of 1 ${
            itemType.measurement ? itemType.measurement : ""
          } ${itemType.item1} and 1 ${
            itemType.measurement ? itemType.measurement : ""
          } ${itemType.item2}.}`}
        />
        <br />
        <br />
        {solutionShown && <StaticMath latex={`\\text{Answer: } ${answer}`} />}
        <br />
        <br />
        {hintShown && (
          <>
            <StaticMath
              latex={`\\text{This is a Linear Equation, here's how you would get started:}`}
            />
            <br />
            <StaticMath
              latex={`\\text{${quantity1}x + ${quantity2}y = ${totalCost1}}`}
            />
            <StaticMath
              latex={`\\text{${quantity3}x + ${quantity4}y = ${totalCost2}}`}
            />
          </>
        )}
        <br />
        <br />
        <MathInput
          markingFunction={(userInput) => markingFunction(userInput, answer)}
          memKey="mathinput1"
          memory={memory}
          setMemory={addToMemory}
          placeholder="Type your answer here!"
        />
        <br />
        <br />
        <button
          onClick={() => {
            setMemory((prev) => {
              return { ...prev, feedbackShown: true };
            });
            setHintFlag((prevState) => (prevState += 1));
            console.log(hintFlag);
          }}
        >
          Check Answer
        </button>
        <br />
        {!solutionShown && (
          <button
            style={{ marginTop: "20px" }}
            onClick={() => {
              setSolutionShown(true);
            }}
          >
            Show Solution
          </button>
        )}
        {solutionShown && (
          <button
            style={{ marginTop: "20px" }}
            onClick={() => {
              setSolutionShown(false);
            }}
          >
            Hide Solution
          </button>
        )}
        <br />
        <br />
        {hintFlag >= 4 && (
          <button onClick={() => setHintShown((prevState) => !prevState)}>
            {hintShown ? "Hide" : "Show"} Hint
          </button>
        )}
      </div>
    </div>
  );
}

function markingFunction(userInput, answer) {
  let inputValue;
  try {
    //the evaluateTex function takes a latex string as an input and returns the evaluation as a javascript number
    inputValue = evaluateTex(userInput).evaluated;
  } catch {
    return 0;
  }
  if (inputValue === answer) {
    return 1;
  } else {
    return 0;
  }
}
