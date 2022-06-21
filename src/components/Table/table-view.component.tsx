import { DeleteOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Space, Table, Popconfirm } from "antd";
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

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: "grab",
      color: "#999",
    }}
  />
));

// const data: IPersonData[] = [
//   {
//     key: 1,
//     name: "John Brown",
//     sequence: 1024,
//   },
//   {
//     key: 2,
//     name: "Jim Green",
//     sequence: 2048,
//   },
//   {
//     key: 3,
//     name: "Joe Black",
//     sequence: 3072,
//   },
// ];
const SortableItem = SortableElement((props: { [key: string]: any }) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: { [key: string]: any }) => (
  <tbody {...props} />
));

const TableViewComponent = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [updateRecord, setUpdateRecord] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("here")
      try {
        const peoplesData = await PeopleDataService.getAll();
        setDataSource(peoplesData.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
      console.log("Sorted items: ", newData);
      setDataSource(newData);
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
    const index = dataSource.findIndex(
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
      setDataSource(newData);
      if (record) {
        await PeopleDataService.update(record, record.id)
      }      
    }
    handleHideModal();
  };

  const handleDelete = (record: IPersonData) => {
    const newData = dataSource.filter((item: IPersonData) => item.id !== record.id);
    setDataSource(newData);
  };

  return (
    <div>
      {/* <Space> */}
      <Button
        type="primary"
        onClick={() => handleShowModel()}
        style={{ float: "left", margin: 10 }}
      >
        Add Person
      </Button>
      {/* </Space> */}
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