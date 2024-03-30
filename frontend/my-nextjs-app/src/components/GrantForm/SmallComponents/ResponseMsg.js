import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { useContext } from "react";

const ResponseMsg = ({msg, isMarginBottomAdded, isNoResponse}) => {
  const isReducedMotion = useContext(ReducedMotionContext);

  return (
    <p className={`text-sm custom-text dark:d-text ${isMarginBottomAdded ? "mb-2" : ""} ${isNoResponse ? "italic" : ""} ${isReducedMotion ? "" : "transition"}`}>
      {isNoResponse ? "(no response)" : msg}
    </p>
  )
}

export default ResponseMsg;