import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCommunities } from "../api/api";
import backgroundImage from "../assets/register-bg.jpg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    communityName: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoadingCommunities(true);
        const { data } = await getCommunities();
        setCommunities(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, communityName: data[0].name }));
        }
      } catch (err) {
        console.error(
          "Failed to fetch communities. Is the backend server running?",
          err
        );
        setError("Could not load communities. Please try again later.");
      } finally {
        setLoadingCommunities(false);
      }
    };
    fetchCommunities();
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers,
      errors: {
        length: password.length < minLength,
        uppercase: !hasUpperCase,
        lowercase: !hasLowerCase,
        number: !hasNumbers,
        special: !hasSpecialChar,
      },
    };
  };

  const validateFullName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "communityName":
        if (!value.trim()) {
          errors.communityName = "Please select a community";
        }
        break;
      case "fullName":
        if (!value.trim()) {
          errors.fullName = "Full name is required";
        } else if (value.trim().length < 2) {
          errors.fullName = "Full name must be at least 2 characters long";
        } else if (!validateFullName(value)) {
          errors.fullName = "Full name can only contain letters and spaces";
        }
        break;
      case "email":
        if (!value.trim()) {
          errors.email = "Email address is required";
        } else if (!validateEmail(value)) {
          errors.email = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else {
          const passwordValidation = validatePassword(value);
          if (!passwordValidation.isValid) {
            const errorMessages = [];
            if (passwordValidation.errors.length)
              errorMessages.push("at least 8 characters");
            if (passwordValidation.errors.uppercase)
              errorMessages.push("one uppercase letter");
            if (passwordValidation.errors.lowercase)
              errorMessages.push("one lowercase letter");
            if (passwordValidation.errors.number)
              errorMessages.push("one number");

            errors.password = `Password must contain ${errorMessages.join(
              ", "
            )}`;
          }
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};

    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear general error
    if (error) {
      setError("");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, ...errors }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate all fields
    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      setError("Please fix the errors below before submitting");
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          if (result.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "shadow appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 bg-transparent";
    if (fieldErrors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-blue-500`;
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="p-8 bg-white/10 rounded-lg shadow-xl w-full max-w-lg backdrop-blur-[2px] border border-white/10">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleRegister} noValidate>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {success}
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="communityName"
            >
              Select Your Community *
            </label>
            <select
              id="communityName"
              name="communityName"
              value={formData.communityName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loadingCommunities || communities.length === 0}
              className={`appearance-none border rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 bg-transparent disabled:bg-slate-100 disabled:cursor-not-allowed ${
                fieldErrors.communityName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="">Select a community</option>
              {loadingCommunities ? (
                <option disabled>Loading communities...</option>
              ) : communities.length > 0 ? (
                communities.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option disabled>No communities found</option>
              )}
            </select>
            {fieldErrors.communityName && (
              <p className="text-red-400 text-xs mt-1">
                {fieldErrors.communityName}
              </p>
            )}
            <p className="text-xs text-white/80 mt-1">
              Is your community not listed? Contact your administrator.
            </p>
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name *
            </label>
            <input
              className={getInputClassName("fullName")}
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={50}
            />
            {fieldErrors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address *
            </label>
            <input
              className={getInputClassName("email")}
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password *
            </label>
            <input
              className={getInputClassName("password")}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
            <div className="text-xs text-white/80 mt-1">
              Password must contain at least 8 characters, including uppercase,
              lowercase, and numbers
            </div>
          </div>

          <button
            className={`font-bold py-3 px-4 rounded-lg w-full transition-colors ${
              isSubmitting ||
              Object.keys(fieldErrors).some((key) => fieldErrors[key])
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            type="submit"
            disabled={
              isSubmitting ||
              Object.keys(fieldErrors).some((key) => fieldErrors[key])
            }
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>

          <p className="text-center text-white text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-100 hover:text-blue-300"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
