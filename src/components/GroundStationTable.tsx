import {
  Table,
  Checkbox,
} from "@chakra-ui/react";
import React from 'react';
import { GroundStationType } from "@customTypes/ground_station";


type ReadOnlyGroundStationTableProps = {
  groundStations: GroundStationType[];
  readonly: true;
};

type ReadAndWriteGroundStationTableProps = {
  groundStations: GroundStationType[];
  selectedGroundStationIDs: number[];
  setSelectedGroundStationIDs: React.Dispatch<React.SetStateAction<number[]>>;
  readonly: false;
};

type GroundStationTableProps = ReadOnlyGroundStationTableProps | ReadAndWriteGroundStationTableProps;

const GroundStationTable: React.FC<GroundStationTableProps> = (props) => {
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
                      props.selectedGroundStationIDs.length > 0
                        ? props.selectedGroundStationIDs.length == props.groundStations.length
                          ? true
                          : "indeterminate"
                        : false
                    }
                    onCheckedChange={
                      changes => props.setSelectedGroundStationIDs(
                        changes.checked
                          ? props.groundStations.map(groundStation => groundStation.id)
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
            <Table.ColumnHeader>
              Name
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.groundStations.map((groundStation, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {!props.readonly
                  ? (
                    <Checkbox.Root
                      size="sm"
                      top="0.5"
                      aria-label="Select row"
                      checked={props.selectedGroundStationIDs.includes(groundStation.id)}
                      onCheckedChange={
                        changes => props.setSelectedGroundStationIDs(
                          prev => changes.checked
                            ? [...prev, groundStation.id]
                            : prev.filter(id => id != groundStation.id)
                        )
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  ) : <></>
                }
              </Table.Cell>
              <Table.Cell>{groundStation.ground_station_name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default GroundStationTable;
