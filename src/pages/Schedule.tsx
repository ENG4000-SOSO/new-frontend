import {
  Box,
  // Button,
  // ButtonGroup,
  Text,
  Heading,
  // HStack,
  // Skeleton,
  // SkeletonCircle,
  // SkeletonText,
  Stack,
  // Steps,
  // StepsChangeDetails,
  Spinner,
  Highlight,
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ScheduleRequestType, SchedulingInputOutputData, PlannedOrder } from "@customTypes/schedule";
import dayjs from "dayjs";
import minMax from 'dayjs/plugin/minMax';
import './schedule.css';
import FullCalendar from '@fullcalendar/react';
import { EventContentArg } from "@fullcalendar/core/index.js";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import seedrandom from 'seedrandom';

dayjs.extend(minMax);

const getEarliestDate = (orders: PlannedOrder[]) => {
  if (orders.length === 0) {
    return dayjs().format('YYYY-MM-DD');
  }
  const minDate = dayjs.min(orders.map(order => dayjs(order.job_begin)));
  if (minDate) {
    return minDate.format('YYYY-MM-DD');
  } else {
    return dayjs().format('YYYY-MM-DD');
  }
};

function shuffle<T>(array: Array<T>, seed: string) {
  const rng = seedrandom(seed);
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const SEED_STRING = "f8erhfw38h48hf3f8h4e803whr";

const COLOR_PALETTE = shuffle([
  '#c084fc', '#f472b6', '#22d3ee', '#60a5fa', '#2dd4bf', '#4ade80', '#facc15', '#fb923c',
  '#2f0553', '#45061f', '#072a38', '#14204a', '#032726', '#042713', '#422006', '#3b1106'
], SEED_STRING);
const TEXT_COLOR_PALETTE = shuffle([
  '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000',
  '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'
], SEED_STRING);

function stringToIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLOR_PALETTE.length;
}

function stringToColor(name: string): string {
  return COLOR_PALETTE[stringToIndex(name)];
}

function stringToTextColor(name: string): string {
  return TEXT_COLOR_PALETTE[stringToIndex(name)];
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const {
    longitude,
    latitude,
    satelliteName,
    groundStationName,
    jobBegin,
    jobEnd,
    downlinkBegin,
    downlinkEnd,
    priority
  } = eventInfo.event.extendedProps;
  const tooltipContent = (
    <Box>
      <div>
        <strong>Image at:</strong>{" "}
        {parseFloat(latitude).toFixed(5)},{" "}
        {parseFloat(longitude).toFixed(5)}{" "}
        ({priority == 1 ? "Low" : priority == 2 ? "Medium" : "High"} Priority)
      </div>
      <div>
      </div>
      <hr style={{ marginTop: 5, marginBottom: 5 }} />
      <div>
        <strong>Satellite</strong> {satelliteName} <strong>takes image</strong>
        <br />
        <strong>From</strong> {dayjs(jobBegin).format('MMMM D, YYYY h:mm A')}
        <br />
        <strong>To</strong> {dayjs(jobEnd).format('MMMM D, YYYY h:mm A')}
      </div>
      <hr style={{ marginTop: 5, marginBottom: 5 }} />
      <div>
        <strong>Downlinked via</strong> {groundStationName} ground station
        <br />
        <strong>From</strong> {dayjs(downlinkBegin).format('MMMM D, YYYY h:mm A')}
        <br />
        <strong>To</strong> {dayjs(downlinkEnd).format('MMMM D, YYYY h:mm A')}
      </div>
    </Box>
  );

  return (
    <Tippy content={tooltipContent} placement="top">
      <div style={{ fontSize: 10, color: stringToTextColor(satelliteName) }}>{eventInfo.timeText}</div>
    </Tippy>
  );
};

const Schedule = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  const [schedule, setSchedule] = useState<ScheduleRequestType | undefined>(undefined);
  const [scheduleOutput, setScheduleOutput] = useState<SchedulingInputOutputData | undefined>(undefined);

  const fetchSchedule = async () => {
    try {
      const res = await api.get<ScheduleRequestType>(`/schedule/${id}`);
      setSchedule(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch schedule", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const fetchScheduleOutput = async () => {
    try {
      const res = await api.get<SchedulingInputOutputData>(`/schedule/output/${id}`);
      setScheduleOutput(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch schedule", description: String(e), type: "error" });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (schedule && schedule.status && schedule.status.toLowerCase() == "completed") {
      fetchScheduleOutput();
    }
  }, [schedule]);

  return (
    <Stack>
      {schedule
        ? (
          <div>
            <Heading>{schedule.id}</Heading>
          </div>
        )
        : (<Spinner />)
      }
      {scheduleOutput
        ? (
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin]}
            initialDate={getEarliestDate(Object.values(scheduleOutput.output.planned_orders).flat())}
            initialView="timeGridWeek"
            events={Object.entries(scheduleOutput.output.planned_orders)
              .flatMap(
                ([satelliteName, orders]) => orders.map(
                  order => ({
                    title: satelliteName,
                    start: order.job_begin,
                    end: order.job_end,
                    color: stringToColor(satelliteName),
                    extendedProps: {
                      latitude: order.job.latitude,
                      longitude: order.job.longitude,
                      satelliteName: order.satellite_name,
                      groundStationName: order.ground_station_name,
                      jobBegin: order.job_begin,
                      jobEnd: order.job_end,
                      downlinkBegin: order.downlink_begin,
                      downlinkEnd: order.downlink_end,
                      priority: order.job.priority
                    }
                  })
                )
              )
            }
            eventContent={renderEventContent}
            editable={false}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
          />
        )
        : (<Spinner />)}
    </Stack>
  );
};

export default Schedule;
