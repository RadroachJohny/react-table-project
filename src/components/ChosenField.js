import "./ChosenField.css";

const ChosenField = (props) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    description = 'NA',
    address: { streetAddress, city, state, zip } = {},
  } = props.value;
  return (
    <div className="col-md-9 col-xl-6 px-2">
      <div>
        Selected user: <b>{`${firstName} ${lastName}`}</b>
      </div>
      <div>
        <span>Description:</span>
        <p className="chosen-user__description" style={{ marginBottom: "0" }}>
          { description}
        </p>
      </div>
      <div>
        Email: <b>{email || 'NA'}</b>
      </div>
      <div>
        Phone: <b>{phone || 'NA'}</b>
      </div>
      <div>
        Address: <b>{streetAddress || 'NA'}</b>
      </div>
      <div>
        City: <b>{city || 'NA'}</b>
      </div>
      <div>
        Province/state: <b>{state || 'NA'}</b>
      </div>
      <div>
        Zip: <b>{zip || 'NA'}</b>
      </div>
    </div>
  );
};

export default ChosenField;
