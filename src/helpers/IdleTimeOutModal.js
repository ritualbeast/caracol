
/* eslint-disable eol-last */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable quotes */
import React from "react";
// import { propTypes } from "react-bootstrap/esm/Image";
// import { Modal, Button } from "react-bootstrap";
import Button from 'react-bootstrap/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import '../styles/modal-confirmacion.css'

const IdleTimeOutModal = (props) => {
  return (
    <Dialog open={props.showModal} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" className='informacion'>
            Inactividad
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description-conf">
                Se ha detectado que sobrepasó el tiempo máximo de inactividad.<br /> Si desea mantenerse conectado hacer clic en aceptar
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button id="btn-close" onClick={props.handleClose} autoFocus>
                Aceptar
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default IdleTimeOutModal;