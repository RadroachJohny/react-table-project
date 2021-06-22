import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import ListNavigation from "./ListNavigation";
import DataList from "./DataList";
import ChosenField from "./ChosenField";
import SearchData from "./SearchData";
import Modal from "./Modal.js";
import AddNewUser from "./AddNewUser";

import "./ProjectInfo.css";

const Table = () => {
  // modal containing project information
  const [modalShow, setModalShow] = useState({ show: false, opened: false });
  // show/hide new user form display
  const [addNewUser, setAddNewUser] = useState(false);
  // show text if fetching user list failed
  const [fetchingError, setFetchingError] = useState(false);
  // complete list of users fetched from both sources
  const [fetchedUserlist, setFetchedUserlist] = useState([]);
  // show/hide spinner while fetching data
  const [fetching, setFetching] = useState(true);
  // change direction of sorting users list
  const [sortDirection, setSortDirection] = useState(true);
  // sets currently chossen filter for visual indication (rotates ::after triangle in css)
  const [chosenFilter, setChosenFilter] = useState({});
  // current page number in main user list
  const [pageNumAll, setpageNumAll] = useState(1);
  // current page number in found user list
  const [pageNumFound, setpageNumFound] = useState(1);
  // sorted initial user list, sliced by pages
  const [sortedAllList, setSortedAllList] = useState([]);
  // object, containing array with all found instances during search
  const [searchRes, setSearchRes] = useState({
    found: [],
    // used to choose between whole users list and list with found users to render
    searchIsActive: false,
  });

  const [selectedFieldId, setSelectedFieldId] = useState();

  let foundUsersListToRender = searchRes.found.slice(0 + 50 * (pageNumFound - 1), 50 * pageNumFound);

  let userList;
  let setUserList;
  let pageNum;

  // assign variables depending on whether it is whole user list or found instances
  if (searchRes.searchIsActive) {
    userList = searchRes.found;
    setUserList = setSearchRes;
    pageNum = setpageNumFound;
  } else {
    userList = sortedAllList;
    setUserList = setSortedAllList;
    pageNum = setpageNumAll;
  }

  // reset current page number in found list after new search
  useEffect(() => {
    setpageNumFound(1);
  }, [searchRes]);

  // slices currently displaying array depending on the page number
  // resets sorting direction to ascending
  // set sorting to id on every new page
  useEffect(() => {
    setSortedAllList(() => {
      return fetchedUserlist.slice(0 + 50 * (pageNumAll - 1), 50 * pageNumAll);
    });

    setSortDirection("up");
    setChosenFilter({
      filterName: "id",
      active: true,
    });
  }, [fetchedUserlist, pageNumAll]);

  // initial user list fetching from two different sources
  useEffect(() => {
    // enabling spinner
    setFetching(true);
    try {
      const getData = async () => {
        const urls = ["https://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}", "https://react-post-request-ad5a1-default-rtdb.firebaseio.com/users.json"];

        const promises = urls.map((url) => fetch(url).then((resp) => resp.json()));

        const users = await Promise.all(promises).catch(() => {
          setFetchingError(true);
          setFetching(false);
        });

        // checking if all requests returned data and filtering the ones with errors
        const fixedUsers = users.filter((user) => user !== undefined);

        let newData;
        if (fixedUsers.length === 1) {
          newData = [...obJectToArrayUsers(fixedUsers[0])];
        } else {
          newData = [...fixedUsers[0], ...obJectToArrayUsers(fixedUsers[1])];
        }

        // return sorted array
        const sortedData = newData.sort((a, b) => {
          return a.id - b.id;
        });

        // main user list
        setFetchedUserlist(sortedData);
        // disabling spinner
        setFetching(false);
      };
      getData();
    } catch (error) {
      setFetching(false);
      // handling error during failed fetching
      setFetchingError(true);
    }
  }, []);

  // Firebase DB returns object.
  // convert to array
  const obJectToArrayUsers = (object) => {
    const usersArr = [];
    for (let key in object) {
      usersArr.push(object[key]);
    }
    return usersArr;
  };

  const sortDataById = () => {
    let sortedArr;
    if (sortDirection === "up") {
      sortedArr = [...userList].sort((a, b) => {
        return b.id - a.id;
      });
      setChosenFilter({
        filterName: "id",
        active: false,
      });
      setSortDirection("down");
    } else {
      sortedArr = [...userList].sort((a, b) => {
        return a.id - b.id;
      });
      setChosenFilter({
        filterName: "id",
        active: true,
      });
      setSortDirection("up");
    }

    if (setUserList === setSearchRes) {
      setUserList((prev) => {
        return { ...prev, found: sortedArr };
      });
    } else {
      setUserList(sortedArr);
    }
  };

  function compareName(a, b, cellName) {
    if (a[cellName] < b[cellName]) {
      // console.log(1);
      if (sortDirection === "up") {
        return -1;
      } else {
        return 1;
      }
    }
    if (a[cellName] > b[cellName]) {
      // console.log(2);
      if (sortDirection === "up") {
        return 1;
      } else {
        return -1;
      }
    }
    return 0;
  }

  const sortDataByName = (cellName) => {
    let sortedArr;
    if (sortDirection === "up") {
      sortedArr = [...userList].sort((a, b) => {
        return compareName(a, b, cellName);
      });
      setSortDirection("down");
      setChosenFilter({
        filterName: cellName,
        active: true,
      });
    } else {
      sortedArr = [...userList].sort((a, b) => {
        return compareName(a, b, cellName);
      });
      setChosenFilter({
        filterName: cellName,
        active: false,
      });
      setSortDirection("up");
    }

    if (setUserList === setSearchRes) {
      setUserList((prev) => {
        return { ...prev, found: sortedArr };
      });
    } else {
      setUserList(sortedArr);
    }
  };

  const sortDataByPhone = () => {
    let sortedArr;
    if (sortDirection === "up") {
      sortedArr = [...userList].sort((a, b) => {
        let numA = Number(a.phone.replaceAll(/[\D\s]*/gi, ""));
        let numB = Number(b.phone.replaceAll(/[\D\s]*/gi, ""));

        return numB - numA;
      });
      setChosenFilter({
        filterName: "phone",
        active: false,
      });
      setSortDirection("down");
    } else {
      sortedArr = [...userList].sort((a, b) => {
        let numA = Number(a.phone.replaceAll(/[\D\s]*/gi, ""));
        let numB = Number(b.phone.replaceAll(/[\D\s]*/gi, ""));
        return numA - numB;
      });
      setChosenFilter({
        filterName: "phone",
        active: true,
      });
      setSortDirection("up");
    }

    // adding sorted data to current list (whole list or search results)
    if (setUserList === setSearchRes) {
      setUserList((prev) => {
        return { ...prev, found: sortedArr };
      });
    } else {
      setUserList(sortedArr);
    }
  };

  const arrowDirectionClass = (selector) => {
    return ` ${chosenFilter.filterName === selector && !chosenFilter.active ? "down" : ""}`;
  };

  const nextPage = () => {
    pageNum((prev) => {
      return (prev += 1);
    });
  };

  const prevPage = () => {
    pageNum((prev) => {
      return (prev -= 1);
    });
  };

  // filters user list according to search requests
  const searchField = (fieldData) => {
    const searchArray = fetchedUserlist
      .filter((elem) => elem.firstName.includes(fieldData.firstName))
      .filter((elem) => elem.lastName.includes(fieldData.lastName))
      .filter((elem) => elem.email.includes(fieldData.email))
      .filter((elem) => elem.phone.includes(fieldData.phone));

    // adds found fields to new search results array, toggles display of user list
    // to show whole list or found results
    setSearchRes(() => {
      return { found: searchArray, searchIsActive: true };
    });
  };

  // project information modal
  const toggleModal = (modalArg) => {
    if (modalArg === setModalShow) {
      modalArg((prev) => {
        return { show: !prev.show, opened: true };
      });
    } else {
      modalArg((prev) => {
        return !prev;
      });
    }
  };

  // adds new user LOCALLY (posting in AddNewUser.js)
  const addNewUserHandler = async (userField) => {
    setFetchedUserlist((prev) => {
      return [userField, ...prev];
    });
  };

  // adds white bg to the clicked field
  // after timeout removes bg and adds chosen field to display state
  const clickedField = (e, dataItem) => {
    const target = e.currentTarget;
    target.style.backgroundColor = "white";

    setTimeout(() => {
      target.style.backgroundColor = "";
      setSelectedFieldId(dataItem);
    }, 50);
  };

  // contains user list depending on the search status(whole list or found results)
  let content;
  if (searchRes.searchIsActive) {
    content = foundUsersListToRender.map((dataItem) => (
      <DataList
        onClick={(e) => {
          clickedField(e, dataItem);
        }}
        key={Math.random()}
        dataItem={dataItem}
      />
    ));
  } else {
    content =
      !fetching &&
      sortedAllList.map((dataItem) => (
        <DataList
          onClick={(e) => {
            clickedField(e, dataItem);
          }}
          key={Math.random()}
          dataItem={dataItem}
        />
      ));
  }

  const portalElement = document.getElementById("overlays");
  const foundListEmpty = searchRes.found.length === 0 && searchRes.searchIsActive ? true : false;

  const spinner = (
    <div className="spinner-border m-5" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );

  return (
    <>
      {/* calls modal containing info regarding project */}
      <button onClick={toggleModal.bind(null, setModalShow)} className="project-info">
        Read project Info
      </button>
      {/* search form */}
      <SearchData searchField={searchField} dataIsFetching={fetching} />

      {/* add new user form */}
      {addNewUser && <AddNewUser onSubmit={addNewUserHandler} />}
      {/* call new user form */}
      <button onClick={() => toggleModal(setAddNewUser)} className="mb-1">
        {addNewUser ? "Hide" : "Add"} new user
      </button>

      <div className="mt-3 table-container">
        {/* removes found users list and returns to all users */}
        {searchRes.searchIsActive && (
          <button className="mb-2 btn btn-success" onClick={() => setSearchRes({ found: [], searchIsActive: false })}>
            Return to all users
          </button>
        )}

        <table className="table table-dark">
          <thead className="thead-dark">
            <tr>
              <td id="id" onClick={sortDataById} className={arrowDirectionClass("id")}>
                id
              </td>
              <td id="firstName" onClick={() => sortDataByName("firstName")} className={arrowDirectionClass("firstName")}>
                firstName
              </td>
              <td id="lastName" onClick={() => sortDataByName("lastName")} className={arrowDirectionClass("lastName")}>
                lastName
              </td>
              <td id="email" onClick={() => sortDataByName("email")} className={arrowDirectionClass("email")}>
                email
              </td>
              <td id="phone" onClick={sortDataByPhone} className={arrowDirectionClass("phone")}>
                phone
              </td>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
        <p className="text-secondary">* click on the interested field to see full info below</p>
        {foundListEmpty && <h4 className="text-danger text-center">No matches</h4>}
      </div>
      {fetchingError && <h4 className="text-danger">An error has occured while fetching data. Please try again later.</h4>}
      {fetching && spinner}
      {/* Prev Next btns and pages */}
      <ListNavigation nextPage={nextPage} prevPage={prevPage} userList={searchRes.searchIsActive ? searchRes.found : fetchedUserlist} pageNum={searchRes.searchIsActive ? pageNumFound : pageNumAll} />
      {/* Displays info of user after clicking on certain field */}
      {selectedFieldId && <ChosenField value={selectedFieldId} />}

      {/* Project info modal */}
      {ReactDOM.createPortal(<Modal toggleModal={() => toggleModal(setModalShow)} modalShow={modalShow} onClose={() => toggleModal(setModalShow)} />, portalElement)}
    </>
  );
};

export default Table;
