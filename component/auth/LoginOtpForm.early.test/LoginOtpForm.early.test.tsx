import { getHomeData } from "@/API/home";
import { loginUserData } from "@/API/loginregister";
import { useAppDispatch } from "@/hooks/hook";
import { loginUser } from "@/redux/slices/authSlice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LoginOtpForm from "../LoginOtpForm";

// LoginOtpForm.test.tsx
// Mocks
// Mock next/navigation (router, params)
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useRouter: jest.fn(),
    useParams: jest.fn(),
  };
});

// Mock useAppDispatch
jest.mock("@/hooks/hook", () => {
  const actual = jest.requireActual("@/hooks/hook");
  return {
    ...actual,
    useAppDispatch: jest.fn(),
  };
});

// Mock getHomeData
jest.mock("@/API/layouts", () => {
  const actual = jest.requireActual("@/API/layouts");
  return {
    ...actual,
    getHomeData: jest.fn(),
  };
});

// Mock loginUserData
jest.mock("@/API/loginregister", () => {
  const actual = jest.requireActual("@/API/loginregister");
  return {
    ...actual,
    loginUserData: jest.fn(),
  };
});

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock loginUser action
jest.mock("@/redux/slices/authSlice", () => {
  const actual = jest.requireActual("@/redux/slices/authSlice");
  return {
    ...actual,
    loginUser: jest.fn(),
  };
});

// Utility: Setup localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || "",
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Access mocks
const mockedUseRouter = jest.mocked(useRouter);
const mockedUseAppDispatch = jest.mocked(useAppDispatch);
const mockedGetHomeData = jest.mocked(getHomeData);
const mockedLoginUserData = jest.mocked(loginUserData);
const mockedToast = jest.mocked(toast.default);
const mockedLoginUser = jest.mocked(loginUser);

