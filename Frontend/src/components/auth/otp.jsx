import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { OtpIcon } from "../icons";

function Otp() {
  const [otp, setOtp] = useState("");

  const handleChange = (enteredOtp) => {
    setOtp(enteredOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`OTP entered: ${otp}`);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] mt-[80px] pb-[80px]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-[0px_20px_35px_rgba(0,0,0,.4)] flex flex-col items-center gap-4"
      >
        <OtpInput
          value={otp}
          onChange={handleChange}
          numInputs={6}
          isInputNum
          separator={<span className="mx-1.5" />}
          renderInput={(inputProps) => <input {...inputProps} />}
          inputStyle="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded-md bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Otp;