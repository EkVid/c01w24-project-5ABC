import Image from "next/image";

const QuoteCard = ({img, title, content}) => {
  return (
    <div className="flex flex-col items-center bg-white dark:d-custom-navy-background m-5 drop-shadow-lg shadow-lg rounded-md max-w-xl flex-auto pt-5">
      <Image
        src={img}
        alt="Card Icon"
        width={90}
        height={90}
        className="mb-5 lg:pt-5"
      />
      <h2 className="custom-dark-grey-text dark:text-white text-2xl font-bold text-center">
        {title}
      </h2>
      <p className="custom-grey dark:text-white text-sm m-5 mb-7 text-center lg:mb-0">
        {content}
      </p>
    </div>
  )
}

export default QuoteCard;