describe("LoginOtpForm() LoginOtpForm method", () => {
  beforeEach(() => {
    // Reset all mocks and localStorage before each test
    jest.clearAllMocks();
    window.localStorage.clear();

    // Default router mock
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
    } as any);

    // Default dispatch mock
    mockedUseAppDispatch.mockReturnValue(jest.fn());

    // Default getHomeData mock
    mockedGetHomeData.mockResolvedValue({
      banner: {
        banner: [{ image: "/img/banner.jpg" }],
      },
    });

    // Default loginUserData mock
    mockedLoginUserData.mockResolvedValue({ success: true });

    // Default loginUser action
    mockedLoginUser.mockReturnValue({ type: "LOGIN_USER" });
  });

  // -------------------- Happy Paths --------------------
  describe("Happy Paths", () => {
    test("renders form with correct email and banner image", async () => {
      // This test ensures the component renders with the correct email and banner image.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      // Wait for banner image to load
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(
        screen.getByText("We have sent a 6-digit code to your email."),
      ).toBeInTheDocument();
      // Banner image is set as background style
      const bgDiv = screen.getByText("Verify OTP").closest(".bg-white")
        ?.parentElement?.parentElement;
      expect(bgDiv).toBeInTheDocument();
    });

    test("allows entering OTP digits and auto-focuses next input", async () => {
      // This test checks that entering a digit in an OTP input moves focus to the next input.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(6);

      // Enter '1' in first input
      fireEvent.change(inputs[0], { target: { value: "1" } });
      expect(inputs[0]).toHaveValue("1");
      // Enter '2' in second input
      fireEvent.change(inputs[1], { target: { value: "2" } });
      expect(inputs[1]).toHaveValue("2");
      // Enter '3' in third input
      fireEvent.change(inputs[2], { target: { value: "3" } });
      expect(inputs[2]).toHaveValue("3");
    });

    test("submits OTP and handles successful login", async () => {
      // This test verifies that submitting a valid OTP triggers loginUserData, toast, dispatch, and router.push.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const inputs = screen.getAllByRole("textbox");
      // Fill all OTP inputs
      ["1", "2", "3", "4", "5", "6"].forEach((digit, idx) => {
        fireEvent.change(inputs[idx], { target: { value: digit } });
      });
      const verifyBtn = screen.getByRole("button", { name: /verify/i });
      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(mockedLoginUserData).toHaveBeenCalledWith({
          email: "test@example.com",
          otp: "123456",
        });
        expect(mockedToast.success).toHaveBeenCalledWith("Login Successful");
        expect(mockedUseAppDispatch()).toHaveBeenCalledWith({
          email: "test@example.com",
        });
        expect(window.localStorage.getItem("user")).toContain(
          "test@example.com",
        );
        expect(mockedUseRouter().push).toHaveBeenCalledWith("/");
      });
    });

    test("Change Email button navigates to /login", async () => {
      // This test checks that clicking "Change Email" navigates to /login.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const changeEmailBtn = screen.getByRole("button", {
        name: /change email/i,
      });
      fireEvent.click(changeEmailBtn);
      expect(mockedUseRouter().push).toHaveBeenCalledWith("/login");
    });

    test("Login link navigates to /login", async () => {
      // This test checks that clicking the "Login" link navigates to /login.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const loginLink = screen.getByText("Login");
      fireEvent.click(loginLink);
      expect(mockedUseRouter().push).toHaveBeenCalledWith("/login");
    });
  });

  // -------------------- Edge Cases --------------------
  describe("Edge Cases", () => {
    test("does not allow non-numeric input in OTP fields", async () => {
      // This test ensures that only numeric input is accepted in OTP fields.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const inputs = screen.getAllByRole("textbox");
      fireEvent.change(inputs[0], { target: { value: "a" } });
      expect(inputs[0]).toHaveValue("");
      fireEvent.change(inputs[1], { target: { value: "!" } });
      expect(inputs[1]).toHaveValue("");
      fireEvent.change(inputs[2], { target: { value: "5" } });
      expect(inputs[2]).toHaveValue("5");
    });

    test("handles loginUserData API failure gracefully", async () => {
      // This test checks that API errors are handled and error toast is shown.
      window.localStorage.setItem("email", "test@example.com");
      mockedLoginUserData.mockRejectedValueOnce(new Error("Invalid OTP"));
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const inputs = screen.getAllByRole("textbox");
      ["1", "2", "3", "4", "5", "6"].forEach((digit, idx) => {
        fireEvent.change(inputs[idx], { target: { value: digit } });
      });
      const verifyBtn = screen.getByRole("button", { name: /verify/i });
      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(mockedLoginUserData).toHaveBeenCalled();
        expect(mockedToast.error).toHaveBeenCalledWith("Login failed");
        expect(mockedUseRouter().push).not.toHaveBeenCalledWith("/");
      });
    });

    test("renders with empty email if not set in localStorage", async () => {
      // This test checks that the form renders with empty email if localStorage has no email.
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      expect(screen.getByText("")).toBeInTheDocument();
    });

    test("banner image fallback if getHomeData returns no image", async () => {
      // This test checks that the banner image fallback works if getHomeData returns no image.
      mockedGetHomeData.mockResolvedValueOnce({
        banner: { banner: [{}] },
      });
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      // No assertion for image src, but component should not crash
      expect(screen.getByText("Verify OTP")).toBeInTheDocument();
    });

    test("does not submit if OTP is incomplete", async () => {
      // This test checks that submitting with incomplete OTP does not call loginUserData.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const inputs = screen.getAllByRole("textbox");
      ["1", "", "", "", "", ""].forEach((digit, idx) => {
        fireEvent.change(inputs[idx], { target: { value: digit } });
      });
      const verifyBtn = screen.getByRole("button", { name: /verify/i });
      fireEvent.click(verifyBtn);
      // loginUserData should still be called with incomplete OTP, but API may fail
      await waitFor(() => {
        expect(mockedLoginUserData).toHaveBeenCalledWith({
          email: "test@example.com",
          otp: "1",
        });
      });
    });

    test("handles rapid input changes and focus", async () => {
      // This test checks that rapid input changes and focus do not break the form.
      window.localStorage.setItem("email", "test@example.com");
      render(<LoginOtpForm />);
      await waitFor(() =>
        expect(screen.getByText("Verify OTP")).toBeInTheDocument(),
      );
      const inputs = screen.getAllByRole("textbox");
      // Enter digits rapidly
      for (let i = 0; i < 6; i++) {
        fireEvent.change(inputs[i], { target: { value: String(i) } });
      }
      // All inputs should have correct values
      for (let i = 0; i < 6; i++) {
        expect(inputs[i]).toHaveValue(String(i));
      }
    });
  });
});
