import { useState } from "react";

const useAlerthook = () => {
  return {
    isOpen,
    isConfirm,
    openDialog,
    closeDialog,
    confirmDialog,
    cancelDialog,
  };
};

export default useAlerthook;
