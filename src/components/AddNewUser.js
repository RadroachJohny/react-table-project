import { useState, useEffect } from "react";
import useInput from "../hooks/use-input";

import classes from "./AddNewUser.module.css";

const AddNewUser = (props) => {
  const [userAddedMessage, setUserAddedMessage] = useState(false);
  const [postingError, setPostingError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUserAddedMessage(false);
    }, 3000);
  }, [userAddedMessage]);

  const { value: enteredId, isValid: enteredIdIsValid, hasError: idInputHasError, valueChangeHandler: idChangedHandler, inputBlurHandler: idBlurHandler, reset: resetIdInput } = useInput((value) => value.trim() !== "" && /^\d+$/m.test(value));

  const { value: enteredName, isValid: enteredNameIsValid, hasError: nameInputHasError, valueChangeHandler: nameChangedHandler, inputBlurHandler: nameBlurHandler, reset: resetNameInput } = useInput((value) => value.trim() !== "" && /^\D+$/m.test(value));

  const { value: enteredLastName, isValid: enteredLastNameIsValid, hasError: lastNameInputHasError, valueChangeHandler: lastNameChangedHandler, inputBlurHandler: lastNameBlurHandler, reset: resetLastNameInput } = useInput((value) => value.trim() !== "" && /^\D+$/m.test(value));

  const { value: enteredEmail, isValid: enteredEmailIsValid, hasError: emailInputHasError, valueChangeHandler: emailChangedHandler, inputBlurHandler: emailBlurHandler, reset: resetEmailInput } = useInput((value) => value.trim() !== "" && /^.+@.+\.\D{2,}$/.test(value));

  const { value: enteredPhone, isValid: enteredPhoneIsValid, hasError: phoneInputHasError, valueChangeHandler: phoneChangedHandler, inputBlurHandler: phoneBlurHandler, reset: resetPhoneInput } = useInput((value) => value.trim() !== "" && /^\(\d{3}\)\d{3}-\d{4}$/.test(value));

  let formIsValid = false;

  if (enteredIdIsValid && enteredNameIsValid && enteredLastNameIsValid && enteredEmailIsValid && enteredPhoneIsValid) {
    formIsValid = true;
  }

  const addNewUser = async(userField) => {
    setPostingError(false);
    try {
      const response = await fetch("https://react-post-request-ad5a1-default-rtdb.firebaseio.com/users.json", {
        method: "POST",
        body: JSON.stringify(userField),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("The problem has occured while sending, please try again later");
      }
      // const data = await response.json();
    } catch (error) {
      setPostingError(true);
    }
    setUserAddedMessage(true);
  };

  const formSubmissionHandler = (e) => {
    e.preventDefault();

    if (!enteredIdIsValid && !enteredNameIsValid) {
      return;
    }

    const newUserObj = {
      id: enteredId,
      firstName: enteredName,
      lastName: enteredLastName,
      email: enteredEmail,
      phone: enteredPhone,
    };

    props.onSubmit(newUserObj);

    resetIdInput();
    resetNameInput();
    resetLastNameInput();
    resetEmailInput();
    resetPhoneInput();

    addNewUser(newUserObj);
    
  };

  let userAddedText = (
    <div className={`${"bg-success rounded text-center"} ${classes["user-added"]}`}>New user has been added to the list</div>
  )

  if (postingError) {
    userAddedText = (
      <div className={`${"bg-danger rounded text-center"} ${classes["user-added"]}`}>An error has occured while posting. Please try again later.</div>
    )
  }

  return (
    <>
      <form className={`${classes["new-user-form"]} ${classes["adduser-form"]} ${"mb-3"}`} onSubmit={formSubmissionHandler}>
        {userAddedMessage && userAddedText}

        <table className="table table-addUser">
          <thead>
            <tr>
              <td id="id">
                <label htmlFor="input-id">id</label>
              </td>
              <td>
                <label htmlFor="input-name">firstName</label>
              </td>
              <td>
                <label htmlFor="input-lastName">lastName</label>
              </td>
              <td>
                <label htmlFor="input-email">email</label>
              </td>
              <td>
                <label htmlFor="input-phone">phone</label>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input className={idInputHasError ? "alert-danger" : ""} id="input-id" onChange={idChangedHandler} maxLength="7" onBlur={idBlurHandler} type="text" value={enteredId} placeholder="id" />
                {idInputHasError && <p className="text-danger mb-0">Numerals only</p>}
              </td>
              <td>
                <input className={nameInputHasError ? "alert-danger" : ""} onChange={nameChangedHandler} maxLength="20" onBlur={nameBlurHandler} id="input-name" type="text" value={enteredName} placeholder="Name" />
                {nameInputHasError && <p className="text-danger mb-0">Only letters</p>}
              </td>
              <td>
                <input className={lastNameInputHasError ? "alert-danger" : ""} onChange={lastNameChangedHandler} maxLength="20" onBlur={lastNameBlurHandler} id="input-lastName" type="text" value={enteredLastName} placeholder="Last name" />
                {lastNameInputHasError && <p className="text-danger mb-0">Only letters</p>}
              </td>
              <td>
                <input className={emailInputHasError ? "alert-danger" : ""} onChange={emailChangedHandler} maxLength="30" onBlur={emailBlurHandler} id="input-email" type="text" value={enteredEmail} placeholder="your@email.com" />
                {emailInputHasError && <p className="text-danger mb-0">Input correct email</p>}
              </td>
              <td>
                <input className={phoneInputHasError ? "alert-danger" : ""} onChange={phoneChangedHandler} maxLength="13" onBlur={phoneBlurHandler} id="input-phone" type="text" value={enteredPhone} placeholder="(xxx)xxx-xxxx" />
                {phoneInputHasError && <p className="text-danger mb-0">Input correct phone </p>}
              </td>
            </tr>
          </tbody>
        </table>
        <button disabled={!formIsValid} className={`${classes["adduser-btn"]} ${"btn btn-success"}`}>
          Add field
        </button>
      </form>
    </>
  );
};

export default AddNewUser;
