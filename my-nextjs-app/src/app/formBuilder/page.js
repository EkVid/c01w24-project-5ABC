import BaseLayout from "@/app/layout";
import FormComponent from "@/components/GrantForm/FormComponent";

export default function FormEditor() {

  return (
    <BaseLayout showFooter={false} restrictScroll={true}>
      <div className="flex flex-col w-screen custom-dark-grey-background dark:d-custom-dark-grey-background">
        <FormComponent/>
      </div>
    </BaseLayout>
  )
  
}