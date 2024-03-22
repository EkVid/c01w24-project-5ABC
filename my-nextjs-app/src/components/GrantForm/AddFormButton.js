"use client"
import { useRouter } from "next/navigation";

const AddFormButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/formEditor")} className="custom-text dark:d-text custom-interactive-btn m-1">
      Create new form
    </button>
  )
}

export default AddFormButton;