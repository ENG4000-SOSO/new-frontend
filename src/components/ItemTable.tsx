import {
  Table,
  Checkbox,
} from "@chakra-ui/react";
import React from 'react';
import { GroundStationType } from "@customTypes/ground_station";

type BaseItemTableProps<T> = {
  items: T[];
  readonly: boolean;
};

type ReadOnlyItemTableProps<T> = BaseItemTableProps<T> & {
  readonly: true;
};

type ReadAndWriteItemTableProps<T> = BaseItemTableProps<T> & {
  selectedItemIDs: number[];
  setSelectedItemIDs: React.Dispatch<React.SetStateAction<number[]>>;
  readonly: false;
};

type ItemTableProps<T> = ReadOnlyItemTableProps<T> | ReadAndWriteItemTableProps<T>;

function GroundStationTable<T>(props: ItemTableProps<T>) {
  return (
    <Table.ScrollArea borderWidth="1px" maxHeight="250px">
      <Table.Root interactive variant="outline">
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
                props.sele.length > 0
                  ? selectedGroundStationIDs.length == groundStations.length
                    ? true
                    : "indeterminate"
                  : false
              }
              onCheckedChange={
                changes => setSelectedGroundStationIDs(
                  changes.checked
                    ? groundStations.map(groundStation => groundStation.id)
                    : []
                )
              }
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
          </Table.ColumnHeader>
            )
                : <></>}
            <Table.ColumnHeader>
              Name
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {groundStations.map((groundStation, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Checkbox.Root
                  size="sm"
                  top="0.5"
                  aria-label="Select row"
                  checked={selectedGroundStationIDs.includes(groundStation.id)}
                  onCheckedChange={
                    changes => setSelectedGroundStationIDs(
                      prev => changes.checked
                        ? [...prev, groundStation.id]
                        : prev.filter(id => id != groundStation.id)
                    )
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.Cell>
              <Table.Cell>{groundStation.ground_station_name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}

export default GroundStationTable;
