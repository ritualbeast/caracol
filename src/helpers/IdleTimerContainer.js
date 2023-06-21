/* eslint-disable eol-last */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable quotes */
import React, { useRef, useState } from "react";

// import { IdleTimerComponent } from 'react-idle-timer';
import IdleTimer from 'react-idle-timer';


const IdleTimerContainer = (props) => {
  const idleTimerRef = useRef(null);
  const [timeoutDuration, setTimeoutDuration] = useState(1000 * 60 * 30); // 15mins

  const onIdleHandler = () => {
    if (props.timeout) {
      props.handleLogout();
    } else {
      props.timeoutModal(); // opens the modal
      idleTimerRef.current.reset();
      props.timedoutHandler(true); // after the modal, if they are not responding then
    }
    // props.timeoutModal(); // opens the modal
  };

  const onActiveHandler = () => {
    props.timedoutHandler(false);
  };
  return (
    <IdleTimer
      ref={idleTimerRef}
      timeout={timeoutDuration} // {1000 * 60 * 15}, {1000 * 5 * 1}
      onIdle={onIdleHandler}
      onActive={onActiveHandler}
      // onAction={onActionHandler}
    /> 
    // <button />
  );
};

export default IdleTimerContainer;