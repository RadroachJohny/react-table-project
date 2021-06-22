const DataList = (props) => {
  const {id, firstName, lastName, email, phone} = props.dataItem;
  return (
    <tr onClick={props.onClick}>      
      <td>{id}</td>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
      <td>{phone}</td>
    </tr>
  )
};

export default DataList;