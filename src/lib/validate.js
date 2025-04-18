const validateSignUpForm = (
  { firstName, lastName, email, password, cpass, phoneNumber, cnic },
  driver
) => {
  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/;
  const phoneRegex = /^03\d{2}-\d{7}$/;
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

  if (!nameRegex.test(firstName))
    return "Invalid first name. Only letters allowed.";
  if (!nameRegex.test(lastName))
    return "Invalid last name. Only letters allowed.";
  if (!emailRegex.test(email)) return "Invalid email format.";
  if (!passwordRegex.test(password))
    return "Password must be at least 8 characters.";
  if (password !== cpass) return "Passwords do not match!";
  if (!phoneRegex.test(phoneNumber))
    return "Invalid phone number format. Use 03XX-XXXXXXX";

  if (!cnicRegex.test(cnic) && driver)
    return "Invalid CNIC format. Use 12345-1234567-1";

  return null;
};

export { validateSignUpForm };
