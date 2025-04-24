import {
  Table,
  Checkbox,
} from "@chakra-ui/react";
import React from 'react';
import { SatelliteType } from "@customTypes/satellite";

type ReadOnlySatelliteTableProps = {
  satellites: SatelliteType[];
  readonly: true;
};

type ReadAndWriteSatelliteTableProps = {
  satellites: SatelliteType[];
  selectedSatelliteIDs: number[];
  setSelectedSatelliteIDs: React.Dispatch<React.SetStateAction<number[]>>;
  readonly: false;
};

type SatelliteTableProps = ReadOnlySatelliteTableProps | ReadAndWriteSatelliteTableProps;

const SatelliteTable: React.FC<SatelliteTableProps> = (props) => {
  return (
    <Table.ScrollArea borderWidth="1px" maxHeight="250px" maxW="xs">
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
                      props.selectedSatelliteIDs.length > 0
                        ? props.selectedSatelliteIDs.length == props.satellites.length
                          ? true
                          : "indeterminate"
                        : false
                    }
                    onCheckedChange={
                      changes => props.setSelectedSatelliteIDs(
                        changes.checked
                          ? props.satellites.map(satellite => satellite.id)
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
          {props.satellites.map((satellite, index) => (
            <Table.Row key={index}>
              {!props.readonly
                ? (
                  <Table.Cell>
                    <Checkbox.Root
                      size="sm"
                      top="0.5"
                      aria-label="Select row"
                      checked={props.selectedSatelliteIDs.includes(satellite.id)}
                      onCheckedChange={
                        changes => props.setSelectedSatelliteIDs(
                          prev => changes.checked
                            ? [...prev, satellite.id]
                            : prev.filter(id => id != satellite.id)
                        )
                      }
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>
                ) : <></>
              }
              <Table.Cell>{satellite.satellite_name}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default SatelliteTable;
