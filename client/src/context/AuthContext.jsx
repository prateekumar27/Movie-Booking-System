import { createContext, useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendOTP, verifyOTP, activate, logout } from "../api/index.js";
import { toast } from "react-hot-toast";
import axiosConfig from "../utils/axiosConfig.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [showModel, setShowModel] = useState(false);
  const [user, setUser] = useState(null);
  const [interval, setInterval] = useState(null);
  const [authData, setAuthData] = useState();
  const [auth, setAuth] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  //Mutation

  const sendOtpRequestMutation = useMutation({
    mutationFn: (email) => sendOTP(email),
  });
  const verifyOtpRequestMutation = useMutation({
    mutationFn: (reqData) => verifyOTP(reqData),
  });

  const activateUserMutation = useMutation({
    mutationFn: (reqData) => activate(reqData),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
  });

  const toggleModel = () => {
    setShowModel(!showModel);
    if (step !== 1) {
      setStep(1);
    }
  };

  const sendOtpRequest = async ({ email, onNext }) => {
    sendOtpRequestMutation.mutate(email, {
      onSuccess: (res) => {
        console.log("sendOtp res:", res); // check what res actually is

        // res is already the data object {hash, email, msg}
        setAuthData(res); // ✅ not res.data

        toast.success("OTP sent successfully");
        onNext();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });
  };

  const verifyOtpRequest = async ({ otp, onNext }) => {
    console.log("verifyOtpRequest called", { otp, authData });

    if (!authData) {
      toast.error("Session expired. Please request OTP again.");
      return;
    }

    const { hash, email } = authData;
    const reqData = { email, otp, hash };

    console.log("reqData being sent:", reqData);

    verifyOtpRequestMutation.mutate(reqData, {
      // in verifyOtpRequest onSuccess:
      onSuccess: (res) => {
        console.log("isNewUser:", res.isNewUser);
        setUser(res.user);
        setAccessToken(res.accessToken);
        // axiosConfig.defaults.headers.common["Authorization"] =
        //   `Bearer ${res.accessToken}`; // ✅ all future requests will include this
        setAuth(true);
        toast.success("Login successful!");

        if (!res.user?.name) {
          onNext();
        } else {
          toggleModel();
        }
      },
      onError: (err) => {
        console.log("verify error", err);
        toast.error(err?.response?.data?.message || "Invalid OTP");
      },
    });
  };

  const activateUserRequest = async (data) => {
    const { name, phone } = data;
    const id = user?._id;
    const reqData = { id, name, phone, token: accessToken };

    activateUserMutation.mutate(reqData, {
      onSuccess: (res) => {
        console.log("activateUser res:", res);
        setUser(res.user);
        setAuth(true);
        toggleModel();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });
  };

  const logoutUser = async () => {
    logoutMutation.mutate(null, {
      onSuccess: (res) => {
        console.log(res.data);
        setUser(null);
        setAuth(false);
        window.location.href = "/";
      },
      onError: (err) => {
        console.log(err);
        toast.error(err?.response?.error?.message || "Something went wrong");
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        step,
        setStep,
        showModel,
        toggleModel,
        sendOtpRequest,
        verifyOtpRequest,
        activateUserRequest,
        logoutUser,
        setUser,
        setAuth,
        auth,
        authData,
        user,
        otpLoader: sendOtpRequestMutation.isPending,
        verifyLoader: verifyOtpRequestMutation.isPending,
        activateLoader: activateUserMutation.isPending,
        logoutLoader: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
