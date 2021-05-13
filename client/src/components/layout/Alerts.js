import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

const Alerts = () => {
  const alertContext = useContext(AlertContext);
  const { alerts } = alertContext;

  return (

      <div className={`alert alert-${alerts.type}`}>
        <i className='fas fa-info-circle'></i>  {alerts.msg}
      </div>
    )
};

export default Alerts;
