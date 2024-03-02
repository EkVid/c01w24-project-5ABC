'use client'
import AccessibilityBar from "@/components/AccessibilityBar";
import QuestionBase from "@/components/GrantForm/QuestionBase";
import ToolboxCard from "@/components/GrantForm/SmallComponents/ToolboxCard";
import Toolbox from "@/components/GrantForm/Toolbox";
import FontSizeContext from "@/components/utils/FontSizeContext";
import ReducedMotionContext from "@/components/utils/ReducedMotionContext";
import { getTheme, initTheme } from "@/components/utils/theme";
import { DndContext, DragOverlay, closestCenter, useDraggable} from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToParentElement, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { useContext, useEffect, useId, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const FormComponent = dynamic(() => import("@/components/GrantForm/FormComponent"), {
  ssr: false,
})

const testbody = [
  {
    question: "What's your name?",
    type: process.env.NEXT_PUBLIC_TYPE_TEXT,
    errMsgArr: ["Invaldi ererif here"],
    options:
    {
      isMultipleLines: true,
      minCharsNum: 3,
      maxCharsNum: null,
    },
    curFile: {name: "notactualfile.txt"},
    isCurFileDeleting: false,
  },
  {
    question: "Any attachments?",
    type: process.env.NEXT_PUBLIC_TYPE_FILE,
    errMsgArr: ["Invaldi file error here"],
  },
  {
    question: "What's your education time?",
    type: process.env.NEXT_PUBLIC_TYPE_DATE,
    errMsgArr: ["Invaldi date error here"],
    options:
    {
      isDateRange: true,
      isBothRequired: false,
    }
  },
  {
    question: "What's your phone number?",
    type: process.env.NEXT_PUBLIC_TYPE_PHONE,
    errMsgArr: ["phone neu error"]
  },
  {
    question: "What's your email?",
    type: process.env.NEXT_PUBLIC_TYPE_EMAIL,
    errMsgArr: ["email error"]
  },
  {
    question: "Do you have a driver's license?",
    type: process.env.NEXT_PUBLIC_TYPE_MULTI,
    answers: ["Yes", "No"],
    isRequired: true,
    errMsgArr: null,
    errEmptyAnsIdxArr: [],
    errDupAnsIdxArr: []
  },
  {
    question: "Select all that apply",
    type: process.env.NEXT_PUBLIC_TYPE_CHECKBOX,
    answers: ["Tall", "Smol", "Wide", "Thinn"],
    isRequired: false,
    errMsgArr: ["eerror 1", "erro2"],
    options:
    {
      isAllAnOption: false,
      isNoneAnOption: false
    }
  },
  {
    question: "Enter your age:",
    type: process.env.NEXT_PUBLIC_TYPE_NUMBER,
    errMsgArr: ['rr'],
    options:
    {
      isIntegerOnly: false,
      minNum: 0,
    }
  }
]

const FormEditor = () => {
 
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AccessibilityBar onChangeTheme={curTheme => setLightTheme(curTheme)} />
      <FormComponent/>
    </div>
  )
}

export default FormEditor;