import classes from './ListNavigation.module.css';
const ListNavifation = (props) => {
  let dataList = props.userList;

  const disabledPrev = props.pageNum === 1;
  const disabledNext = props.pageNum === Math.ceil(dataList.length / 50) ;

  return (
    <>
    <p>Number of page {props.pageNum} from {Math.ceil(dataList.length / 50) || 1}</p>
    <div className={`${classes['table-navigation']} d-flex justify-content-between mt-2`}>
      <button onClick={props.prevPage} disabled={disabledPrev ? true : ''}>Prev</button>
      <button onClick={props.nextPage} disabled={disabledNext || dataList.length === 0 ? true : ''}>Next</button>
    </div>
    </>
  )

};

export default ListNavifation;

