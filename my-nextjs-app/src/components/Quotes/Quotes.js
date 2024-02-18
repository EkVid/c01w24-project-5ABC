import CheckWord from "./CheckWord";
import QuoteCard from "./QuoteCard";
import AccessiblityIcon from "@/../public/accessibility.svg";
import DevelopmentIcon from "@/../public/development.svg";
import AccomodationIcon from "@/../public/accomodation.svg";

const Quotes = () => {
  return (
    <div className="flex flex-col items-center mx-10 mt-20 mb-10">
      <div className="flex flex-col mb-5">
        <h2 className="custom-dark-grey-text dark:d-text text-center text-4xl font-bold mb-4">
          Helping Remove Accessibility Barriers
        </h2>
        <p className="custom-grey dark:d-text text-center text-md">
          We work to develop solutions that increase usability, reach, and
          efficiency within your organization
        </p>
      </div>
      <div className="flex flex-col items-center lg:grid lg:grid-cols-3">
        <div className="flex flex-col items-center mt-10 lg:min-h-full">
          <CheckWord word={"Accessible"} />
          <QuoteCard
            img={AccessiblityIcon}
            title={"Accessibility"}
            content={
              "Committed to removing barriers and creating accessible and adaptive solutions that empower people with disabilities in the workplace."
            }
          />
        </div>
        <div className="flex flex-col items-center mt-10 lg:min-h-full">
          <CheckWord word={"Equitable"} />
          <QuoteCard
            img={DevelopmentIcon}
            title={"Development"}
            content={
              "Developing technology supports that promote inclusion and provide meaningful opportunities for marginalized individuals to reach their full potential."
            }
          />
        </div>
        <div className="flex flex-col items-center mt-10 lg:min-h-full">
          <CheckWord word={"Inclusive"} />
          <QuoteCard
            img={AccomodationIcon}
            title={"Accomodation"}
            content={
              "Ensuring that all people have access to the same resources and opportunities regardless of their abilities by efficiently providing workplace accommodations."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Quotes;
