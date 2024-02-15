import Four_Circle from "../../public/logo.svg";
import Image from "next/image";
import "@/app/globals.css";

const About = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 py-16 px-4 md:px-8 lg:px-12 items-center lg:ml-20 md:ml-20">
      {" "}
      <div className="flex flex-col gap-8 lg:ml-20">
        <h1 className="text-black text-3xl tracking-widest md:text-4xl lg:text-5xl font-semibold">
          Funding futures, <span className="custom-green"> changing lives</span>
          .
        </h1>
        <p className="text-black text-sm md:text-sm lg:text-sm custom-grey">
          Simplify your life with MA everywhere, our online and mobile
          self-service platform that lets you instantly connect to your grants
          information.
        </p>
        <button className="self-start bg-blue-500 text-white py-2 px-4 rounded custom-green-background">
          Register
        </button>
      </div>
      <div className="flex items-center ml-20">
        {" "}
        <Image
          src={Four_Circle}
          alt="Logo"
          width={300}
          height={200}
          className="rounded-3xl transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default About;
