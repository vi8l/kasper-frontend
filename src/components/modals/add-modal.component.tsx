import { Modal, Button, Form, Input } from "antd";

const AddModalComponent = ({
  showModal,
  handleHideModal,
  handleSave,
  updateRecord,
}: {
  [key: string]: any;
}) => {
  const [form] = Form.useForm();
  console.log("updateRecord>>>", updateRecord)
  
  if(Object.keys(updateRecord).length) {
    form.setFieldsValue(updateRecord)
  }
  const onFinish = async (values: any) => {
    form.validateFields();
    console.log("Success:", await form.validateFields());
    console.log("updateRecord>>>", updateRecord)
    await handleSave(values.name, updateRecord?.id)
    form.resetFields();
    // handleHideModal();
  };
  const onFinishFailed = (errorInfo: any) => {
    // form.resetFields();
    console.log("Failed:", errorInfo);
    // handleHideModal();
  };

  const onCancel = () => {
    form.resetFields();
    handleHideModal();
  };
  return (
    <Modal
      title={Object.keys(updateRecord).length ? `Update Person` : `Add Person`}
      centered
      visible={showModal}
      onCancel={() => onCancel()}
      footer={[]}
    >
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter person's name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            key="back"
            htmlType="button"
            onClick={onCancel}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModalComponent;
