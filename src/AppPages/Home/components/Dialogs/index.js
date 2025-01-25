import React from 'react';
import ViewResponseDialog from '../../../ReusableComponents/ViewResponseDialog';
import WebllinkDialog from '../../../ReusableComponents/Weblinkdialog';
import AttestDialog from '../../../ReusableComponents/AttestDialog';
import CancelDialog from '../../../ReusableComponents/CancelDialog';
import CompleteDialog from '../../../ReusableComponents/CompleteDialog';
import ChatDialog from '../../../ReusableComponents/ChatDialog';

const Dialogs = ({
  state,
  handleDialogClose,
  handleAttestation,
  handleCancel,
  handleComplete,
  startConversation,
  SendWebLink,
  Transition
}) => {
  return (
    <>
      <ViewResponseDialog
        open={state.showResponsesDialog}
        Transition={Transition}
        handleDialogClose={handleDialogClose}
        row={state.viewresponserow}
      />

      <WebllinkDialog
        open={state.showSendWebLinkDialog}
        Transition={Transition}
        handleClose={handleDialogClose}
        emailAddress={state.emailAddress}
        SendWebLink={SendWebLink}
        emailSent={state.emailSent}
      />

      <AttestDialog
        open={state.showAttestDialog}
        handleClose={handleDialogClose}
        handleAttestation={handleAttestation}
      />

      <CancelDialog
        open={state.showCancelDialog}
        cancelConfirmation={state.cancelConfirmation}
        handleClose={handleDialogClose}
        handleCancel={handleCancel}
      />

      <CompleteDialog
        open={state.showCompleteDialog}
        completeConfirmation={state.completeConfirmation}
        handleClose={handleDialogClose}
        handleComplete={handleComplete}
      />

      <ChatDialog
        open={state.showChatDiaolog}
        chatInitiatedForCase={state.chatInitiatedForCase}
        startConversation={startConversation}
        handleClose={handleDialogClose}
        phoneNumber={state.phoneNumber}
      />
    </>
  );
};

export default Dialogs; 