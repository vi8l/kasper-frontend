import { Button, Modal } from "antd";
import React, { useState } from "react";

const AddModalComponent = ({
  showModal,
  toggleAddModal,
}: {
  [key: string]: any;
}) => {
  return (
    <>
      <Modal
        title="Vertically centered modal dialog"
        centered
        visible={showModal}
        onOk={() => toggleAddModal(false)}
        onCancel={() => toggleAddModal(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  );
};

export default AddModalComponent;
