import { useContext, useState } from "react";
import FontSizeContext from "../utils/FontSizeContext";
import ReducedMotionContext from "../utils/ReducedMotionContext";
import OptionsDiv from "./SmallComponents/OptionsDiv";
import Checkbox from "./SmallComponents/Checkbox";

const QNumber = ({options, optionsErrMsgArr, isEditMode, onSelectAnswer, onChangeOptions}) => {
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const isReduceMotion = useContext(ReducedMotionContext);

  const isIntegerOnly = options?.isIntegerOnly ? options.isIntegerOnly : false;
  const minNum = options?.minNum ? options.minNum : 0;
  const maxNum = options?.maxNum;
}

export default QNumber;