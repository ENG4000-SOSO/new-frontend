import {
  Checkbox,
  Table,
} from "@chakra-ui/react";
import { OrderType } from "@customTypes/order";

type BaseOrderTableProps = {
  orders: OrderType[];
  readonly: boolean;
  maxWidth?: string
}

type ReadOnlyOrderTableProps = BaseOrderTableProps & {
  readonly: true;
};

type ReadAndWriteOrderTableProps = BaseOrderTableProps & {
  selectedOrderIDs: number[];
  setSelectedOrderIDs: React.Dispatch<React.SetStateAction<number[]>>;
  readonly: false;
};

type OrderTableProps = ReadOnlyOrderTableProps | ReadAndWriteOrderTableProps;

const OrderTable: React.FC<OrderTableProps> = (props) => {
  return (
    <Table.ScrollArea borderWidth="1px" maxHeight="250px" maxWidth={props.maxWidth ? props.maxWidth : "md"}>
      <Table.Root interactive>
        <Table.Header>
          <Table.Row>
            {!props.readonly
              ? (
                <Table.ColumnHeader>
                  <Checkbox.Root
                    size="sm"
                    top="0.5"
                    aria-label="Select all rows"
                    checked={
                      props.selectedOrderIDs.length > 0
                        ? props.selectedOrderIDs.length == props.orders.length
                          ? true
                          : "indeterminate"
                        : false
                    }
                    onCheckedChange={
                      changes => props.setSelectedOrderIDs(
                        changes.checked
                          ? props.orders.map(order => order.id)
                          : []
                      )
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader>
              ) : <></>
            }
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Longitude</Table.ColumnHeader>
            <Table.ColumnHeader>Latitude</Table.ColumnHeader>
            <Table.ColumnHeader>Start</Table.ColumnHeader>
            <Table.ColumnHeader>End</Table.ColumnHeader>
            <Table.ColumnHeader>Delivery</Table.ColumnHeader>
            <Table.ColumnHeader>Priority</Table.ColumnHeader>
            <Table.ColumnHeader>Resolution</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.orders.map((order, index) => (
            <Table.Row key={index}>
              {!props.readonly
                ? (
                  <Table.Cell>
                    <Checkbox.Root
                      size="sm"
                      top="0.5"
                      aria-label="Select row"
                      checked={props.selectedOrderIDs.includes(order.id)}
                      onCheckedChange={
                        changes => props.setSelectedOrderIDs(
                          prev => changes.checked
                            ? [...prev, order.id]
                            : prev.filter(id => id != order.id)
                        )
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>
                ) : <></>
              }
              <Table.Cell>{order.image_name}</Table.Cell>
              <Table.Cell>{order.longitude}</Table.Cell>
              <Table.Cell>{order.latitude}</Table.Cell>
              <Table.Cell>{order.image_start_time}</Table.Cell>
              <Table.Cell>{order.image_end_time}</Table.Cell>
              <Table.Cell>{order.delivery_time}</Table.Cell>
              <Table.Cell>{order.priority}</Table.Cell>
              <Table.Cell>{order.image_type}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default OrderTable;
