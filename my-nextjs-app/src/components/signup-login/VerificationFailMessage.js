const VerificationFailMessage = ({ text }) => {
  return (
    <div className="fixed top-0 left-0 w-full p-4 bg-red-500 text-white text-center shadow-md">
      <p>{text}</p>
    </div>
  );
};

export default VerificationFailMessage;