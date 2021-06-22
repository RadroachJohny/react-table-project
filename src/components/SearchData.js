import { useState, useEffect } from "react";
import classes from "./SearchData.module.css";

// const initialImputState = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   phone: "",
//   disabled: true,
// };

const initialImputState = {
  firstName: {
    value: '',
    disabled: true,
  },
  lastName: {
    value: '',
    disabled: true,
  },
  email: {
    value: '',
    disabled: true,
  },
  phone: {
    value: '',
    disabled: true,
  },
  
};

const SearchData = (props) => {
  const [inputData, setInputData] = useState(initialImputState);

  const {firstName, lastName, email, phone} = inputData;

  const submitHandler = (e) => {
    e.preventDefault();

    // set inputs to default(empty) values 
    setInputData(initialImputState);
    // invokes search
    props.searchField({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
    });
  };

  const inputDataHandler = (fieldName) => (e) => {
    const message = e.target.value;

    // disable search button conditionally
    if (message.trim() === "") {
      setInputData((prev) => {
        return { ...prev, [fieldName]: {value: '', disabled: true}};
      });
      return;
    }

    
    setInputData((prev) => {
      return { ...prev, [fieldName]: {value: message.trim(), disabled: false} };
    });
  };

  

  let searchBtnDisabled = true;
  if (!firstName.disabled || !lastName.disabled || !email.disabled || !phone.disabled) {
    searchBtnDisabled = false;
  }


  return (
    <form className="col-md-4 mb-3" onSubmit={submitHandler}>
      <h3 className="m-auto pb-3 text-success">Find User</h3>
      <div className={`${classes["form-control"]} ${classes.name}`}>
        <div className={classes["form-control"]}>
          <label htmlFor="firstName">First Name</label>
          <input className={classes["search-input"]} type="text" id="firstName" value={firstName.value} onChange={inputDataHandler("firstName")} />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" value={lastName.value} onChange={inputDataHandler("lastName")} />
        </div>
      </div>
      <div className={classes["form-control"]}>
        <label htmlFor="email">E-Mail Address</label>
        <input type="text" id="email" value={email.value} onChange={inputDataHandler("email")} />
      </div>
      <div className={classes["form-control"]}>
        <label htmlFor="phone">Phone number</label>
        <input type="text" id="phone" value={phone.value} onChange={inputDataHandler("phone")} />
      </div>
      <div className={classes.formActions}>
        <button type="submit" disabled={searchBtnDisabled || props.dataIsFetching}>Search</button>
      </div>
    </form>
  );
};

export default SearchData;
