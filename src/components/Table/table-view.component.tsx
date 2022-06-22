import { DeleteOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, message, Space, Table, Popconfirm } from "antd";
import { arrayMoveImmutable } from "array-move";
import { useState, useEffect } from "react";
import "./style.css";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import AddModalComponent from "../modals/add-modal.component";
import PeopleDataService from "../../services/people.service";
import IPersonData from "../../types/person.type";

const successMessage = (messageText: string) => {
  message.destroy();
  message.success(messageText, 5);
};

const loader = (loaderText: string) => {
  message.loading(loaderText);
}

const errorMessage = (messageText: string) => {
  message.destroy();
  message.error(messageText, 5);
};

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: "grab",
      color: "#999",
    }}
  />
));

const SortableItem = SortableElement((props: { [key: string]: any }) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: { [key: string]: any }) => (
  <tbody {...props} />
));

const TableViewComponent = () => {
  const [dataSource, setDataSource] = useState<IPersonData[]>([]);
  const [updateRecord, setUpdateRecord] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forceReload, setForceReload] = useState(false);

  const retriveData = async () => {
    try {
      const peoplesData = await PeopleDataService.getAll();
      setDataSource(peoplesData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retriveData();
  }, []);

  if (forceReload) {
    setForceReload(false);
    retriveData();
  }

  const columns = [
    {
      title: "Sort",
      dataIndex: "sort",
      width: 30,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: "Name",
      dataIndex: "name",
      className: "drag-visible",
    },
    {
      title: "Rank",
      dataIndex: "sequence",
      className: "drag-visible",
    },
    {
      render: (_: any, record: IPersonData) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleShowModel(record)} />
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => handleDelete(record)}
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }: { [key: string]: any }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource.slice(),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      handleReorder(newData, newIndex);
    }
  };

  const DraggableContainer = (props: { [key: string]: any }) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({
    className,
    style,
    ...restProps
  }: {
    [key: string]: any;
  }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index =
      dataSource &&
      dataSource.findIndex(
        (x: IPersonData) => x.sequence === restProps["data-row-key"]
      );
    return <SortableItem index={index} {...restProps} />;
  };

  const toggleModal = (status: boolean) => {
    setIsModalVisible(status);
  };

  const handleShowModel = (record?: IPersonData) => {
    if (record) {
      setUpdateRecord(record);
    }
    toggleModal(true);
  };

  const handleHideModal = () => {
    setUpdateRecord({});
    toggleModal(false);
  };

  const handleSave = async (name: string, id?: number) => {
    try {
      if (id) {
        const newData = [...dataSource];
        let record: IPersonData | undefined;
        newData.map((item: IPersonData) => {
          if (item.id === id) {
            item.name = name;
            record = { ...item };
            return { ...item };
          } else {
            return item;
          }
        });
        if (record) {
          loader("Saving change, Please wait..!")
          const result = await PeopleDataService.update(record, record!.id);
          if (result?.data?.httpStatus === 200) {
            setDataSource(newData);
            successMessage(result?.data?.message);
          } else {
            errorMessage("Failed to save data, please try again.");
          }
        }
      } else {
        loader("Saving change, Please wait..!")
        const result = await PeopleDataService.create({ name: name });
        if (result?.data?.httpStatus === 200) {
          successMessage(result?.data?.message);
        } else {
          errorMessage("Failed to save data, please try again.");
        }
        await retriveData();
      }
      handleHideModal();
    } catch (error) {
      console.log("Error::", error);
      errorMessage("Failed to save data, please try again.");
    }
  };

  const handleReorder = async (newData: IPersonData[], newIndex: number) => {
    try {
      const id = newData[newIndex]?.id;
      const payload = {
        prevSequenceNumber: newData[newIndex - 1]?.sequence,
        nextSequenceNumber: newData[newIndex + 1]?.sequence,
        name: newData[newIndex]?.name,
      };
      const result = await PeopleDataService.updateOrder(payload, id);
      if (result?.data?.httpStatus === 200) {
        const currentSequence = PeopleDataService.getNewSquenceNumber(
          newData,
          newIndex
        );
        newData[newIndex].sequence = currentSequence;
        setDataSource(newData);
        setForceReload(
          PeopleDataService.reorderPeopleSequence(
            currentSequence,
            payload.prevSequenceNumber,
            payload.nextSequenceNumber
          )
        );
      } else {
        errorMessage("Failed to save changes, please try again.");
        setForceReload(true);
      }
    } catch (error) {
      errorMessage("Failed to save changes, please try again.");
      setForceReload(true);
    }
  };

  const handleDelete = async (record: IPersonData) => {
    try {
      const newData = dataSource.filter(
        (item: IPersonData) => item.id !== record.id
      );
      const result = await PeopleDataService.delete(record.id!);
      if (result?.data?.httpStatus === 200) {
        setDataSource(newData);
        successMessage(result?.data?.message);
      } else {
        errorMessage("Failed to save data, please try again.");
      }
    } catch (error) {
      errorMessage("Failed to save data, please try again.");
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => handleShowModel()}
        style={{ float: "left", margin: 10 }}
      >
        Add Person
      </Button>
      <AddModalComponent
        showModal={isModalVisible}
        handleHideModal={handleHideModal}
        handleSave={handleSave}
        updateRecord={updateRecord}
      />
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        rowKey="sequence"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </div>
  );
};

export default TableViewComponent;
