import { useEffect } from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {
  
  useEffect(() => {
    let showModalAfterTimeout;
    if (!props.modalShow.opened && !sessionStorage.getItem("modalShown")) {
      showModalAfterTimeout = setTimeout(() => {
        props.toggleModal();
        sessionStorage.setItem("modalShown", true);
      }, 5000);
    }

    return () => {
      clearTimeout(showModalAfterTimeout);
    };
  }, [props.modalShow.opened, props]);

  let modalContent = (
    <>
      <div className={classes.backdrop} onClick={props.onClose} />
      <div className={classes.modal}>
        <div className={classes.content}>
          <h2 className="text-center">List of functionalities</h2>
          <ol>
            <li>By clicking the column name, list is sorted by ascending order. Second click - descending</li>
            <li>List is divided by 50 fields per page. You can easily navigate it by using Next and Prev buttons under the table</li>
            <li>On the top of the page is a search form to filter the list according to input data(name/email/phone)</li>
            <li>By clicking on any field inside the table, it displays all information about chosen user right underneath the table</li>
            <li>"Add new user" button calls form, that takes new user`s info, validates every field by its type and sends new data to FireBase database.</li>
            <li>
              User list is downloaded from two sources:
              <ul>
                <li>filltext.com - JSON generating service</li>
                <li>Firebase DB (fetches users which were submitted using "Add new user" form.)</li>
              </ul>
            </li>
            
          </ol>
        </div>
      </div>
    </>
  );

  return <>{props.modalShow.show && modalContent}</>;
};

export default Modal;
