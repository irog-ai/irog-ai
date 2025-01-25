import { useState } from 'react';

const initialState = {
    question: "",
    phoneNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    LawyerId: "",
    LawyersList: [],
    inpFile: "",
    serviceFile: "",
    serviceFileName: "",
    s3BucketServiceFileName: "",
    inpFileName: "",
    questions: [],
    isLoading: false,
    serviceFileData: {
      courtName: "",
      caseNumber: "",
      propundingPartyRole: "",
      propundingPartyNames: [],
      respondingPartyRole: "",
      respondingPartyNames: [],
      division: "",
      noticeHeading: "",
      noticeMatter: "",
      lawyersJson: {},
      certificateText: "",
      interrogatoryFileTitle: "",
    },
    cancelQueue: "",
    emailSent: false,
    insertedQuestions: [],
    showTable: false,
    insertedId: 0,
    createCasePage: true,
    openViewQuestions: false,
    questionTable: [],
    chatInitiatedForCase: false,
    caseId: "",
    caseNumber: "",
    status: "",
    showResponsesDialog: false,
    showSendWebLinkDialog: false,
    standardAnswer: "",
    viewresponserow: {},
    originalAnswer: "",
    s3bucketfileName: "",
    isNewLoading: false,
    value: 0,
    loadingtext: "",
    showAttestDialog: false,
    emailChannelInitiated: false,
    showCancelDialog: false,
    cancelConfirmation: false,
    showCompleteDialog: false,
    completeConfirmation: false,
    showChatDiaolog: false,
    responseFileName: "",
    responseAttorneyFileName: "",
    serviceDialogOpen: false,
    showExceptionDialog: false,
  };

export const useHomeState = () => {
  const [state, setState] = useState(initialState);

  const updateState = (newState) => {
    setState(prev => ({
      ...prev,
      ...newState
    }));
  };

  return [state, updateState];
}; 