import { DeleteOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { arrayMoveImmutable } from "array-move";
import { useState } from "react";
import "./style.css";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import AddModalComponent from "../modals/add-modal.component";

interface DataType {
  key: string;
  name: string;
  sequence: number;
}

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: "grab",
      color: "#999",
    }}
  />
));

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    sequence: 1024,
  },
  {
    key: "2",
    name: "Jim Green",
    sequence: 2048,
  },
  {
    key: "3",
    name: "Joe Black",
    sequence: 3072,
  },
];
const SortableItem = SortableElement((props: { [key: string]: any }) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: { [key: string]: any }) => (
  <tbody {...props} />
));

const App = () => {
  const [dataSource, setDataSource] = useState(data);
  const [addModalVisible, setAddModalVisible] = useState(false);

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
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <EditOutlined onClick={() => showEditModel(record)} />
          <DeleteOutlined onClick={() => showDeleteModel(record)} />
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
      (x: DataType) => x.sequence === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const toggleAddModal = (status: boolean) => {
    setAddModalVisible(status);
  };

  const showEditModel = (record: DataType) => {
    toggleAddModal(true);
  };

  const showDeleteModel = (record: DataType) => {};

  return (
    <div>
      <Button type="primary" onClick={() => toggleAddModal(true)}>
        Add Person
      </Button>
      <AddModalComponent showModal={addModalVisible} toggleAddModal={toggleAddModal} />
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

export default App;
